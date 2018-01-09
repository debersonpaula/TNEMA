"use strict";
/*
* authServer
* descr: creates basic authentication server
* scope: only server
* dependencies: httpServer, mongoServer
* author: dpaula
* https://github.com/debersonpaula
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
var session = require("express-session");
// ===================================================
// === classes =======================================
var TAuthServer = /** @class */ (function (_super) {
    __extends(TAuthServer, _super);
    // constructor
    function TAuthServer(HttpServer, MongoServer, SessionID, SecretID) {
        var _this = _super.call(this) || this;
        _this.hServer = HttpServer;
        _this.mServer = MongoServer;
        //create store for session
        var FileStore = require('session-file-store')(session);
        //start session
        HttpServer.AddMiddleware(session({
            store: new FileStore,
            secret: SecretID,
            name: SessionID,
            resave: true,
            saveUninitialized: true
        }));
        //get user api
        _this.userAPI = _this.hServer.UseRouter('/user');
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
                        _this.CreateSession(req, username);
                        sendjson(res, 200, []);
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
                        _this.CreateSession(req, username);
                        sendjson(res, 200, []);
                    }
                });
            }
        }
    };
    //method to register user in session
    TAuthServer.prototype.CreateSession = function (req, username) {
        req.session.username = username;
        req.session.logged = true;
    };
    // Init Routes
    TAuthServer.prototype.InitRoutes = function () {
        var self = this;
        // define route to user registration
        var user = this.userAPI;
        // Authentication and Authorization Middleware
        var auth = function (req, res, next) {
            if (req.session && req.session.logged === true)
                return next();
            else {
                sendjson(res, 401, ['Not authorized.']);
            }
        };
        // define route to add user
        user.post('/', function (req, res) {
            self.RegisterLogin(req.body.username, req.body.userpass, req.body.userpass2, res, req);
        });
        // define route to log user
        user.post('/login', function (req, res) {
            self.UserLogin(req.body.username, req.body.userpass, res, req);
        });
        // define route to get user session
        user.get('/', auth, function (req, res) {
            var session = req.session;
            var content = {
                username: session.username
            };
            //console.log(session);
            sendjson(res, 200, [{ username: session.username }]);
        });
        // define route to logout
        user.get('/logout', auth, function (req, res) {
            req.session.destroy();
            sendjson(res, 200, []);
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
