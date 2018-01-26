"use strict";
/*
* mongoServer
* descr: creates connection to mongodb
* scope: only server
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.0
* V.0.4.0 - reviewed mongoclient
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
// =========================================================================
// === imports =============================================================
// =========================================================================
var tobjectlist_1 = require("tobjectlist");
var mongoose_1 = require("mongoose");
var errcatcher = require("./errcatcher");
// =========================================================================
// === classes =============================================================
// =========================================================================
var TSchema = /** @class */ (function () {
    /** TSchema Constructor */
    function TSchema(name, definition) {
        this._name = name;
        this._schema = new mongoose_1.Schema(definition);
    }
    Object.defineProperty(TSchema.prototype, "name", {
        /** Public Methods */
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TSchema.prototype, "schema", {
        get: function () {
            return this._schema;
        },
        enumerable: true,
        configurable: true
    });
    return TSchema;
}());
exports.TSchema = TSchema;
// =========================================================================
// =========================================================================
// =========================================================================
var TModel = /** @class */ (function () {
    /** TModel Constructor */
    function TModel(App, ModelSchema) {
        this._model = App.model(ModelSchema.name, ModelSchema.schema);
        this._model.ensureIndexes();
    }
    Object.defineProperty(TModel.prototype, "name", {
        /** Get Name of the Model */
        get: function () {
            return this._model.modelName;
        },
        enumerable: true,
        configurable: true
    });
    /** Find Document in collection based on conditions */
    TModel.prototype.find = function (where, callback) {
        this._model.find(where, function (findErr, findRes) {
            callback && callback(findRes, findErr);
        });
    };
    /** Save Document and return callback */
    TModel.prototype.save = function (doc, callback) {
        var _this = this;
        doc.save().then(
        // onfullfiled
        function (value) {
            callback && callback(value, []);
        }, 
        // onrejected
        function (reason) {
            callback && callback(doc, errcatcher.ShowErrors(reason, _this._model));
        });
    };
    /** Insert Document */
    TModel.prototype.insert = function (data, callback) {
        this.save(new this._model(data), callback);
    };
    /** Update Documents based on where */
    TModel.prototype.update = function (data, where, callback) {
        var _this = this;
        this._model.find(where, function (err, res) {
            for (var i in res) {
                res[i].set(data);
                _this.save(res[i], callback);
            }
        });
    };
    /** Update Document based on ID */
    TModel.prototype.updateById = function (data, id, callback) {
        var _this = this;
        this._model.findById(id, function (err, res) {
            res.set(data);
            _this.save(res, callback);
        });
    };
    /** Delete Document based on where */
    TModel.prototype.delete = function (where, callback) {
        this._model.remove(where, function (err) {
            if (err) {
                callback && callback(err);
            }
        });
    };
    return TModel;
}());
exports.TModel = TModel;
// =========================================================================
// =========================================================================
// =========================================================================
var TMongoServer = /** @class */ (function (_super) {
    __extends(TMongoServer, _super);
    /** TMongoServer Constructor */
    function TMongoServer() {
        var _this = _super.call(this) || this;
        _this.models = [];
        _this.mongoApp = new mongoose_1.Mongoose;
        _this.mongoApp.Promise = global.Promise;
        return _this;
    }
    /** Start Server Connection */
    TMongoServer.prototype.Create = function (fn) {
        var self = this;
        var dbURI = this.mongoURL;
        if (dbURI) {
            //this.mongoApp.connect(dbURI, {useMongoClient: true}, function(){
            this.mongoApp.connect(dbURI, function () {
                self.DoCreate(fn);
            });
        }
    };
    /** Set Events to connection */
    TMongoServer.prototype.On = function (event, cb) {
        this.mongoApp.connection.on(event, cb);
    };
    /** Destroy Server Connection */
    TMongoServer.prototype.Destroy = function (fn) {
        var self = this;
        // close server connection
        this.mongoApp.disconnect(function () {
            delete self.models;
            self.models = [];
            self.DoDestroy(fn);
        });
    };
    /** Add Schema and Create Model in the Server model list */
    TMongoServer.prototype.AddModel = function (Schema) {
        var model = new TModel(this.mongoApp.connection, Schema);
        this.models.push(model);
    };
    // search model by name
    TMongoServer.prototype.SearchModel = function (ModelName) {
        var result;
        for (var i in this.models) {
            if (this.models[i].name === ModelName) {
                result = this.models[i];
                break;
            }
        }
        return result;
    };
    return TMongoServer;
}(tobjectlist_1.TObject));
exports.TMongoServer = TMongoServer;
// =========================================================================
// =========================================================================
// ========================================================================= 
