/*
* TNEMServer unit
* descr: TNEM Complete Pack
* scope: only server
* dependencies: 
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.3
* V.0.3.6 - added TSchema, TModel to export
* V.0.4.0 - general updates
* V.0.4.2 - added forward to htpp functions
*/

// ===================================================
// === imports =======================================
import { TObjectList } from 'tobjectlist';
import { THttpServer } from './units/httpServer';
import { TMongoServer, TSchema, TModel } from './units/mongoServer';
import { TAuthServer } from './units/authServer';
import { TOptions } from './units/sessionHandler';
// ===================================================
// === classes =======================================
class TNEMAServer extends TObjectList{
    private _HttpServer: THttpServer;
    private _MongoServer: TMongoServer;
    private _AuthServer: TAuthServer;

    //---------------------------------------------------------------
    constructor(SessionID: string, SessionFile: string) {
        super();
        // initialize servers
        this._HttpServer = new THttpServer;
        this._MongoServer = new TMongoServer;
        this._AuthServer = new TAuthServer( this._HttpServer, this._MongoServer, SessionID, SessionFile );

        //add to object list
        this.AddObject(this._HttpServer);
        this.AddObject(this._MongoServer);
        this.AddObject(this._AuthServer);
    }

    // FORWARDERS
    get HttpServer(): THttpServer { return this._HttpServer }
    get MongoServer(): TMongoServer { return this._MongoServer };
    get AuthServer(): TAuthServer { return this._AuthServer };

    //---------------------------------------------------------------
    /** Get HTTP Port */
    get Port(): number {
        return this._HttpServer.HttpPort;
    }
    /** Set HTTP Port */
    set Port(port: number) {
        this._HttpServer.HttpPort = port;
    }

    //---------------------------------------------------------------
    /** Get MongoSource */
    get MongoSource(): string {
        return this._MongoServer.mongoURL;
    }
    /** Set MongoSource */
    set MongoSource(url: string) {
        this._MongoServer.mongoURL = url;
    }

    //---------------------------------------------------------------
    /** Set static route to path */
    set RouteStatic(path: string) {
        this._HttpServer.RouteStatic(path);
    }

    get Options(): TOptions {
        return this._AuthServer.Session.Options;
    }
}
// ===================================================
// === exports =======================================
export {TNEMAServer, TSchema, TModel}
