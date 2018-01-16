/// <reference types="express" />
import { TObject } from 'tobjectlist';
import * as express from 'express';
/** HTTP SERVER */
declare class THttpServer extends TObject {
    private _app;
    private _server;
    private _httpPort;
    private _connections;
    /** server constructor */
    constructor();
    /** start server */
    Create(fn?: Function): void;
    /** stop server */
    Destroy(fn?: Function): void;
    /** return express application */
    readonly App: express.Application;
    /** return http port */
    /** change http port */
    HttpPort: number;
    /** add static route */
    RouteStatic(path: string): void;
    /** create Router based on URI and return it */
    Router(uri: string): express.Router;
    AddMiddleware(handler: express.RequestHandler): void;
    private ClearRoutes();
}
export { THttpServer };
