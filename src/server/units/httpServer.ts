/*
* httpServer
* descr: creates basic server with Node + Express + BodyParser
* scope: only server
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.3
* V.0.3.9 - Corrected Clear Routes
* V.0.4.0 - Removed Clear Routes
*/

// ===================================================
// === imports =======================================
import { TObject } from 'tobjectlist';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import * as http from 'http';
// ===================================================
// === classes =======================================

/** HTTP SERVER */
class THttpServer extends TObject {
    // components
    private _app: express.Application;
    private _server: http.Server;
    private _httpPort: number;
    private _connections: Array<any>;

    /** server constructor */
    constructor() {
        super();
        this._app = express();
        this._app.use(bodyParser.urlencoded({ extended: false }));
        this._app.use(bodyParser.json());
        this._app.use(cookieParser());
        this._server = http.createServer(this._app);
        this._connections = [];
    }

    /** start server */
    public Create(fn?: Function) {
        let ListenPort = 3000;
        const self = this;
        if (!this._httpPort) {
            console.log('HTTP Port was not been assigned to options');
        }else {
            ListenPort = this._httpPort || ListenPort;
            // enable destroy
            enableDestroy(this._server);
            // listen to the port
            this._server.listen(ListenPort, function(err: any) {
                if (err) {
                    console.log(`HTTP Server can't be active on port ${ListenPort}`);
                    throw err;
                }else {
                    console.log(`HTTP Server active on port ${ListenPort}`);
                    self.DoCreate(fn);
                }
            });
        }
    }

    /** stop server */
    public Destroy(fn?: Function) {
        const self = this;
        // clear all routes
        // self.ClearRoutes();
        // close server connection
        let server: any = this._server;
        // force all connections to disconnect
        server.destroy(function(){
            console.log(`HTTP Server Stopped.`);
            self.DoDestroy(fn);
        });
    }

    /** return express application */
    get App(): express.Application {
        return this._app;
    }

    /** return http port */
    get HttpPort(): number {
        return this._httpPort;
    }

    /** change http port */
    set HttpPort(value: number) {
        this._httpPort = value;
    }

    /** add static route */
    public RouteStatic(path: string) {
        this._app.use(express.static(path));
    }

    /** create Router based on URI and return it */
    public Router(uri: string): express.Router {
        const router: express.Router = express.Router();
        this._app.use(uri, router);
        return router;
    }

    // mount middleware
    public AddMiddleware(handler: express.RequestHandler){
        this._app.use(handler);
    }

    // clear all routes
    private ClearRoutes(){
        // if (this._app._router.stack) this._app._router.stack = [];
        // this._app._router = undefined;
    }
}
// ===================================================
// === auxiliary function ============================
function enableDestroy(server: any) {
    let connections: any[] = [];
  
    server.on('connection', function(conn: any) {
      let key = connections.push(conn);
      conn.on('close', function() {
        delete connections[key];
      });
    });
  
    server.destroy = function(cb: any) {
      server.close(cb);
      for (var key in connections)
        connections[key].destroy();
    };
  }
// ===================================================
// === exports =======================================
export { THttpServer };