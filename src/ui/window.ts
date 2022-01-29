class WebWindow {
    domElement: HTMLElement;
    x: number;
    y: number;
    width: number;
    height: number;
    title: string;
    startX = 0;
    startY = 0;
    startClientX = 0;
    startClientY = 0;
    windowManager: WebWindowManager;
    index = 0;
    minWidth = 200;
    minHeight = 50;
    startW = 200;
    startH = 50;
    resizeHandleSize = 10;
    hash;
    animationTime = 200;
    onclose: Function | undefined;
    constructor(title: string,
                x: number,
                y: number,
                width: number,
                height: number,
                windowManager: WebWindowManager,
                hash: string)
    {
        this.title = title;
        this.hash = hash;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.windowManager = windowManager;

        this.domElement = document.createElement('div');
        this.domElement.setAttribute('class', 'window');

        const closeButton = document.createElement('div');
        closeButton.setAttribute('class', 'window-titlebar-button close');
        closeButton.addEventListener('click', () => this.windowManager.closeWindow(this));
        closeButton.addEventListener('mousedown', event => event.stopPropagation());
        closeButton.innerHTML = "close";

        const titleBar = document.createElement('div');
        titleBar.setAttribute('class', 'window-titlebar');
        titleBar.innerHTML = this.title;
        titleBar.addEventListener('mousedown', event => this.#handleMouseDown(event));
        titleBar.appendChild(closeButton);

        const resizeAreaRight = document.createElement('div');
        resizeAreaRight.style.setProperty('width', this.resizeHandleSize + 'px')
        resizeAreaRight.style.setProperty('right', -this.resizeHandleSize/2 + 'px')
        resizeAreaRight.setAttribute('class', 'resize-handle hor');
        resizeAreaRight.addEventListener('mousedown', event => this.#handleResize(event));

        const resizeAreaLeft = document.createElement('div');
        resizeAreaLeft.style.setProperty('width', this.resizeHandleSize + 'px')
        resizeAreaLeft.style.setProperty('left', -this.resizeHandleSize/2 + 'px')
        resizeAreaLeft.setAttribute('class', 'resize-handle hor');
        resizeAreaLeft.addEventListener('mousedown', event => this.#handleResize(event));

        const resizeAreaBottom = document.createElement('div');
        resizeAreaBottom.style.setProperty('height', this.resizeHandleSize + 'px')
        resizeAreaBottom.style.setProperty('bottom', -this.resizeHandleSize/2 + 'px')
        resizeAreaBottom.setAttribute('class', 'resize-handle vert');
        resizeAreaBottom.addEventListener('mousedown', event => this.#handleResize(event));

        const resizeAreaBL = document.createElement('div');
        resizeAreaBL.style.setProperty('height', this.resizeHandleSize + 'px')
        resizeAreaBL.style.setProperty('width', this.resizeHandleSize + 'px')
        resizeAreaBL.style.setProperty('bottom', -this.resizeHandleSize/2 + 'px')
        resizeAreaBL.style.setProperty('left', -this.resizeHandleSize/2 + 'px')
        resizeAreaBL.setAttribute('class', 'resize-handle bl');
        resizeAreaBL.addEventListener('mousedown', event => this.#handleResize(event));

        const resizeAreaBR = document.createElement('div');
        resizeAreaBR.style.setProperty('height', this.resizeHandleSize + 'px')
        resizeAreaBR.style.setProperty('width', this.resizeHandleSize + 'px')
        resizeAreaBR.style.setProperty('bottom', -this.resizeHandleSize/2 + 'px')
        resizeAreaBR.style.setProperty('right', -this.resizeHandleSize/2 + 'px')
        resizeAreaBR.setAttribute('class', 'resize-handle br');
        resizeAreaBR.addEventListener('mousedown', event => this.#handleResize(event));

        const windowBody = document.createElement('div');
        windowBody.setAttribute('class', 'window-body');
        windowBody.addEventListener('mousedown', () => this.windowManager.setActive(this));

        this.domElement.style.setProperty('position', 'fixed');
        this.domElement.style.setProperty('width', this.width + 'px');
        this.domElement.style.setProperty('height', this.height + 'px');
        this.domElement.style.setProperty('left', this.x + 'px');
        this.domElement.style.setProperty('top', this.y + 'px');
        this.domElement.appendChild(titleBar);
        this.domElement.appendChild(windowBody);
        this.domElement.appendChild(resizeAreaRight);
        this.domElement.appendChild(resizeAreaLeft);
        this.domElement.appendChild(resizeAreaBottom);
        this.domElement.appendChild(resizeAreaBL);
        this.domElement.appendChild(resizeAreaBR);
        
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(this.domElement);
        const animation = this.domElement.animate([
            { transform: 'scale(0.5, 0)' },
            { transform: 'scale(1)' }
        ], {
            duration: this.animationTime,
            easing: 'ease-out',
            iterations: 1
        })
    }
    setIndex(index: number)
    {
        this.index = index;
        this.domElement.style.setProperty('z-index', (index + 100).toString());
    }
    setBodyHTML(string: string)
    {
        this.domElement.getElementsByClassName('window-body')[0].innerHTML = string;
    }
    appendChild(element: HTMLElement)
    {
        this.domElement.getElementsByClassName('window-body')[0].appendChild(element);
    }
    updatePos(x: number, y: number)
    {
        this.x = x < 0 ? 0 : x;
        this.y = y < 0 ? 0 : y;
        this.x = this.x+this.width > window.innerWidth ? window.innerWidth-this.width : this.x;
        this.y = this.y+this.height > window.innerHeight ? window.innerHeight-this.height : this.y;
        this.domElement.style.setProperty('left', this.x + 'px');
        this.domElement.style.setProperty('top', this.y + 'px');
    }
    close()
    {
        const animation = this.domElement.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(0.5, 0)' }
        ], {
            duration: this.animationTime,
            easing: 'ease-in',
            iterations: 1
        })
        animation.addEventListener('finish', event => {
            const body = document.getElementsByTagName('body')[0];
            body.removeChild(this.domElement);
        });
        if (this.onclose !== undefined) this.onclose(new WebWindowEvent(this, 'close'));
    }
    resize(clientX: number, clientY: number)
    {
        if ("bottom" === this.windowManager.resize[0]) {
            this.height = clientY - this.startClientY + this.startH;
            if (this.height < this.minHeight) this.height = this.minHeight;
            this.domElement.style.setProperty('height', this.height + 'px');
        }

        if ("right" === this.windowManager.resize[1]) {
            const window_x = clientX - this.startClientX + this.startW;
            this.width = window_x;
            if (this.width < this.minWidth) this.width = this.minWidth;
            this.domElement.style.setProperty('width', this.width + 'px');
        }
        else if ("left" === this.windowManager.resize[1]) {
            this.width = this.startW - clientX + this.startClientX;
            if (this.width < this.minWidth) this.width = this.minWidth;
            this.x = this.startX + this.startW - this.width;
            this.domElement.style.setProperty('left', this.x + 'px');
            this.domElement.style.setProperty('width', this.width + 'px');
        }
    }


    #handleResize(event: MouseEvent)
    {
        event.stopPropagation();
        this.windowManager.setActive(this);

        this.startClientX = event.clientX;
        this.startClientY = event.clientY;
        this.startX = this.x;
        this.startY = this.y;
        this.startW = this.width;
        this.startH = this.height;
        if (this.startClientY - this.startY >= this.height - this.resizeHandleSize/2) this.windowManager.resize[0] = 'bottom'
        if (this.startClientX - this.startX >= this.width - this.resizeHandleSize/2) this.windowManager.resize[1] = 'right'
        if (this.startClientX - this.startX <= this.resizeHandleSize/2) this.windowManager.resize[1] = 'left'
        this.domElement.dataset.resize = 'true'
    }
    #handleMouseDown(event: MouseEvent)
    {
        event.preventDefault();
        event.stopPropagation();
        this.windowManager.setActive(this);

        this.startClientX = event.clientX;
        this.startClientY = event.clientY;
        this.startX = this.x;
        this.startY = this.y;
        this.windowManager.holding = true;
        this.domElement.dataset.holding = 'true'
    }
}

class WebWindowManager {
    borderOffset = 50;
    lastX;
    lastY;
    windows: Map<string, WebWindow>;
    activeWindow: WebWindow | undefined;
    holding: boolean = false;
    resize: string[] = [];
    nextHash = 0;
    windowOffset = 20;
    blocker: HTMLElement;
    constructor()
    {
        this.windows = new Map();
        this.lastX = this.borderOffset;
        this.lastY = this.borderOffset;
        document.addEventListener('mousemove', event => this.#handleMouseOver(event))
        document.addEventListener('mouseup', event => this.#handleMouseUp(event))

        this.blocker = document.createElement('div');
        this.blocker.setAttribute('class', 'window-blocker');
        const body = document.getElementsByTagName('body')[0];
        body.appendChild(this.blocker);
    }
    setActive(_window: WebWindow)
    {
        if (this.activeWindow !== undefined && _window.hash === this.activeWindow.hash) return;
            this.windows.forEach(element => {
                if (element.index > _window.index) element.setIndex(element.index - 1);
        })
        if (this.activeWindow !== undefined) this.activeWindow.domElement.dataset.active = 'false'
        this.activeWindow = _window;
        this.activeWindow.domElement.dataset.active = 'true'
        this.activeWindow.setIndex(this.windows.size-1);
    }
    setFocus(_window: WebWindow, focus: boolean)
    {
        this.blocker.dataset.block = focus.toString();
        this.setActive(_window);
    }
    addWindow(title: string, width=500, height=300, x:number | null=null, y: number | null=null)
    {
        if (x === null || y === null)
        {
            if (this.lastY + height + this.borderOffset > window.innerHeight) this.lastY = this.borderOffset;
            if (this.lastX + width + this.borderOffset > window.innerWidth) this.lastX = this.borderOffset;
            x = this.lastX;
            y = this.lastY;
            this.lastX += this.windowOffset;
            this.lastY += this.windowOffset;
        }
        const _window = new WebWindow(title, x, y, width, height, this, "window " + this.nextHash);
        this.nextHash++;
        _window.setIndex(this.windows.size);
        this.windows.set(_window.hash, _window);
        this.setActive(_window);
        return _window;
    }
    closeWindow(_window: WebWindow)
    {
        this.setActive(_window);
        _window.close();
        this.windows.delete(_window.hash);
        this.activeWindow = Array.from(this.windows.values()).pop();
    }
    closeAllWindows()
    {
        this.windows.forEach(_window => {
            _window.close();
        })
        this.nextHash = 0;
        this.activeWindow = undefined;
        this.windows.clear();
    }
    #handleMouseOver(event: MouseEvent)
    {
        if (this.activeWindow === undefined) return;
        if (this.holding) {
            event.preventDefault();
            return this.activeWindow.updatePos(event.clientX - this.activeWindow.startClientX + this.activeWindow.startX,
                                               event.clientY - this.activeWindow.startClientY + this.activeWindow.startY);
            }
        if (this.resize.length > 0) {
            event.preventDefault();
            return this.activeWindow.resize(event.clientX, event.clientY)
        }
    }
    #handleMouseUp(event: MouseEvent)
    {
        this.holding = false;
        if (this.activeWindow === undefined) return;
        this.activeWindow.domElement.dataset.holding = 'false'
        this.activeWindow.domElement.dataset.resize = 'false'
        this.resize = [];
    }
}
export class WebWindowEvent {
    eventType: string;
    target: WebWindow;
    constructor(_window: WebWindow, eventType: string) {
        this.target = _window;
        this.eventType = eventType;
    }
}
export default WebWindowManager;