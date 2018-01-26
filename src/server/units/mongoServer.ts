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

// =========================================================================
// === imports =============================================================
// =========================================================================
import { TObject } from 'tobjectlist';
import { Schema, SchemaDefinition, Model, Connection, Document, Mongoose } from 'mongoose';
import * as errcatcher from './errcatcher';
// =========================================================================
// === classes =============================================================
// =========================================================================
export class TSchema {

    /** Name of Schema and of the Document */
    private _name: string;

    /** Mongoose Schema object */
    private _schema: Schema;

    /** TSchema Constructor */
    constructor(name: string, definition?: SchemaDefinition){
        this._name = name;
        this._schema = new Schema(definition);
    }

    /** Public Methods */
    get name(): string {
        return this._name;
    }

    get schema(): Schema {
        return this._schema;
    }
}
// =========================================================================
// =========================================================================
// =========================================================================
export class TModel {
    // components
    private _model: Model<any>;

    /** TModel Constructor */
    constructor(App: Connection, ModelSchema: TSchema){
        this._model = App.model(ModelSchema.name, ModelSchema.schema);
        this._model.ensureIndexes();
    }

    /** Get Name of the Model */
    get name() {
        return this._model.modelName;
    }

    /** Find Document in collection based on conditions */
    public find(where: Object, callback?: (res: Document[], err: any) => void ) {
        this._model.find(where, (findErr: any, findRes: Document[]) => {
            callback && callback(findRes, findErr);
        });
    }

    /** Save Document and return callback */
    private save(doc: Document, callback?: (res: Object, err: string[]) => void) {
        doc.save().then(
            // onfullfiled
            (value: any) => {
                callback && callback(value, []);
            },
            // onrejected
            (reason: any) => {
                callback && callback(doc, errcatcher.ShowErrors(reason, this._model));
            }
        );
    }

    /** Insert Document */
    public insert(data: Object, callback?: (res: Object, err: string[]) => void) {
        this.save(new this._model(data), callback);
    }

    /** Update Documents based on where */
    public update(data: Object, where: Object, callback?: (res: Object, err: string[]) => void) {
        this._model.find(where, (err: any, res: Document[]) => {
            for (const i in res) {
                res[i].set(data);
                this.save(res[i], callback);
            }
        });
    }

    /** Update Document based on ID */
    public updateById(data: Object, id: string, callback?: (res: Object, err: string[]) => void) {
        this._model.findById(id, (err: any, res: Document) => {
            res.set(data);
            this.save(res, callback);
        });
    }

    /** Delete Document based on where */
    public delete(where: Object, callback?: (err: any) => void) {
        this._model.remove(where, (err) => {
            if (err) {
                callback && callback(err);
            }
        });
    }
}
// =========================================================================
// =========================================================================
// =========================================================================
export class TMongoServer extends TObject {
    // components
    private models: Array<TModel>;
    private mongoApp: Mongoose;

    /** MongoDB adress */
    public mongoURL: string;
    
    /** TMongoServer Constructor */
    constructor() {
        super();
        this.models = [];
        this.mongoApp = new Mongoose;
        this.mongoApp.Promise = global.Promise;
    }

    /** Start Server Connection */
    public Create(fn?: Function) {
        const self = this;
        const dbURI: string = this.mongoURL;
        if (dbURI) {
            //this.mongoApp.connect(dbURI, {useMongoClient: true}, function(){
            this.mongoApp.connect(dbURI, function(){
                self.DoCreate(fn);
            });
        }
    }

    /** Set Events to connection */
    public On(event: string, cb: any){
        this.mongoApp.connection.on(event, cb);
    }

    /** Destroy Server Connection */
    public Destroy(fn?: Function) {
        const self = this;
        // close server connection
        this.mongoApp.disconnect(function(){
            delete self.models;
            self.models = [];
            self.DoDestroy(fn);
        });
    }

    /** Add Schema and Create Model in the Server model list */
    AddModel(Schema: TSchema) {
        const model = new TModel(this.mongoApp.connection, Schema);
        this.models.push(model);
    }

    // search model by name
    SearchModel(ModelName: string): TModel {
        let result: any;
        for (const i in this.models) {
            if (this.models[i].name === ModelName) {
                result = this.models[i];
                break;
            }
        }
        return result;
    }
}
// =========================================================================
// =========================================================================
// =========================================================================