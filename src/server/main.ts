/*
* TNEMServer unit
* descr: TNEM Complete Pack
* scope: only server
* dependencies: 
* author: dpaula
* https://github.com/debersonpaula
*/

// ===================================================
// === imports =======================================
import { TObjectList } from 'tobjectlist';
import { THttpServer } from './units/httpServer';
import { TMongoServer } from './units/mongoServer';
import { TAuthServer } from './units/authServer';
// ===================================================
// === classes =======================================
class TNEMAServer extends TObjectList{
    private _HttpServer: THttpServer;
    private _MongoServer: TMongoServer;
    private _AuthServer: TAuthServer;

    constructor(SessionID: string, SecretFile: string) {
        super();
        // initialize servers
        this._HttpServer = new THttpServer;
        this._MongoServer = new TMongoServer;
        this._AuthServer = new TAuthServer( this._HttpServer, this._MongoServer, SessionID, SecretFile );

        //add to object list
        this.AddObject(this._HttpServer);
        this.AddObject(this._MongoServer);
        this.AddObject(this._AuthServer);
    }

    // FORWARDERS
    get HttpServer(): THttpServer { return this._HttpServer }
    get MongoServer(): TMongoServer { return this._MongoServer };
    get AuthServer(): TAuthServer { return this._AuthServer };

    // set or get http port
    get Port(): number {
        return this._HttpServer.httpPort;
    }
    set Port(port: number) {
        this._HttpServer.httpPort = port;
    }

    // set or get mongo uri
    get MongoSource(): string {
        return this._MongoServer.mongoURL;
    }
    set MongoSource(url: string) {
        this._MongoServer.mongoURL = url;
    }
}
// ===================================================
// === exports =======================================
export {TNEMAServer}
