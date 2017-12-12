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
exports.__esModule = true;
// ===================================================
// === imports =======================================
var tobjectlist_1 = require("tobjectlist");
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
        var self = this;
        console.log("Auth Server Started.");
        // get standard db models
        this.InitStandardModels();
        // start routes
        this.InitRoutes();
        self.DoCreate(fn);
    };
    // stop server
    TAuthServer.prototype.Destroy = function (fn) {
        var self = this;
        console.log("Auth Server Stopped.");
        self.DoDestroy(fn);
    };
    // get all models from DefAStandard
    TAuthServer.prototype.InitStandardModels = function () {
        var _this = this;
        if (this.mServer) {
            exports.DefAStandard.StandardModels.forEach(function (model) {
                _this.mServer.AddModel(model.Schema, model.Name);
            });
        }
    };
    //standard way to send response
    TAuthServer.prototype.SendResponse = function (res, code, content) {
        var resp = { code: code, content: content };
        return res.json(resp);
    };
    //Login User
    TAuthServer.prototype.UserLogin = function (username, userpass, res, req) {
        var self = this;
        if (username && userpass) {
            var getdata = this.mServer.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user and pass matches
                getdata.Find({ username: username, userpass: userpass }, function (result) {
                    // if result > 0, user found
                    if (result.length) {
                        self.CreateSession(req, username);
                        self.SendResponse(res, 'ACCEPTED', 'User logged.');
                    }
                    else {
                        self.SendResponse(res, 'INVALID', 'User and Password not match.');
                    }
                });
            }
        }
        else {
            this.SendResponse(res, 'INVALID', 'User Name and Password fields cant be blank.');
        }
    };
    //Register User
    TAuthServer.prototype.RegisterLogin = function (username, userpass, userpass2, res, req) {
        var self = this;
        if (!username || !userpass || userpass !== userpass2) {
            self.SendResponse(res, 'INVALID', 'User Name and Password fields cant be blank and Passwords should be the same.');
        }
        else {
            var getdata_1 = self.mServer.SearchModel('dbUsers');
            if (getdata_1) {
                // locate if the user exists
                getdata_1.Find({ username: username }, function (result) {
                    if (result.length) {
                        self.SendResponse(res, 'INVALID', 'This user already exists.');
                    }
                    else {
                        // create user
                        getdata_1.Save({ username: username, userpass: userpass }, function (result) {
                            if (result) {
                                console.log(result);
                                self.CreateSession(req, username);
                                self.SendResponse(res, 'DONE');
                            }
                        });
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
                return self.SendResponse(res, '');
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
            return self.SendResponse(res, 'SESSION', content);
        });
        // define route to logout
        user.get('/logout', auth, function (req, res) {
            req.session.destroy();
            return self.SendResponse(res, 'LOGOUT', 'You are logged out!');
        });
    };
    return TAuthServer;
}(tobjectlist_1.TObject));
exports.TAuthServer = TAuthServer;
exports.DefAStandard = {
    StandardModels: [
        {
            Name: 'dbUsers',
            Schema: {
                username: { type: String, "default": '' },
                userpass: { type: String, "default": '' }
            }
        }
    ]
};
