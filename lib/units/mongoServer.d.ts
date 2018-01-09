/// <reference types="mongoose" />
import { TObject } from 'tobjectlist';
import { Schema, SchemaDefinition, Connection, Document } from 'mongoose';
export declare class TSchema {
    /** Name of Schema and of the Document */
    private _name;
    /** Mongoose Schema object */
    private _schema;
    /** TSchema Constructor */
    constructor(name: string, definition?: SchemaDefinition);
    /** Public Methods */
    readonly name: string;
    readonly schema: Schema;
}
export declare class TModel {
    private _model;
    /** TModel Constructor */
    constructor(App: Connection, ModelSchema: TSchema);
    /** Get Name of the Model */
    readonly name: string;
    /** Find Document in collection based on conditions */
    find(where: Object, callback?: (res: Document[], err: any) => void): void;
    /** Save Document and return callback */
    private save(doc, callback?);
    /** Insert Document */
    insert(data: Object, callback?: (res: Object, err: string[]) => void): void;
    /** Update Documents based on where */
    update(data: Object, where: Object, callback?: (res: Object, err: string[]) => void): void;
    /** Update Document based on ID */
    updateById(data: Object, id: string, callback?: (res: Object, err: string[]) => void): void;
    /** Delete Document based on where */
    delete(where: Object, callback?: (err: any) => void): void;
}
export declare class TMongoServer extends TObject {
    private models;
    private mongoApp;
    /** MongoDB adress */
    mongoURL: string;
    /** TMongoServer Constructor */
    constructor();
    /** Start Server Connection */
    Create(fn?: Function): void;
    /** Set Events to connection */
    On(event: string, cb: any): void;
    /** Destroy Server Connection */
    Destroy(fn?: Function): void;
    /** Add Schema and Create Model in the Server model list */
    AddModel(Schema: TSchema): void;
    SearchModel(ModelName: string): TModel;
}
