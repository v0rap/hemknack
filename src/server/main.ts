import WebSocket from "ws";
import http from "http";
const PORT = 8081;
interface FunctionTable {
    [key: string]: Function;
}
class ServerSignaler {
    wss: WebSocket.WebSocketServer;
    httpServer: http.Server;
    DT: FunctionTable;
    constructor() {
        this.httpServer = http.createServer(this.listener);
        const server = this.httpServer;
        this.wss = new WebSocket.WebSocketServer({ server });
        this.wss.on("connection", (socket, req) => this.handleWsConnection(socket, req));
        this.httpServer.listen(PORT);
        this.DT = {
            "/api/v1/addFromMagnet": this.addFromMagnet
        }
    }
    handleWsConnection(ws: WebSocket, req: any) {
        ws.on("message", this.handleWsMessage);
    }
    handleWsMessage(data: WebSocket.RawData, isBinary: boolean) {
        console.log(data.toString());
    }
    listener(req: http.IncomingMessage, res: http.ServerResponse) {
        const url = req.url;
        const responseData = this.DT[<string>url](req);
        res.end(responseData);
    }
    addFromMagnet(req: http.IncomingMessage){
        var body = "";
        req.on('data', function (chunk) {
            body += chunk;
        });
        req.on('end', function () {
            console.log('POSTed: ' + body);
        });
        const reqData = 
        let magnetUrl = reqData["magnetUrl"];
        if(magnetUrl === undefined) return {}
    }
}
const server = new ServerSignaler()