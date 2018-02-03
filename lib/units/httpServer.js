"use strict";
/*
* httpServer
* descr: creates basic server with Node + Express + BodyParser
* scope: only server
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.3
* V.0.3.9 - Corrected Clear Routes
* V.0.4.0 - Removed Clear Routes
* V.0.4.2 - Added standard response sender
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
/** HTTP SERVER */
var THttpServer = /** @class */ (function (_super) {
    __extends(THttpServer, _super);
    /** server constructor */
    function THttpServer() {
        var _this = _super.call(this) || this;
        _this._app = express();
        _this._app.use(bodyParser.urlencoded({ extended: false }));
        _this._app.use(bodyParser.json());
        _this._app.use(cookieParser());
        _this._app.use(_this.StandardSender);
        _this._server = http.createServer(_this._app);
        _this._connections = [];
        return _this;
    }
    /** start server */
    THttpServer.prototype.Create = function (fn) {
        var ListenPort = 3000;
        var self = this;
        if (!this._httpPort) {
            console.log('HTTP Port was not been assigned to options');
        }
        else {
            ListenPort = this._httpPort || ListenPort;
            // enable destroy
            enableDestroy(this._server);
            // listen to the port
            this._server.listen(ListenPort, function (err) {
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
        // close server connection
        var server = this._server;
        // force all connections to disconnect
        server.destroy(function () {
            console.log("HTTP Server Stopped.");
            self.DoDestroy(fn);
        });
    };
    Object.defineProperty(THttpServer.prototype, "App", {
        /** return express application */
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(THttpServer.prototype, "HttpPort", {
        /** return http port */
        get: function () {
            return this._httpPort;
        },
        /** change http port */
        set: function (value) {
            this._httpPort = value;
        },
        enumerable: true,
        configurable: true
    });
    /** add static route */
    THttpServer.prototype.RouteStatic = function (path) {
        this._app.use(express.static(path));
    };
    /** create Router based on URI and return it */
    THttpServer.prototype.Router = function (uri) {
        var router = express.Router();
        this._app.use(uri, router);
        return router;
    };
    // mount middleware
    THttpServer.prototype.AddMiddleware = function (handler) {
        this._app.use(handler);
    };
    THttpServer.prototype.StandardSender = function (req, res, next) {
        res.sendData = function (status, data) {
            return res.status(status).json({ data: data, status: status });
        };
        next();
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
