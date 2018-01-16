/// <reference types="express" />
/// <reference types="node" />
import { TObject } from 'tobjectlist';
import * as express from 'express';
import * as http from 'http';
/** HTTP SERVER */
declare class THttpServer extends TObject {
    app: express.Application;
    protected server: http.Server;
    httpPort: number;
    private connections;
    /** server constructor */
    constructor();
    /** start server */
    Create(fn?: Function): void;
    /** stop server */
    Destroy(fn?: Function): void;
    /** add router handler and returns IRoute object */
    Route(uri: string): express.IRoute;
    RouteStatic(path: string): void;
    RouteSendFile(uri: string, filename: string, middleware?: express.RequestHandler): void;
    RouteSendContent(uri: string, content: any, middleware?: express.RequestHandler): void;
    RouteSendJSON(uri: string, content: Object, middleware?: express.RequestHandler): void;
    Use(uri: string, handler: any): void;
    UseRouter(uri: string): express.Router;
    AddMiddleware(handler: express.RequestHandler): void;
    private ClearRoutes();
    /** Define Route to Get */
    private appGet(uri, middleware?, cb?);
}
export { THttpServer };
