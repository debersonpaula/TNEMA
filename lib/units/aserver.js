"use strict";
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
var tserver_1 = require("./tserver");
var mserver_1 = require("./mserver");
var AServer = /** @class */ (function (_super) {
    __extends(AServer, _super);
    function AServer(AOwner) {
        return _super.call(this, AOwner) || this;
    }
    AServer.prototype.DoBeforeListen = function () {
        var self = this;
        self.db = self.SOwner.Find(mserver_1.MServer);
        self.RegisterStandardModels();
        // define route to user registration
        var user = this.SOwner.AddUseRouter('/user');
        // define route to add user
        user.post('/', function (req, res) {
            var username = req.body.username, userpass = req.body.userpass, userpass2 = req.body.userpass2;
            if (!username || !userpass || userpass !== userpass2) {
                self.SendResponse(res, 'INVALID', 'User Name and Password fields cant be blank and Passwords should be the same.');
            }
            else {
                var getdata_1 = self.db.SearchModel('dbUsers');
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
        });
        // define route to add user
        user.get('/login', function (req, res) {
            res.send('teste');
        });
    };
    AServer.prototype.DoOnDestroy = function () { };
    // private RoutePostRegister
    AServer.prototype.RegisterStandardModels = function () {
        var _this = this;
        if (this.db) {
            exports.DefAStandard.StandardModels.forEach(function (model) {
                _this.db.AddModel(model.Schema, model.Name);
            });
        }
    };
    //standard way to send response
    AServer.prototype.SendResponse = function (res, code, msg) {
        var resp = { code: code, msg: msg };
        res.json(resp);
    };
    //Login User
    AServer.prototype.UserLogin = function (username, userpass, res) {
        var result = false;
        var self = this;
        //const getdata: TModel = this.db.SearchModel('dbUsers');
        if (username && userpass) {
            var getdata = this.db.SearchModel('dbUsers');
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
        return result;
    };
    return AServer;
}(tserver_1.TServerObject));
exports.AServer = AServer;
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
