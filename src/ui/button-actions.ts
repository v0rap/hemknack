import {FunctionTable} from "./torrent";
import Torrent from './torrent';
import GlobalState from './global-state';
import {clipboard, JumpListCategory} from "electron";
import {WebWindowEvent} from './window'

const removeSelected = () => {
    // TODO: Maybe prompt the user???
    GlobalState.selectedTorrents.forEach(t => {
        t.remove();
    });
}

const addTorrent = (url: string | null | undefined): void => {
    // TODO: Magic stuffs to make sure it's actually a magnet url
    console.log(url);
    GlobalState.torrents.push(
        Torrent.addFromMagnet(<string>url)
    );
}

const showAddDialog = () => {
    const _window = GlobalState.wm.addWindow("Add new torrent", 250, 200, (window.innerWidth - 200) / 2, (window.innerHeight - 200) / 2);
    _window.onclose = (event: WebWindowEvent) => {
        event.target.windowManager.setFocus(event.target, false);
    }
    GlobalState.wm.setFocus(_window, true);
    _window.setBodyHTML('<h2 style="text-align:center">Add URL</h2> \
                         <div class="window-add-torrent-input-area"> \
                            <input type="text" id="add-torrent-input" placeholder="Magnet url..."> \
                            <button id="add-torrent-button">Add</button> \
                         </div>');
    const textInput = <HTMLInputElement>document.getElementById('add-torrent-input');
    const button = document.getElementById('add-torrent-button');
    button?.addEventListener('click', () => {
        addTorrent(textInput?.value);
        GlobalState.wm.closeWindow(_window);
    })
    textInput?.addEventListener('keydown', event => {
        if (event.code === 'Enter')
        {
            event.preventDefault();
            addTorrent(textInput?.value);
            GlobalState.wm.closeWindow(_window);
        }
    })
    const clipboardContent = clipboard.readText();
    if (clipboardContent.startsWith('magnet:?')) textInput.value = clipboardContent;
}

const ACTION_LUT: FunctionTable = {
    'addNew': showAddDialog,
    'removeSelected': removeSelected
}

export default ACTION_LUT;