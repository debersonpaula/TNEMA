"use strict";
/*
* MServer unit
* descr: creates connection to mongodb
* scope: only server
* dependencies: tserver
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
var mongoose = require("mongoose");
var tserver_1 = require("./tserver");
var MServer = /** @class */ (function (_super) {
    __extends(MServer, _super);
    function MServer(AOwner) {
        var _this = _super.call(this, AOwner) || this;
        // AOwner.Options.mongoURL = '';
        _this.models = [];
        return _this;
    }
    MServer.prototype.DoBeforeListen = function () {
        var dbURI = this.mongoURI;
        if (dbURI) {
            mongoose.connection.on('connected', function () { console.log('Connected to MongoDB, URL = ' + dbURI); });
            mongoose.connection.on('error', function (err) { console.log('Not connected to MongoDB => Error: ' + err); });
            mongoose.connection.on('disconnected', function () { console.log('Disconnected to MongoDB, URL = ' + dbURI); });
            mongoose.connection.on('open', function () { console.log('Connection with MongoDB is open.'); });
            mongoose.connect(dbURI, { useMongoClient: true });
        }
    };
    MServer.prototype.DoOnClose = function () {
        mongoose.disconnect();
    };
    MServer.prototype.AddModel = function (Schema, ModelName) {
        var content = new TModel(this.SOwner);
        content.Name = ModelName;
        content.Schema = new mongoose.Schema(Schema);
        content.Model = mongoose.model(ModelName, content.Schema);
        this.models.push(content);
    };
    MServer.prototype.SearchModel = function (ModelName) {
        var result;
        for (var i in this.models) {
            if (this.models[i].Name === ModelName) {
                result = this.models[i];
                break;
            }
        }
        return result;
    };
    return MServer;
}(tserver_1.TServerObject));
exports.MServer = MServer;
var TModel = /** @class */ (function (_super) {
    __extends(TModel, _super);
    function TModel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // method to find
    TModel.prototype.Find = function (conditions, callback) {
        var self = this;
        self.Model.find(conditions, function (err, res) { self.ResultOperation(err, res, callback); });
    };
    // method to save
    TModel.prototype.Save = function (data, callback) {
        var self = this, savemodel = new self.Model(data);
        savemodel.save(function (err, res) { self.ResultOperation(err, res, callback); });
    };
    // method to return result of mongoose operation
    TModel.prototype.ResultOperation = function (err, res, callback) {
        var result = false;
        if (err) {
            this.SOwner.Log(err);
        }
        else {
            result = res;
        }
        // callback && callback(result);
        if (callback) {
            callback(result);
        }
    };
    return TModel;
}(tserver_1.TServerObject));
exports.TModel = TModel;
