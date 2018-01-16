"use strict";
/*
* authServer
* descr: creates basic authentication server
* scope: only server
* dependencies: httpServer, mongoServer
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.0
*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// ===================================================
// === imports =======================================
var tobjectlist_1 = require("tobjectlist");
var mongoServer_1 = require("./mongoServer");
var sessionHandler_1 = require("./sessionHandler");
// ===================================================
// === classes =======================================
var TAuthServer = /** @class */ (function (_super) {
    __extends(TAuthServer, _super);
    // constructor
    function TAuthServer(HttpServer, MongoServer, SessionID, SessionFile) {
        var _this = _super.call(this) || this;
        _this.hServer = HttpServer;
        _this.mServer = MongoServer;
        //create store for session
        _this._session = new sessionHandler_1.TSessionApp({ appName: SessionID, filename: SessionFile });
        return _this;
    }
    // start server
    TAuthServer.prototype.Create = function (fn) {
        // get standard db models
        this.InitStandardModels();
        // start routes
        this.InitRoutes();
        this.DoCreate(fn);
    };
    // stop server
    TAuthServer.prototype.Destroy = function (fn) {
        this.DoDestroy(fn);
    };
    // get all models from DefAStandard
    TAuthServer.prototype.InitStandardModels = function () {
        var _this = this;
        if (this.mServer) {
            exports.DefAStandard.StandardModels.forEach(function (modelSchema) {
                _this.mServer.AddModel(modelSchema);
            });
        }
    };
    //Login User
    TAuthServer.prototype.UserLogin = function (username, userpass, res, req) {
        var _this = this;
        // const self = this;
        if (username && userpass) {
            var getdata = this.mServer.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user and pass matches
                getdata.find({ username: username, userpass: userpass }, function (result) {
                    // if result > 0, user found
                    if (result.length) {
                        var tokenid = _this._session.createSession(req, res, { username: username }).tokenid;
                        sendjson(res, 200, [{ tokenid: tokenid }]);
                    }
                    else {
                        sendjson(res, 403, ['User and Password not match.']);
                    }
                });
            }
        }
        else {
            sendjson(res, 403, ['User Name and Password fields cant be blank.']);
        }
    };
    //Register User
    TAuthServer.prototype.RegisterLogin = function (username, userpass, userpass2, res, req) {
        var _this = this;
        if (!username || !userpass || userpass !== userpass2) {
            sendjson(res, 403, ['User Name and Password fields cant be blank ' +
                    'and Passwords should be the same.']);
        }
        else {
            var model = this.mServer.SearchModel('dbUsers');
            if (model) {
                model.insert({ username: username, userpass: userpass }, function (result, err) {
                    if (err.length) {
                        sendjson(res, 403, err);
                    }
                    else {
                        var tokenid = _this._session.createSession(req, res, { username: username }).tokenid;
                        sendjson(res, 200, [{ tokenid: tokenid }]);
                    }
                });
            }
        }
    };
    // Init Routes
    TAuthServer.prototype.InitRoutes = function () {
        var _this = this;
        // define route to user api
        var user = this.hServer.UseRouter('/user');
        // define route to add user
        user.post('/', function (req, res) {
            _this.RegisterLogin(req.body.username, req.body.userpass, req.body.userpass2, res, req);
        });
        // define route to log user
        user.post('/login', function (req, res) {
            _this.UserLogin(req.body.username, req.body.userpass, res, req);
        });
        // define route to logout
        user.get('/logout', this._session.handler, function (req, res) {
            if (req.session) {
                _this._session.destroySession(req, res);
                sendjson(res, 200, []);
            }
            else {
                sendjson(res, 401, ['Not authorized.']);
            }
        });
        // define route to get user session
        user.get('/', this._session.handler, function (req, res) {
            if (req.session) {
                sendjson(res, 200, [req.session.data]);
            }
            else {
                sendjson(res, 401, ['Not authorized.']);
            }
        });
    };
    return TAuthServer;
}(tobjectlist_1.TObject));
exports.TAuthServer = TAuthServer;
// ===================================================
// === general methods ===============================
// ===================================================
function sendjson(res, status, msg) {
    res.status(status).json({
        messages: msg,
        status: status
    });
}
exports.DefAStandard = {
    StandardModels: [
        new mongoServer_1.TSchema('dbUsers', {
            username: {
                type: String,
                default: '',
                required: [true, 'UserName is required'],
                unique: [true, 'This UserName already exists']
            },
            userpass: {
                type: String,
                default: '',
                required: [true, 'Password is required'],
            }
        })
    ]
};
