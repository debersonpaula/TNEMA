/*
* sessionInfo
* descr: session class definition
* scope: only server
* dependencies: none
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.0
*/

import fs = require('fs');

export class TSession {
    data: any;
    sessionid: string;
    tokenid: string;
    constructor(sessionid: string) {
        this.clear();
        this.sessionid = sessionid;
    }
    clear() {
        this.sessionid = '';
        this.tokenid = '';
        this.data = {};
    }
}
export class TSessions {
    private _list: TSession[];
    constructor() {
        this._list = [];
    }
    add(sessionid: string): TSession {
        var session = new TSession(sessionid);
        this._list.push(session);
        return session;
    }
    find(sessionid: string, tokenid?: string): TSession {
        var session = this._list.filter( value => {
            if (tokenid) {
                return value.sessionid === sessionid && value.tokenid === tokenid;
            } else {
                return value.sessionid === sessionid;
            }
        })[0];
        return session;
    }
    save(filename: string){
        fs.writeFileSync(filename, JSON.stringify(this._list, null, 2) , 'utf-8');
    }
    load(filename: string){
        if (fs.existsSync(filename)) {
            var obj = JSON.parse(fs.readFileSync(filename, 'utf-8'));
            for (var i in obj) {
                var session = this.add(obj[i].sessionid);
                session.tokenid = obj[i].tokenid;
                session.data = obj[i].data;
            }
        }
    }
}