/// <reference types="express" />
import { TObject } from 'tobjectlist';
import { THttpServer } from './httpServer';
import { TSchema, TMongoServer } from './mongoServer';
import { RequestHandler } from 'express';
declare class TAuthServer extends TObject {
    private _HttpServer;
    private _MongoServer;
    private _session;
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer, SessionID: string, SessionFile: string);
    Create(fn?: Function): void;
    Destroy(fn?: Function): void;
    private InitStandardModels();
    private UserLogin(username, userpass, res, req);
    private RegisterLogin(username, userpass, userpass2, res, req);
    private InitRoutes();
    private _authRoute(req, res, next);
    /** Auth Route Middleware */
    readonly AuthRoute: RequestHandler;
}
export { TAuthServer };
export declare let DefAStandard: {
    StandardModels: TSchema[];
};
