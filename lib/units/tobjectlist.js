"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DebugMode = false;
function DebugLog(msg) {
    if (DebugMode) {
        console.log(msg);
    }
}
var TObject = /** @class */ (function () {
    // constructor
    function TObject() {
        DebugLog('TObject/constructor');
        this.OnCreate = false;
        this.OnDestroy = false;
    }
    // methods
    TObject.prototype.Create = function (fn) {
        this.DoCreate(fn);
    };
    TObject.prototype.Destroy = function (fn) {
        this.DoDestroy(fn);
    };
    // protected methods
    TObject.prototype.DoCreate = function (fn) {
        DebugLog('TObject/Create');
        this.OnCreate = true;
        fn && fn();
    };
    TObject.prototype.DoDestroy = function (fn) {
        DebugLog('TObject/Destroy');
        this.OnDestroy = true;
        fn && fn();
    };
    return TObject;
}());
exports.TObject = TObject;
var TObjectList = /** @class */ (function () {
    // constructor
    function TObjectList() {
        DebugLog('TObjectList/constructor');
        this.objectList = [];
    }
    // methods
    TObjectList.prototype.AddObject = function (obj) {
        DebugLog('TObjectList/AddObject');
        this.objectList.push(obj);
    };
    // create all objects
    TObjectList.prototype.Create = function (fn) {
        var self = this;
        for (var i in this.objectList) {
            this.objectList[i].Create(function () {
                self.CheckIfCreated(fn);
            });
        }
    };
    // check if all objects were created and call fn
    TObjectList.prototype.CheckIfCreated = function (fn) {
        var result = false;
        for (var i in this.objectList) {
            if (this.objectList[i].OnCreate) {
                result = true;
            }
            else {
                result = false;
                break;
            }
        }
        if (result) {
            fn && fn();
        }
    };
    // destroy all objects
    TObjectList.prototype.Destroy = function (fn) {
        var self = this;
        for (var i in this.objectList) {
            this.objectList[i].Destroy(function () {
                self.CheckIfDestroyed(fn);
            });
        }
    };
    // check if all objects were destroyed and call fn
    TObjectList.prototype.CheckIfDestroyed = function (fn) {
        var result = false;
        for (var i in this.objectList) {
            if (this.objectList[i].OnDestroy) {
                result = true;
            }
            else {
                result = false;
                break;
            }
        }
        if (result) {
            fn && fn();
        }
    };
    return TObjectList;
}());
exports.TObjectList = TObjectList;
