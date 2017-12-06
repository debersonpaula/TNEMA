"use strict";
/*
* TNEMServer unit
* descr: TNEM Complete Pack
* scope: only server
* dependencies:
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
var tobjectlist_1 = require("./units/tobjectlist");
var httpServer_1 = require("./units/httpServer");
// ===================================================
// === classes =======================================
var TNEMAServer = /** @class */ (function (_super) {
    __extends(TNEMAServer, _super);
    function TNEMAServer() {
        var _this = _super.call(this) || this;
        // initialize servers
        _this.HttpServer = new httpServer_1.THttpServer;
        _this.HttpServer.httpPort = 3000;
        //add to object list
        _this.AddObject(_this.HttpServer);
        return _this;
    }
    return TNEMAServer;
}(tobjectlist_1.TObjectList));
module.exports = new TNEMAServer;
//export { TNEMAServer }; 
