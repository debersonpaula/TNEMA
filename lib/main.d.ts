import { TObjectList } from 'tobjectlist';
import { THttpServer } from './units/httpServer';
import { TMongoServer } from './units/mongoServer';
import { TAuthServer } from './units/authServer';
declare class TNEMAServer extends TObjectList {
    HttpServer: THttpServer;
    MongoServer: TMongoServer;
    AuthServer: TAuthServer;
    constructor();
    port(port?: number): number;
    mongoURI(uri?: string): string;
}
export { TNEMAServer };
