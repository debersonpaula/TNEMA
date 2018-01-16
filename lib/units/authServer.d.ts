import { TObject } from 'tobjectlist';
import { THttpServer } from './httpServer';
import { TSchema, TMongoServer } from './mongoServer';
declare class TAuthServer extends TObject {
    private hServer;
    private mServer;
    private _session;
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer, SessionID: string, SessionFile: string);
    Create(fn?: Function): void;
    Destroy(fn?: Function): void;
    private InitStandardModels();
    private UserLogin(username, userpass, res, req);
    private RegisterLogin(username, userpass, userpass2, res, req);
    private InitRoutes();
}
export { TAuthServer };
export declare let DefAStandard: {
    StandardModels: TSchema[];
};
