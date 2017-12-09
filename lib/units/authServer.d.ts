import { TObject } from 'tobjectlist';
import { THttpServer } from './httpServer';
import { TMongoServer } from './mongoServer';
declare class TAuthServer extends TObject {
    private hServer;
    private mServer;
    private userAPI;
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer);
    Create(fn?: Function): void;
    Destroy(fn?: Function): void;
    private InitStandardModels();
    private SendResponse(res, code, content?);
    private UserLogin(username, userpass, res, req);
    private RegisterLogin(username, userpass, userpass2, res, req);
    private CreateSession(req, username);
    private InitRoutes();
}
export { TAuthServer };
export declare let DefAStandard: {
    StandardModels: {
        Name: string;
        Schema: {
            username: {
                type: StringConstructor;
                default: string;
            };
            userpass: {
                type: StringConstructor;
                default: string;
            };
        };
    }[];
};
