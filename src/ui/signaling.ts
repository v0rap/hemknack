import {FunctionTable} from './torrent';
import Torrent from "./torrent";
import GlobalState from "./global-state";
const DELIM = "�";

/*
NEW <name> <path> <hash> <size> <downloaded> <upSpeed> <downSpeed>
UPDATE <hash> <downloaded> <upSpeed> <downSpeed> [<name> <path> <size>]
*/
class Signaler {
    websocket: WebSocket;
    FUNCTION_LUT: FunctionTable;
    endpoint: string;
    constructor(endpoint: string)
    {
        this.endpoint = endpoint;
        this.FUNCTION_LUT = {
            'UPDATE': this.updateTorrent,
            'NEW': this.newTorrent,
            'OLEH': this.oleh,

        }
        this.websocket = new WebSocket('ws://' + this.endpoint);
        this.websocket.addEventListener('message', this.handleMessage);
        this.websocket.addEventListener("open", () => this.helo(GlobalState.version));
    }
    addTorrent(magnetUrl: string)
    {
        fetch('http://' + this.endpoint + '/api/v1/addFromMagnet', {
            method: 'POST',
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({
                magnetUrl: magnetUrl
            })
        });
    }
    getTorrent(magnetUrl: string)
    {
        this.websocket.send(`GET ${magnetUrl}`);
    }
    helo(version: string) {
        this.websocket.send(`HELO ${version}`)
    }
    oleh(messagev: string[]) {
        console.log(messagev);
    }
    handleMessage(event: MessageEvent) {
        const message: string = event.data;
        const messagev = message.split(DELIM);
        this.FUNCTION_LUT[messagev[0]](messagev);
    }

    updateTorrent(messagev: string[])
    {
        const hash: string = messagev[1];
        const downloaded: number = Number(messagev[2]);
        const upSpeed: number = Number(messagev[3]);
        const downSpeed: number = Number(messagev[4]);

        // Optional
        const name: string = messagev[5];
        const path: string = messagev[6];
        const size: number = Number(messagev[7]);

        const torrent: Torrent = GlobalState.getTorrent(hash);

        //TODO: Maybe ask for that torrent again
        if (torrent === null) return;

        torrent.upSpeed = upSpeed;
        torrent.downSpeed = downSpeed;
        torrent.downloadedKB = downloaded;
        torrent.updateAvailable = true;
        if (name !== undefined) torrent.name = name;
        if (path !== undefined) torrent.path = path;
        if (size !== undefined) torrent.sizeKB = size;
        torrent.onupdate();
    }
    
    newTorrent(messagev: string[])
    {
        const name: string = messagev[1];
        const path: string = messagev[2];
        const hash: string = messagev[3];
        const size: number = Number(messagev[4]);
        const downloaded: number = Number(messagev[5]);
        const upSpeed: number = Number(messagev[6]);
        const downSpeed: number = Number(messagev[7]);

        const torrent = new Torrent(name, hash, path, size, downloaded, upSpeed, downSpeed);
        GlobalState.torrents.push(torrent);
    }
}
export default Signaler;