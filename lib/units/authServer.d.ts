import { TObject } from 'tobjectlist';
import { THttpServer } from './httpServer';
import { TSchema, TMongoServer } from './mongoServer';
declare class TAuthServer extends TObject {
    private hServer;
    private mServer;
    private userAPI;
    private sessionHandler;
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer, SessionID: string, SecretID: string);
    Create(fn?: Function): void;
    Destroy(fn?: Function): void;
    private InitStandardModels();
    private UserLogin(username, userpass, res, req);
    private RegisterLogin(username, userpass, userpass2, res, req);
    private CreateSession(req, username);
    private InitRoutes();
}
export { TAuthServer };
export declare let DefAStandard: {
    StandardModels: TSchema[];
};
