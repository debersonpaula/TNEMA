"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var TSession = /** @class */ (function () {
    function TSession(sessionid) {
        this.clear();
        this.sessionid = sessionid;
    }
    TSession.prototype.clear = function () {
        this.sessionid = '';
        this.tokenid = '';
        this.data = {};
    };
    return TSession;
}());
exports.TSession = TSession;
var TSessions = /** @class */ (function () {
    function TSessions() {
        this._list = [];
    }
    TSessions.prototype.add = function (sessionid) {
        var session = new TSession(sessionid);
        this._list.push(session);
        return session;
    };
    TSessions.prototype.find = function (sessionid, tokenid) {
        var session = this._list.filter(function (value) {
            if (tokenid) {
                return value.sessionid === sessionid && value.tokenid === tokenid;
            }
            else {
                return value.sessionid === sessionid;
            }
        })[0];
        return session;
    };
    TSessions.prototype.save = function (filename) {
        fs.writeFileSync(filename, JSON.stringify(this._list, null, 2), 'utf-8');
    };
    TSessions.prototype.load = function (filename) {
        if (fs.existsSync(filename)) {
            var obj = JSON.parse(fs.readFileSync(filename, 'utf-8'));
            for (var i in obj) {
                var session = this.add(obj[i].sessionid);
                session.tokenid = obj[i].tokenid;
                session.data = obj[i].data;
            }
        }
    };
    return TSessions;
}());
exports.TSessions = TSessions;
