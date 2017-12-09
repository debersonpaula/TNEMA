/// <reference types="mongoose" />
import { TObject } from 'tobjectlist';
import * as mongoose from 'mongoose';
export declare class TModel {
    Name: string;
    Schema: mongoose.Schema;
    Model: mongoose.Model<any>;
    Find(conditions: Object, callback?: (result: any[]) => void): void;
    Save(data: Object, callback?: (result: any[]) => void): void;
    private ResultOperation(err, res, callback?);
}
export declare class TMongoServer extends TObject {
    private models;
    private mongoApp;
    mongoURI: string;
    constructor();
    Create(fn?: Function): void;
    Destroy(fn?: Function): void;
    AddModel(Schema: mongoose.SchemaDefinition, ModelName: string): void;
    SearchModel(ModelName: string): TModel;
}
