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
exports.__esModule = true;
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
        });
        this.SOwner.AddRouter('/register')
            .post(function (req, res) {
            var username = req.body.username, userpass = req.body.userpass, userpass2 = req.body.userpass2;
            if (!username || !userpass || userpass !== userpass2) {
                res.send('User Name and Password fields cant be blank and Passwords should be the same.');
            }
            else {
                var getdata_1 = self.db.SearchModel('dbUsers');
                if (getdata_1) {
                    // locate if the user exists
                    getdata_1.Find({ username: username }, function (result) {
                        if (result.length) {
                            res.status(200);
                            res.send('this user already exists');
                        }
                        else {
                            // create user
                            getdata_1.Save({ username: username, userpass: userpass }, function (result) {
                                if (result) {
                                    res.status(200);
                                    res.send('user registered');
                                }
                            });
                        }
                    });
                }
            }
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
    return AServer;
}(tserver_1.TServerObject));
exports.AServer = AServer;
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
