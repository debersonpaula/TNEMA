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
import { TObjectList } from './units/tobjectlist';
import { THttpServer } from './units/httpServer';
import { TMongoServer } from './units/mongoServer';
import { TAuthServer } from './units/authServer';
// ===================================================
// === classes =======================================
class TNEMAServer extends TObjectList{
    public HttpServer: THttpServer;
    public MongoServer: TMongoServer;
    public AuthServer: TAuthServer;
    
    constructor() {
        super();
        // initialize servers
        this.HttpServer = new THttpServer;
        this.MongoServer = new TMongoServer;
        this.AuthServer = new TAuthServer( this.HttpServer, this.MongoServer );
        //add to object list
        this.AddObject(this.HttpServer);
        this.AddObject(this.MongoServer);
        this.AddObject(this.AuthServer);
    }
}
// ===================================================
// === exports =======================================
module.exports = new TNEMAServer;