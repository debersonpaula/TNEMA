/*
* TNEMServer unit
* descr: TNEM Complete Pack
* scope: only server
* dependencies: tserver, mserver, aserver, types
* author: dpaula
* https://github.com/debersonpaula
*/

// imports
import {TServer} from './units/tserver';
import {MServer} from './units/mserver';
import {AServer} from './units/aserver';

class TNEMServer{
    
    public httpServer: TServer;
    public mongoServer: MServer;
    public authServer: AServer;

    constructor() {
        // initialize servers
        this.httpServer = new TServer;
        this.mongoServer = new MServer(this.httpServer);
        this.authServer = new AServer(this.httpServer);
        // set default values
        this.httpServer.httpPort = 3000;
        this.mongoServer.mongoURI = '';
    }
}

module.exports = new TNEMServer;