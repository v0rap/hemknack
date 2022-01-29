import {readFileSync} from 'fs';
import path from 'path';
import Torrent from "./torrent";
import ACTION_LUT from "./button-actions";
import Signaler from "./signaling";
import WebWindowManager from './window';
import GlobalState from './global-state';

const selectedColumns = ["name", "downloaded", "downSpeed", "upSpeed"];

const _generateLegend = (selectedColumns: string[]) => {
    const legendRoot: HTMLElement = document.createElement("tr");
    legendRoot.setAttribute("class", "legend");
    selectedColumns.forEach(colName => {
        const legendItemTd = document.createElement("td");
        const legendItem = document.createElement("div");
        legendItem.innerHTML = `${colName}`;
        legendItem.setAttribute("class", "column")
        legendItemTd.appendChild(legendItem);
        legendRoot.appendChild(legendItemTd);
    });
    return legendRoot;
}

interface InputData {
    torrents: Torrent[];
}
window.addEventListener('DOMContentLoaded', () => {
    GlobalState.wm = new WebWindowManager();
    GlobalState.signaler = new Signaler("127.0.0.1:8081");
    
    const torrents: Torrent[] = [
        new Torrent("Fint Namn", "1283790127389", "/home/fint", 100000, 8000, 100000, 10020),
        new Torrent("Fint Namn 2 - uppföljaren", "7831290378904", "/home/fult", 10000000, 1723839, 1894279810, 12938),
    ];
    const renderList = (): void => {
        const listContainer = document.getElementById("torrent-list");
        if (listContainer === null) return;
        if (torrents === undefined) return;
        listContainer.appendChild(_generateLegend(selectedColumns));
        torrents.forEach(torrent => {
            listContainer.appendChild(torrent.render(selectedColumns));
        });
    }

    const buttons = Array.from(document.getElementsByClassName("toolbar-button"));
    buttons.forEach(button => {
        button.addEventListener('click', e => {
            if (e.target === null) return;
            // @ts-ignore: No code error here. Look away.
            const self: HTMLElement = e.target;
            if (self.dataset.action === undefined) return;
            const action: string = self.dataset.action;
            ACTION_LUT[action]();
        });
    });

    window.setInterval(() => {
        torrents[0].getUpdate();
        torrents[0].render(selectedColumns);
    }, 2000)
    renderList();
})