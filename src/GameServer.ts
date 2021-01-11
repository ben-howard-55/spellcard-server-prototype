import * as express from 'express';
import { createServer, Server } from 'http';
const socketIo = require('socket.io');
const cors = require('cors');

// GameServer Properties
export class GameServer {
    public static readonly PORT: number = 8080;
    private _app: express.Application;
    private server: Server;
    private io: SocketIO.Server
    private port: string | number;

    constructor () {
        this._app = express();
        this.port = process.env.PORT || GameServer.PORT;
        this._app.use(cors())
        this._app.options('*', cors());
        this.server = createServer(this._app);
        this.initSocket();
        this.listen();
    }

    private initSocket (): void {
        this.io = socketIo(this.server);
    }

    private listen (): void {

        // server listening to defined port

        this.server.listen(this.port, () => {
            console.log('Running the server on port %s.', this.port);
        });

        // socket events for the game
        

    }

    public get app (): express.Application {
        return this._app;
     }

} 