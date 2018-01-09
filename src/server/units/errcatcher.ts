import { Model } from 'mongoose';

function IsolateDup(str: string): any{
    const s1 = str.search('index: ') + 7;
    const s2 = str.search(' dup key:');
    const result = str.substr(s1,s2-s1).match(/\w+(?=_)/);
    return result;
}

export function ShowErrors(error: any, model: Model<any>): string[]{
    var errors: string[] = [];
    if (error.code === 11000) {
        var str = error.errmsg;
        str = IsolateDup(str);
        errors.push( model.schema.obj[str].unique[1] );
    } else {
        for (var i in error.errors){
            errors.push(error.errors[i].message);
        }
    }
    return errors;
}