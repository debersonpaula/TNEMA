import { TObjectList } from 'tobjectlist';
import { THttpServer } from './units/httpServer';
import { TMongoServer, TSchema, TModel } from './units/mongoServer';
import { TAuthServer } from './units/authServer';
declare class TNEMAServer extends TObjectList {
    private _HttpServer;
    private _MongoServer;
    private _AuthServer;
    constructor(SessionID: string, SessionFile: string);
    readonly HttpServer: THttpServer;
    readonly MongoServer: TMongoServer;
    readonly AuthServer: TAuthServer;
    Port: number;
    MongoSource: string;
}
export { TNEMAServer, TSchema, TModel };
