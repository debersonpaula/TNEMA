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
var tobjectlist_1 = require("./tobjectlist");
// ===================================================
// === classes =======================================
var TAuthServer = /** @class */ (function (_super) {
    __extends(TAuthServer, _super);
    // constructor
    function TAuthServer(HttpServer, MongoServer) {
        var _this = _super.call(this) || this;
        _this.hServer = HttpServer;
        _this.mServer = MongoServer;
        return _this;
    }
    // start server
    TAuthServer.prototype.Create = function (fn) {
        var self = this;
        console.log("Auth Server Started.");
        this.InitStandardModels();
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
    TAuthServer.prototype.SendResponse = function (res, code, msg) {
        var resp = { code: code, msg: msg };
        res.json(resp);
    };
    //Login User
    TAuthServer.prototype.UserLogin = function (username, userpass, res) {
        var self = this;
        //const getdata: TModel = this.db.SearchModel('dbUsers');
        if (username && userpass) {
            var getdata = this.mServer.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user and pass matches
                getdata.Find({ username: username, userpass: userpass }, function (result) {
                    // if result > 0, user found
                    if (result.length) {
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
    TAuthServer.prototype.RegisterLogin = function (username, userpass, userpass2, res) {
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
                                self.SendResponse(res, 'ACCEPTED', 'User registered.');
                            }
                        });
                    }
                });
            }
        }
    };
    // Init Routes
    TAuthServer.prototype.InitRoutes = function () {
        var self = this;
        // define route to user registration
        var user = this.hServer.AddUseRouter('/user');
        // define route to add user
        user.post('/', function (req, res) {
            self.RegisterLogin(req.body.username, req.body.userpass, req.body.userpass2, res);
        });
        // define route to add user
        user.post('/login', function (req, res) {
            self.UserLogin(req.body.username, req.body.userpass, res);
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
                username: { type: String, default: '' },
                userpass: { type: String, default: '' }
            }
        }
    ]
};
