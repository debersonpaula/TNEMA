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
    AddStatic(path: string): void;
    AddRouteToFile(uri: string, filename: string): void;
    AddRouter(uri: string): express.IRoute;
    AddUse(uri: string, handler: any): void;
    AddUseRouter(uri: string): express.Router;
    AddMiddleware(handler: express.RequestHandler): void;
    private ClearRoutes();
}
export { THttpServer };
