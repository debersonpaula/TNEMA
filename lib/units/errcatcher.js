"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IsolateDup(str) {
    var s1 = str.search('index: ') + 7;
    var s2 = str.search(' dup key:');
    var result = str.substr(s1, s2 - s1).match(/\w+(?=_)/);
    return result;
}
function ShowErrors(error, model) {
    var errors = [];
    if (error.code === 11000) {
        var str = error.errmsg;
        str = IsolateDup(str);
        errors.push(model.schema.obj[str].unique[1]);
    }
    else {
        for (var i in error.errors) {
            errors.push(error.errors[i].message);
        }
    }
    return errors;
}
exports.ShowErrors = ShowErrors;
