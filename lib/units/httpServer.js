"use strict";
/*
* httpServer
* descr: creates basic server with Node + Express + BodyParser
* scope: only server
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
var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
// ===================================================
// === classes =======================================
var THttpServer = /** @class */ (function (_super) {
    __extends(THttpServer, _super);
    // constructor
    function THttpServer() {
        var _this = _super.call(this) || this;
        _this.app = express();
        _this.app.use(bodyParser.urlencoded({ extended: false }));
        _this.app.use(bodyParser.json());
        _this.server = http.createServer(_this.app);
        return _this;
    }
    // add static route
    THttpServer.prototype.AddStatic = function (path) {
        this.app.use(express.static(path));
    };
    // add route to specific file
    THttpServer.prototype.AddRouteToFile = function (uri, filename) {
        this.app.get(uri, function (req, res) {
            res.sendFile(filename);
        });
    };
    // add router handler
    THttpServer.prototype.AddRouter = function (uri) {
        return this.app.route(uri);
    };
    // add router use direct to handler
    THttpServer.prototype.AddUse = function (uri, handler) {
        this.app.use(uri, handler);
    };
    // add router use Router handler
    THttpServer.prototype.AddUseRouter = function (uri) {
        var router = express.Router();
        this.app.use(uri, router);
        return router;
    };
    return THttpServer;
}(tobjectlist_1.TObject));
exports.THttpServer = THttpServer;
