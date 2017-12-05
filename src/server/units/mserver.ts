/*
* MServer unit
* descr: creates connection to mongodb
* scope: only server
* dependencies: tserver
* author: dpaula
* https://github.com/debersonpaula
*/

import * as mongoose from 'mongoose';
import {TServer, TServerObject} from './tserver';

class MServer extends TServerObject {

    protected mongoApp: mongoose.Mongoose;
    protected models: Array<TModel>;
    public mongoURI: string;

    constructor(AOwner: TServer) {
        super(AOwner);
        this.models = [];
        this.mongoApp = new mongoose.Mongoose;
    }

    DoBeforeListen() {
        const dbURI: string = this.mongoURI;
        if (dbURI) {
            this.mongoApp.connection.on('connected', function(){ console.log('Connected to MongoDB, URL = ' + dbURI); });
            this.mongoApp.connection.on('error', function(err: any){ console.log('Not connected to MongoDB => Error: ' + err); });
            this.mongoApp.connection.on('disconnected', function(){ console.log('Disconnected to MongoDB, URL = '  + dbURI); });
            this.mongoApp.connection.on('open', function(){ console.log('Connection with MongoDB is open.'); });
            this.mongoApp.connect(dbURI, {useMongoClient: true});
        }
    }

    DoOnClose(fn?: (error: any) => void) {
        this.mongoApp.disconnect();
    }

    DoOnDestroy() {
        this.models = [];
        delete this.models;
        delete this.mongoApp;
    }

    AddModel(Schema: mongoose.SchemaDefinition, ModelName: string) {
        const content = new TModel(this.SOwner);
        content.Name = ModelName;
        content.Schema = new mongoose.Schema(Schema);
        content.Model = this.mongoApp.model(ModelName, content.Schema);
        this.models.push(content);
    }

    SearchModel(ModelName: string): TModel {
        let result: any;
        for (const i in this.models) {
            if (this.models[i].Name === ModelName) {
                result = this.models[i];
                break;
            }
        }
        return result;
    }
}

class TModel extends TServerObject {
    // components
    public Name: string;
    public Schema: mongoose.Schema;
    public Model: mongoose.Model<any>;
    // method to find
    public Find(conditions: Object, callback?: (result: any[]) => void ) {
        const self = this;
        self.Model.find(conditions, function(err: any, res: any[]){ self.ResultOperation(err, res, callback); });
    }
    // method to save
    public Save(data: Object, callback?: (result: any[]) => void ) {
        const self = this,
            savemodel: mongoose.Document = new self.Model(data);
        savemodel.save(function(err: any, res: any){ self.ResultOperation(err, res, callback); });
    }
    // method to return result of mongoose operation
    private ResultOperation(err: any, res: any, callback?: Function) {
        let result = false;
        if (err) {
            this.SOwner.Log(err);
        }else {
            result = res;
        }
        // callback && callback(result);
        if (callback) {
            callback(result);
        }
    }
}

export {MServer, TModel};
