/*
* httpServer
* descr: creates basic server with Node + Express + BodyParser
* scope: only server
* author: dpaula
* https://github.com/debersonpaula
*/

// ===================================================
// === imports =======================================
import { TObject } from 'tobjectlist';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as http from 'http';
import { RequestHandler } from '_debugger';
// ===================================================
// === classes =======================================
class THttpServer extends TObject {
    // components
    public app: express.Application;
    protected server: http.Server;
    public httpPort: number;
    private connections: Array<any>;

    // constructor
    constructor() {
        super();
        this.app = express();
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.server = http.createServer(this.app);
        this.connections = [];
    }

    // start server
    public Create(fn?: Function) {
        let ListenPort = 3000;
        const self = this;
        if (!this.httpPort) {
            console.log('HTTP Port was not been assigned to options');
        }else {
            ListenPort = this.httpPort || ListenPort;
            // enable destroy
            enableDestroy(this.server);
            // listen to the port
            this.server.listen(ListenPort, function(err: any) {
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

    // stop server
    public Destroy(fn?: Function) {
        const self = this;
        // clear all routes
        self.ClearRoutes();
        // close server connection
        let server: any = this.server;
        // force all connections to disconnect
        server.destroy(function(){
            console.log(`HTTP Server Stopped.`);
            self.DoDestroy(fn);
        });
    }

    // add static route
    public AddStatic(path: string) {
        this.app.use(express.static(path));
    }

    // add route to specific file
    public AddRouteToFile(uri: string, filename: string) {
        this.app.get(uri, function(req, res){
            res.sendFile(filename);
        });
    }

    // add router handler
    public AddRouter(uri: string): express.IRoute {
        return this.app.route(uri);
    }

    // add router use direct to handler
    public AddUse(uri: string,  handler: any): void {
        this.app.use(uri, handler);
    }

    // add router use Router handler
    public AddUseRouter(uri: string): express.Router {
        const router: express.Router = express.Router();
        this.app.use(uri, router);
        return router;
    }

    // mount middleware
    public AddMiddleware(handler: express.RequestHandler){
        this.app.use(handler);
    }

    // clear all routes
    private ClearRoutes(){
        /*
        for (var i = this.app.routes.get.length - 1; i >= 0; i--) {
            this.app.routes.get.splice(i, 1);
        }
        */
        var routes = this.app._router.stack;
        /*
        routes.forEach( function removeMiddlewares(route: any, i: number, routes: any){

        } );
        */
        for (var i in routes){
            routes.splice(0,1);
        }
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