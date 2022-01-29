"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
* interface Torrent {
    name: string;
    path: string;
    sizeKb: number;
    downloadedKb: number;
* };
*/
const global_state_1 = __importDefault(require("./global-state"));
const COLUMN_OBJ = {
    "downloaded": (torrent) => {
        let percentage = (100 * torrent.downloadedKB / torrent.sizeKB).toFixed(2);
        return (`
            <div class="download-bar column">
                <div class="inner-download-bar" style="width: ${percentage}%"></div>
                <div>${percentage}%</div>
            </div>
        `);
    },
    "name": (torrent) => `<div class="text-column column">${torrent.name}</div>`,
    "upSpeed": (torrent) => `<div class="text-column column">${torrent.humanReadable(torrent.upSpeed)}B/s</div>`,
    "downSpeed": (torrent) => `<div class="text-column column">${torrent.humanReadable(torrent.downSpeed)}B/s</div>`
};
class Torrent {
    constructor(name, hash, path, sizeKB, downloadedKB, upSpeed, downSpeed) {
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
        if (!this.updateAvailable)
            return;
        this.downSpeed = Math.random() * 10000000;
        this.upSpeed = Math.random() * 10000000;
        if (this.downloadedKB < this.sizeKB)
            this.downloadedKB += 20000;
    }
    render(selectedColumns) {
        this.updateAvailable = false;
        this.domElement.innerHTML = this._generateListItem(selectedColumns);
        return this.domElement;
    }
    _generateListItem(selectedColumns) {
        this.domElement.id = this.hash;
        const columns = selectedColumns.map(column => {
            return `<td>${COLUMN_OBJ[column](this)}</td>`;
        });
        return columns.join("\n");
    }
    humanReadable(value) {
        const base = 1024;
        const prefixes = ['Ki', 'Mi', 'Gi', 'Ti'];
        for (let i = prefixes.length; i > 0; i--) {
            const divisor = base ** i;
            if (value > divisor)
                return `${(value / divisor).toFixed(2)} ${prefixes[i - 1]}`;
        }
    }
    remove() {
        // @ts-ignore: Syftningsfel.
        // TODO: Do (dvs, implementera dumskalle)
    }
    onupdate() {
    }
    static addFromMagnet(magnetUrl) {
        global_state_1.default.signaler.addTorrent(magnetUrl);
        // @ts-expect-error: This hasn't been implemented yet
        return new Torrent();
    }
}
exports.default = Torrent;
