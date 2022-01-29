"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const torrent_1 = __importDefault(require("./torrent"));
const button_actions_1 = __importDefault(require("./button-actions"));
const signaling_1 = __importDefault(require("./signaling"));
const window_1 = __importDefault(require("./window"));
const global_state_1 = __importDefault(require("./global-state"));
const selectedColumns = ["name", "downloaded", "downSpeed", "upSpeed"];
const _generateLegend = (selectedColumns) => {
    const legendRoot = document.createElement("tr");
    legendRoot.setAttribute("class", "legend");
    selectedColumns.forEach(colName => {
        const legendItemTd = document.createElement("td");
        const legendItem = document.createElement("div");
        legendItem.innerHTML = `${colName}`;
        legendItem.setAttribute("class", "column");
        legendItemTd.appendChild(legendItem);
        legendRoot.appendChild(legendItemTd);
    });
    return legendRoot;
};
window.addEventListener('DOMContentLoaded', () => {
    global_state_1.default.wm = new window_1.default();
    global_state_1.default.signaler = new signaling_1.default("127.0.0.1:8081");
    const torrents = [
        new torrent_1.default("Fint Namn", "1283790127389", "/home/fint", 100000, 8000, 100000, 10020),
        new torrent_1.default("Fint Namn 2 - uppföljaren", "7831290378904", "/home/fult", 10000000, 1723839, 1894279810, 12938),
    ];
    const renderList = () => {
        const listContainer = document.getElementById("torrent-list");
        if (listContainer === null)
            return;
        if (torrents === undefined)
            return;
        listContainer.appendChild(_generateLegend(selectedColumns));
        torrents.forEach(torrent => {
            listContainer.appendChild(torrent.render(selectedColumns));
        });
    };
    const buttons = Array.from(document.getElementsByClassName("toolbar-button"));
    buttons.forEach(button => {
        button.addEventListener('click', e => {
            if (e.target === null)
                return;
            // @ts-ignore: No code error here. Look away.
            const self = e.target;
            if (self.dataset.action === undefined)
                return;
            const action = self.dataset.action;
            button_actions_1.default[action]();
        });
    });
    window.setInterval(() => {
        torrents[0].getUpdate();
        torrents[0].render(selectedColumns);
    }, 2000);
    renderList();
});
