"use strict";
/*
* httpServer
* descr: creates basic server with Node + Express + BodyParser
* scope: only server
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
var express = require("express");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var http = require("http");
// ===================================================
// === classes =======================================
/** HTTP SERVER */
var THttpServer = /** @class */ (function (_super) {
    __extends(THttpServer, _super);
    /** server constructor */
    function THttpServer() {
        var _this = _super.call(this) || this;
        _this.app = express();
        _this.app.use(bodyParser.urlencoded({ extended: false }));
        _this.app.use(bodyParser.json());
        _this.app.use(cookieParser());
        _this.server = http.createServer(_this.app);
        _this.connections = [];
        return _this;
    }
    /** start server */
    THttpServer.prototype.Create = function (fn) {
        var ListenPort = 3000;
        var self = this;
        if (!this.httpPort) {
            console.log('HTTP Port was not been assigned to options');
        }
        else {
            ListenPort = this.httpPort || ListenPort;
            // enable destroy
            enableDestroy(this.server);
            // listen to the port
            this.server.listen(ListenPort, function (err) {
                if (err) {
                    console.log("HTTP Server can't be active on port " + ListenPort);
                    throw err;
                }
                else {
                    console.log("HTTP Server active on port " + ListenPort);
                    self.DoCreate(fn);
                }
            });
        }
    };
    /** stop server */
    THttpServer.prototype.Destroy = function (fn) {
        var self = this;
        // clear all routes
        self.ClearRoutes();
        // close server connection
        var server = this.server;
        // force all connections to disconnect
        server.destroy(function () {
            console.log("HTTP Server Stopped.");
            self.DoDestroy(fn);
        });
    };
    /** add router handler and returns IRoute object */
    THttpServer.prototype.Route = function (uri) {
        return this.app.route(uri);
    };
    // add static route
    THttpServer.prototype.RouteStatic = function (path) {
        this.app.use(express.static(path));
    };
    // add route to specific file
    THttpServer.prototype.RouteSendFile = function (uri, filename, middleware) {
        this.appGet(uri, middleware, function (req, res) {
            res.sendFile(filename);
        });
    };
    // add route to any content
    THttpServer.prototype.RouteSendContent = function (uri, content, middleware) {
        this.appGet(uri, middleware, function (req, res) {
            res.send(content);
        });
    };
    // add route to send json
    THttpServer.prototype.RouteSendJSON = function (uri, content, middleware) {
        this.appGet(uri, middleware, function (req, res) {
            res.json(content);
        });
    };
    // add router use direct to handler
    THttpServer.prototype.Use = function (uri, handler) {
        this.app.use(uri, handler);
    };
    // add router use Router handler
    THttpServer.prototype.UseRouter = function (uri) {
        var router = express.Router();
        this.app.use(uri, router);
        return router;
    };
    // mount middleware
    THttpServer.prototype.AddMiddleware = function (handler) {
        this.app.use(handler);
    };
    // clear all routes
    THttpServer.prototype.ClearRoutes = function () {
        if (this.app._router.stack)
            this.app._router.stack = [];
        this.app._router = undefined;
    };
    /** Define Route to Get */
    THttpServer.prototype.appGet = function (uri, middleware, cb) {
        if (middleware) {
            this.app.get(uri, middleware, function (req, res) {
                cb && cb(req, res);
            });
        }
        else {
            this.app.get(uri, function (req, res) {
                cb && cb(req, res);
            });
        }
    };
    return THttpServer;
}(tobjectlist_1.TObject));
exports.THttpServer = THttpServer;
// ===================================================
// === auxiliary function ============================
function enableDestroy(server) {
    var connections = [];
    server.on('connection', function (conn) {
        var key = connections.push(conn);
        conn.on('close', function () {
            delete connections[key];
        });
    });
    server.destroy = function (cb) {
        server.close(cb);
        for (var key in connections)
            connections[key].destroy();
    };
}
