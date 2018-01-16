"use strict";
/*
* sessionHandler
* descr: create session handler for http
* scope: only server
* dependencies: sessionInfo
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.5
*/
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = require("crypto");
var sessionInfo_1 = require("./sessionInfo");
var TOptions = /** @class */ (function () {
    function TOptions() {
        this.cryptoSize = 20,
            this.maxAge = 900000,
            this.appName = '',
            this.filename = '';
    }
    return TOptions;
}());
/** Session Manager App */
var TSessionApp = /** @class */ (function () {
    function TSessionApp(options) {
        // assign options
        this._options = new TOptions;
        for (var i in options) {
            this._options[i] = options[i];
        }
        // create sessions
        this._sessions = new sessionInfo_1.TSessions;
        // load sessions to file
        if (this._options.filename) {
            this._sessions.load(this._options.filename);
        }
    }
    Object.defineProperty(TSessionApp.prototype, "handler", {
        /** get session handler middleware */
        get: function () {
            return this._handler.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSessionApp.prototype, "session", {
        /** get session function */
        get: function () {
            return this._getSession.bind(this);
        },
        enumerable: true,
        configurable: true
    });
    /** create a logged session and returns session */
    TSessionApp.prototype.createSession = function (req, res, data) {
        // get cookies from user or create it if not exists
        var sessionid = this._getCookie(req, res, this._options.appName);
        // get session of user and create token and assigns data
        var session = this._findSession(sessionid);
        session.tokenid = crypto.randomBytes(this._options.cryptoSize).toString('hex');
        session.data = data;
        // save sessions to file
        if (this._options.filename) {
            this._sessions.save(this._options.filename);
        }
        return session;
    };
    /** destroy a logged session */
    TSessionApp.prototype.destroySession = function (req, res) {
        // get cookies from user or create it if not exists
        var sessionid = this._getCookie(req, res, this._options.appName);
        // get session of user and create token and assigns data
        var session = this._findSession(sessionid);
        // check if user send token
        var tokenid = req.get('tokenid');
        if (session.tokenid === tokenid && tokenid) {
            // authenticated session route
            session.clear();
            return true;
        }
        else {
            // not authenticated
            return false;
        }
    };
    /** get session content */
    TSessionApp.prototype._getSession = function (req, res) {
        // get cookies from user or create it if not exists
        var sessionid = this._getCookie(req, res, this._options.appName);
        // get session of user
        var session = this._findSession(sessionid);
        // check if user send token
        var tokenid = req.get('tokenid');
        if (session.tokenid === tokenid && tokenid != '') {
            // authenticated session route
            req.session = session;
        }
        else {
            // not authenticated
            req.session = false;
        }
        // save sessions to file
        if (this._options.filename) {
            this._sessions.save(this._options.filename);
        }
    };
    TSessionApp.prototype._handler = function (req, res, next) {
        this._getSession(req, res);
        next();
    };
    /** get cookie or create it */
    TSessionApp.prototype._getCookie = function (req, res, appName) {
        var sessionid = req.cookies[appName];
        if (!sessionid) {
            sessionid = crypto.randomBytes(this._options.cryptoSize).toString('hex');
            res.cookie(appName, sessionid, {
                maxAge: this._options.maxAge,
                httpOnly: true
            });
        }
        return sessionid;
    };
    /** find user */
    TSessionApp.prototype._findSession = function (sessionid) {
        var session = this._sessions.find(sessionid);
        if (!session) {
            session = this._sessions.add(sessionid);
        }
        return session;
    };
    TSessionApp.prototype._saveSessionToFile = function (filename) {
        this._sessions.save(filename);
    };
    return TSessionApp;
}());
exports.TSessionApp = TSessionApp;
