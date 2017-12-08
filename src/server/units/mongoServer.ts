/*
* mongoServer
* descr: creates connection to mongodb
* scope: only server
* author: dpaula
* https://github.com/debersonpaula
*/

// ===================================================
// === imports =======================================
import { TObject } from 'tobjectlist';
import * as mongoose from 'mongoose';

// ===================================================
// === classes =======================================
class TMongoServer extends TObject {
    // components
    private models: Array<TModel>;
    private mongoApp: mongoose.Mongoose;

    // properties
    public mongoURI: string;
    
    // constructor
    constructor() {
        super();
        this.models = [];
        this.mongoApp = new mongoose.Mongoose;
    }

    // start server
    public Create(fn?: Function) {
        const self = this;
        const dbURI: string = this.mongoURI;
        if (dbURI) {
            this.mongoApp.connection.on('connected', function(){ console.log('Connected to MongoDB, URL = ' + dbURI); });
            this.mongoApp.connection.on('error', function(err: any){ console.log('Not connected to MongoDB => Error: ' + err); });
            this.mongoApp.connection.on('disconnected', function(){ console.log('Disconnected to MongoDB, URL = '  + dbURI); });
            this.mongoApp.connection.on('open', function(){ console.log('Connection with MongoDB is open.'); });
            this.mongoApp.connect(dbURI, {useMongoClient: true}, function(){
                console.log(`Mongo Server Started.`);
                self.DoCreate(fn);
            });
        }
    }

    // stop server
    public Destroy(fn?: Function) {
        const self = this;
        // close server connection
        this.mongoApp.disconnect(function(){
            console.log(`Mongo Server Stopped.`);
            delete self.models;
            self.models = [];
            self.DoDestroy(fn);
        });
    }

    // add mongoose model
    AddModel(Schema: mongoose.SchemaDefinition, ModelName: string) {
        const content = new TModel();
        content.Name = ModelName;
        content.Schema = new mongoose.Schema(Schema);
        content.Model = this.mongoApp.model(ModelName, content.Schema);
        this.models.push(content);
    }

    // search model by name
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

class TModel {
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
            console.log(err);
        }else {
            result = res;
        }
        // callback && callback(result);
        if (callback) {
            callback(result);
        }
    }
}
// ===================================================
// === exports =======================================
export { TMongoServer, TModel };