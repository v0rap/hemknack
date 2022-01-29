/*
* interface Torrent {
    name: string;
    path: string;
    sizeKb: number;
    downloadedKb: number;
* };
*/
import GlobalState from "./global-state";
export interface FunctionTable {
    [key: string]: Function;
}
const COLUMN_OBJ: FunctionTable = {
    "downloaded": (torrent: Torrent) => {
        let percentage = (100 * torrent.downloadedKB / torrent.sizeKB).toFixed(2);
        return (`
            <div class="download-bar column">
                <div class="inner-download-bar" style="width: ${percentage}%"></div>
                <div>${percentage}%</div>
            </div>
        `)
    },
    "name": (torrent: Torrent) => `<div class="text-column column">${torrent.name}</div>`,
    "upSpeed": (torrent: Torrent) => `<div class="text-column column">${torrent.humanReadable(torrent.upSpeed)}B/s</div>`,
    "downSpeed": (torrent: Torrent) => `<div class="text-column column">${torrent.humanReadable(torrent.downSpeed)}B/s</div>`
}

class Torrent {
    name: string;
    path: string;
    hash: string;

    updateAvailable: boolean;

    sizeKB: number;
    downloadedKB: number;

    upSpeed: number;
    downSpeed: number;

    domElement: HTMLElement;

    constructor(
        name: string,
        hash: string,
        path: string,
        sizeKB: number,
        downloadedKB: number,
        upSpeed: number,
        downSpeed: number) {
        this.name = name;
        this.path = path;
        this.hash = hash;
        this.upSpeed = upSpeed;
        this.downSpeed = downSpeed;
        this.sizeKB = sizeKB;
        this.downloadedKB = downloadedKB;
        this.updateAvailable = false;
        this.domElement = document.createElement('tr');
        this.domElement.setAttribute("class", "list-item torrent");
    }

    getUpdate() {
        if (!this.updateAvailable) return;
        this.downSpeed = Math.random() * 10000000;
        this.upSpeed = Math.random() * 10000000;
        if(this.downloadedKB < this.sizeKB) this.downloadedKB += 20000;
    }

    render(selectedColumns: string[]): HTMLElement {
        this.updateAvailable = false;
        this.domElement.innerHTML = this._generateListItem(selectedColumns);
        return this.domElement;
    }

    _generateListItem(selectedColumns: string[]) {
        this.domElement.id = this.hash;
        const columns = selectedColumns.map(column => {
            return `<td>${COLUMN_OBJ[column](this)}</td>`;
        });
        return columns.join("\n");
    }

    humanReadable(value: number)
    {
        const base = 1024;
        const prefixes = ['Ki', 'Mi', 'Gi', 'Ti'];
        for (let i = prefixes.length; i > 0; i--)
        {
            const divisor = base**i;
            if (value > divisor) return `${(value / divisor).toFixed(2)} ${prefixes[i-1]}`;
        }
    }
    remove()
    {
        // @ts-ignore: Syftningsfel.
        // TODO: Do (dvs, implementera dumskalle)
    }
    onupdate()
    {

    }
    static addFromMagnet(magnetUrl: string): Torrent
    {
        GlobalState.signaler.addTorrent(magnetUrl);
        // @ts-expect-error: This hasn't been implemented yet
        return new Torrent();
    }
}
export default Torrent;