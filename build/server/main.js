"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const http_1 = __importDefault(require("http"));
const PORT = 8081;
class ServerSignaler {
    constructor() {
        this.httpServer = http_1.default.createServer(this.listener);
        const server = this.httpServer;
        this.wss = new ws_1.default.WebSocketServer({ server });
        this.wss.on("connection", (socket, req) => this.handleWsConnection(socket, req));
        this.httpServer.listen(PORT);
        this.DT = {
            "/api/v1/addFromMagnet": this.addFromMagnet
        };
    }
    handleWsConnection(ws, req) {
        ws.on("message", this.handleWsMessage);
    }
    handleWsMessage(data, isBinary) {
        console.log(data.toString());
    }
    listener(req, res) {
        const url = req.url;
        const responseData = this.DT[url](req);
        res.end(responseData);
    }
    addFromMagnet(req) {
        var body = "";
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            console.log('POSTed: ' + body);
        });
        const reqData = let, magnetUrl = reqData["magnetUrl"];
        if (magnetUrl === undefined)
            return {};
    }
}
const server = new ServerSignaler();
