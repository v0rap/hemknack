"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const torrent_1 = __importDefault(require("./torrent"));
const global_state_1 = __importDefault(require("./global-state"));
const DELIM = "�";
/*
NEW <name> <path> <hash> <size> <downloaded> <upSpeed> <downSpeed>
UPDATE <hash> <downloaded> <upSpeed> <downSpeed> [<name> <path> <size>]
*/
class Signaler {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.FUNCTION_LUT = {
            'UPDATE': this.updateTorrent,
            'NEW': this.newTorrent,
            'OLEH': this.oleh,
        };
        this.websocket = new WebSocket('ws://' + this.endpoint);
        this.websocket.addEventListener('message', this.handleMessage);
        this.websocket.addEventListener("open", () => this.helo(global_state_1.default.version));
    }
    addTorrent(magnetUrl) {
        fetch('http://' + this.endpoint + '/api/v1/addFromMagnet', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                magnetUrl: magnetUrl
            })
        });
    }
    getTorrent(magnetUrl) {
        this.websocket.send(`GET ${magnetUrl}`);
    }
    helo(version) {
        this.websocket.send(`HELO ${version}`);
    }
    oleh(messagev) {
        console.log(messagev);
    }
    handleMessage(event) {
        const message = event.data;
        const messagev = message.split(DELIM);
        this.FUNCTION_LUT[messagev[0]](messagev);
    }
    updateTorrent(messagev) {
        const hash = messagev[1];
        const downloaded = Number(messagev[2]);
        const upSpeed = Number(messagev[3]);
        const downSpeed = Number(messagev[4]);
        // Optional
        const name = messagev[5];
        const path = messagev[6];
        const size = Number(messagev[7]);
        const torrent = global_state_1.default.getTorrent(hash);
        //TODO: Maybe ask for that torrent again
        if (torrent === null)
            return;
        torrent.upSpeed = upSpeed;
        torrent.downSpeed = downSpeed;
        torrent.downloadedKB = downloaded;
        torrent.updateAvailable = true;
        if (name !== undefined)
            torrent.name = name;
        if (path !== undefined)
            torrent.path = path;
        if (size !== undefined)
            torrent.sizeKB = size;
        torrent.onupdate();
    }
    newTorrent(messagev) {
        const name = messagev[1];
        const path = messagev[2];
        const hash = messagev[3];
        const size = Number(messagev[4]);
        const downloaded = Number(messagev[5]);
        const upSpeed = Number(messagev[6]);
        const downSpeed = Number(messagev[7]);
        const torrent = new torrent_1.default(name, hash, path, size, downloaded, upSpeed, downSpeed);
        global_state_1.default.torrents.push(torrent);
    }
}
exports.default = Signaler;
