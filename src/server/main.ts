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
// ===================================================
// === classes =======================================
class TNEMAServer extends TObjectList{
    HttpServer: THttpServer;
    
    constructor() {
        super();
        // initialize servers
        this.HttpServer = new THttpServer;
        this.HttpServer.httpPort = 3000;
        //add to object list
        this.AddObject(this.HttpServer);
    }
}

module.exports = new TNEMAServer;