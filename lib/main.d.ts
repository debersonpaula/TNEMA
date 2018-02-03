import { TObjectList } from 'tobjectlist';
import { THttpServer } from './units/httpServer';
import { TMongoServer, TSchema, TModel } from './units/mongoServer';
import { TAuthServer } from './units/authServer';
import { TOptions } from './units/sessionHandler';
declare class TNEMAServer extends TObjectList {
    private _HttpServer;
    private _MongoServer;
    private _AuthServer;
    constructor(SessionID: string, SessionFile: string);
    readonly HttpServer: THttpServer;
    readonly MongoServer: TMongoServer;
    readonly AuthServer: TAuthServer;
    /** Get HTTP Port */
    /** Set HTTP Port */
    Port: number;
    /** Get MongoSource */
    /** Set MongoSource */
    MongoSource: string;
    /** Set static route to path */
    RouteStatic: string;
    readonly Options: TOptions;
}
export { TNEMAServer, TSchema, TModel };
