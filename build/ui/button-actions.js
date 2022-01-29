"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const torrent_1 = __importDefault(require("./torrent"));
const global_state_1 = __importDefault(require("./global-state"));
const electron_1 = require("electron");
const removeSelected = () => {
    // TODO: Maybe prompt the user???
    global_state_1.default.selectedTorrents.forEach(t => {
        t.remove();
    });
};
const addTorrent = (url) => {
    // TODO: Magic stuffs to make sure it's actually a magnet url
    console.log(url);
    global_state_1.default.torrents.push(torrent_1.default.addFromMagnet(url));
};
const showAddDialog = () => {
    const _window = global_state_1.default.wm.addWindow("Add new torrent", 250, 200, (window.innerWidth - 200) / 2, (window.innerHeight - 200) / 2);
    _window.onclose = (event) => {
        event.target.windowManager.setFocus(event.target, false);
    };
    global_state_1.default.wm.setFocus(_window, true);
    _window.setBodyHTML('<h2 style="text-align:center">Add URL</h2> \
                         <div class="window-add-torrent-input-area"> \
                            <input type="text" id="add-torrent-input" placeholder="Magnet url..."> \
                            <button id="add-torrent-button">Add</button> \
                         </div>');
    const textInput = document.getElementById('add-torrent-input');
    const button = document.getElementById('add-torrent-button');
    button === null || button === void 0 ? void 0 : button.addEventListener('click', () => {
        addTorrent(textInput === null || textInput === void 0 ? void 0 : textInput.value);
        global_state_1.default.wm.closeWindow(_window);
    });
    textInput === null || textInput === void 0 ? void 0 : textInput.addEventListener('keydown', event => {
        if (event.code === 'Enter') {
            event.preventDefault();
            addTorrent(textInput === null || textInput === void 0 ? void 0 : textInput.value);
            global_state_1.default.wm.closeWindow(_window);
        }
    });
    const clipboardContent = electron_1.clipboard.readText();
    if (clipboardContent.startsWith('magnet:?'))
        textInput.value = clipboardContent;
};
const ACTION_LUT = {
    'addNew': showAddDialog,
    'removeSelected': removeSelected
};
exports.default = ACTION_LUT;
