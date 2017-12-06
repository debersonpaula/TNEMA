"use strict";
/*
* mongoServer
* descr: creates connection to mongodb
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
var mongoose = require("mongoose");
// ===================================================
// === classes =======================================
var TMongoServer = /** @class */ (function (_super) {
    __extends(TMongoServer, _super);
    // constructor
    function TMongoServer() {
        var _this = _super.call(this) || this;
        _this.models = [];
        _this.mongoApp = new mongoose.Mongoose;
        return _this;
    }
    // start server
    TMongoServer.prototype.Create = function (fn) {
        var self = this;
        var dbURI = this.mongoURI;
        if (dbURI) {
            this.mongoApp.connection.on('connected', function () { console.log('Connected to MongoDB, URL = ' + dbURI); });
            this.mongoApp.connection.on('error', function (err) { console.log('Not connected to MongoDB => Error: ' + err); });
            this.mongoApp.connection.on('disconnected', function () { console.log('Disconnected to MongoDB, URL = ' + dbURI); });
            this.mongoApp.connection.on('open', function () { console.log('Connection with MongoDB is open.'); });
            this.mongoApp.connect(dbURI, { useMongoClient: true }, function () {
                console.log("Mongo Server Started.");
                self.DoCreate(fn);
            });
        }
    };
    // stop server
    TMongoServer.prototype.Destroy = function (fn) {
        var self = this;
        // close server connection
        this.mongoApp.disconnect(function () {
            console.log("Mongo Server Stopped.");
            delete self.models;
            self.models = [];
            self.DoDestroy(fn);
        });
    };
    // add mongoose model
    TMongoServer.prototype.AddModel = function (Schema, ModelName) {
        var content = new TModel();
        content.Name = ModelName;
        content.Schema = new mongoose.Schema(Schema);
        content.Model = this.mongoApp.model(ModelName, content.Schema);
        this.models.push(content);
    };
    // search model by name
    TMongoServer.prototype.SearchModel = function (ModelName) {
        var result;
        for (var i in this.models) {
            if (this.models[i].Name === ModelName) {
                result = this.models[i];
                break;
            }
        }
        return result;
    };
    return TMongoServer;
}(tobjectlist_1.TObject));
exports.TMongoServer = TMongoServer;
var TModel = /** @class */ (function () {
    function TModel() {
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
            console.log(err);
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
}());
exports.TModel = TModel;
