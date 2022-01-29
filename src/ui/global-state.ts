import Torrent from './torrent'
import WebWindowManager from './window'
import Signaler from './signaling'
interface GlobalState {
    selectedTorrents: Torrent[];
    torrents: Torrent[];
    select: Function;
    getTorrent: Function;
    version: string;
    wm: WebWindowManager;
    signaler: Signaler;
}
//@ts-ignore
var GlobalState: GlobalState = module.exports = {
    version: "1.0",
    selectedTorrents: [],
    select: function(selected: Torrent[]) {
        GlobalState.selectedTorrents = selected;
    },
    getTorrent: function(hash: string): Torrent | null
    {
        GlobalState.torrents.forEach(torrent => {
            if (torrent.hash === hash) return torrent;
        });
        return null;
    },
    torrents: []
};
export default GlobalState;