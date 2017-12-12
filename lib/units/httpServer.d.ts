/// <reference types="express" />
/// <reference types="node" />
import { TObject } from 'tobjectlist';
import * as express from 'express';
import * as http from 'http';
declare class THttpServer extends TObject {
    app: express.Application;
    protected server: http.Server;
    httpPort: number;
    private connections;
    constructor();
    Create(fn?: Function): void;
    Destroy(fn?: Function): void;
    Route(uri: string): express.IRoute;
    RouteStatic(path: string): void;
    RouteSendFile(uri: string, filename: string): void;
    RouteSendContent(uri: string, content: any): void;
    Use(uri: string, handler: any): void;
    UseRouter(uri: string): express.Router;
    AddMiddleware(handler: express.RequestHandler): void;
    private ClearRoutes();
}
export { THttpServer };
