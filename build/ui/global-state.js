"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-ignore
var GlobalState = module.exports = {
    version: "1.0",
    selectedTorrents: [],
    select: function (selected) {
        GlobalState.selectedTorrents = selected;
    },
    getTorrent: function (hash) {
        GlobalState.torrents.forEach(torrent => {
            if (torrent.hash === hash)
                return torrent;
        });
        return null;
    },
    torrents: []
};
exports.default = GlobalState;
