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
* V.0.3.3
* V.0.3.6 - added schema list and options to authserver
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
        _this._HttpServer = HttpServer;
        _this._MongoServer = MongoServer;
        // create store for session
        _this._session = new sessionHandler_1.TSessionApp({ appName: SessionID, filename: SessionFile });
        // initialize options
        _this._options = {
            user: 'username',
            pass: 'userpass',
            users: 'dbUsers',
            sessionInfo: ['username']
        };
        // initialize schemas
        _this._schemas = [
            new mongoServer_1.TSchema(_this._options.users, {
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
        ];
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
    // overwrite schemas
    TAuthServer.prototype.OverwriteSchemas = function (schemas) {
        this._schemas = schemas;
    };
    // overwrite options
    TAuthServer.prototype.OverwriteOptions = function (options) {
        for (var field in options) {
            this._options[field] = options[field];
        }
    };
    // get all models from DefAStandard
    TAuthServer.prototype.InitStandardModels = function () {
        var _this = this;
        if (this._MongoServer) {
            this._schemas.forEach(function (modelSchema) {
                _this._MongoServer.AddModel(modelSchema);
            });
        }
    };
    //Login User
    TAuthServer.prototype.setLogin = function (req, res) {
        var _this = this;
        var username = req.body[this._options.user];
        var userpass = req.body[this._options.pass];
        if (username && userpass) {
            var getdata = this._MongoServer.SearchModel(this._options.users);
            if (getdata) {
                // locate if the user and pass matches
                getdata.find({ username: username, userpass: userpass }, function (result) {
                    // if result > 0, user found
                    if (result.length > 0) {
                        var tokenid = _this._session.createSession(req, res, _this.getSessionData(result[0])).tokenid;
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
    TAuthServer.prototype.setRegister = function (req, res) {
        var _this = this;
        var userData = req.body;
        var model = this._MongoServer.SearchModel(this._options.users);
        if (model) {
            model.insert(userData, function (result, err) {
                if (err.length) {
                    sendjson(res, 403, err);
                }
                else {
                    // create session, get token id and send it to the requester
                    var tokenid = _this._session.createSession(req, res, _this.getSessionData(userData)).tokenid;
                    sendjson(res, 200, [{ tokenid: tokenid }]);
                }
            });
        }
    };
    TAuthServer.prototype.getSessionData = function (source) {
        var dest = {};
        this._options.sessionInfo.forEach(function (element) {
            dest[element] = source[element];
        });
        return dest;
    };
    // Init Routes
    TAuthServer.prototype.InitRoutes = function () {
        var _this = this;
        // define route to user api
        var user = this._HttpServer.Router('/user');
        // define route to add user
        user.post('/', function (req, res) {
            _this.setRegister(req, res);
        });
        // define route to log user
        user.post('/login', function (req, res) {
            _this.setLogin(req, res);
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
    TAuthServer.prototype._authRoute = function (req, res, next) {
        this._session.session(req, res);
        if (req.session) {
            next();
        }
        else {
            sendjson(res, 401, ['Not authorized.']);
        }
    };
    Object.defineProperty(TAuthServer.prototype, "AuthRoute", {
        /** Auth Route Middleware */
        get: function () {
            return this._authRoute.bind(this);
        },
        enumerable: true,
        configurable: true
    });
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
