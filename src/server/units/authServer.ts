/*
* authServer
* descr: creates basic authentication server
* scope: only server
* dependencies: httpServer, mongoServer
* author: dpaula
* https://github.com/debersonpaula
*
*
* V.0.3.3
*/

// ===================================================
// === imports =======================================
import { TObject } from 'tobjectlist';
import { THttpServer } from './httpServer';
import { TSchema, TModel, TMongoServer } from './mongoServer';
import { Request, Response, Router, RequestHandler, NextFunction } from 'express';
import { TSessionApp } from './sessionHandler';

// ===================================================
// === classes =======================================
class TAuthServer extends TObject {
    // components
    private _HttpServer: THttpServer;
    private _MongoServer: TMongoServer;
    private _session: TSessionApp;
    
    // constructor
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer, SessionID: string, SessionFile: string) {
        super();
        this._HttpServer = HttpServer;
        this._MongoServer = MongoServer;
        //create store for session
        this._session = new TSessionApp({appName: SessionID, filename: SessionFile});
    }

    // start server
    public Create(fn?: Function) {
        // get standard db models
        this.InitStandardModels();
        // start routes
        this.InitRoutes();
        this.DoCreate(fn);
    }

    // stop server
    public Destroy(fn?: Function) {
        this.DoDestroy(fn);
    }

    // get all models from DefAStandard
    private InitStandardModels(){
        if (this._MongoServer){
            DefAStandard.StandardModels.forEach(modelSchema => {
                this._MongoServer.AddModel(modelSchema);
            });
        }
    }

    //Login User
    private UserLogin(username: string, userpass: string, res: Response, req: any): void {
        // const self = this;
        if (username && userpass){
            const getdata: TModel = this._MongoServer.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user and pass matches
                getdata.find({username: username, userpass: userpass}, (result) => {
                    // if result > 0, user found
                    if (result.length){
                        let tokenid = this._session.createSession(req, res, {username: username}).tokenid;
                        sendjson(res, 200, [{tokenid: tokenid}]);
                    } else {
                        sendjson(res, 403, ['User and Password not match.']);
                    }
                });
            }
        } else {
            sendjson(res, 403, ['User Name and Password fields cant be blank.']);
        }
    }

    //Register User
    private RegisterLogin(username: string, userpass: string, userpass2: string,
                          res: Response, req: any): void {

        if (!username || !userpass || userpass !== userpass2) {
            sendjson(res, 403, ['User Name and Password fields cant be blank '+
                    'and Passwords should be the same.']);
        } else {
            const model: TModel = this._MongoServer.SearchModel('dbUsers');
            if (model) {
                model.insert({username: username, userpass: userpass}, (result: any, err: any) => {
                    if (err.length) {
                        sendjson(res, 403, err);
                    } else {
                        let tokenid = this._session.createSession(req, res, {username: username}).tokenid;
                        sendjson(res, 200, [{tokenid: tokenid}]);
                    }
                });
            }
        }        
    }

    // Init Routes
    private InitRoutes(){
        // define route to user api
        var user = this._HttpServer.Router('/user');

        // define route to add user
        user.post('/', (req: Request, res: Response) => {
            this.RegisterLogin(
                req.body.username,
                req.body.userpass,
                req.body.userpass2,
                res, req);
        });

        // define route to log user
        user.post('/login', (req: Request, res: Response) => {
            this.UserLogin(
                req.body.username,
                req.body.userpass,
                res, req);
        });

        // define route to logout
        user.get('/logout', this._session.handler, (req: any, res: Response) => {
            if (req.session) {
                this._session.destroySession(req, res);
                sendjson(res, 200, [] );
            } else {
                sendjson(res, 401, ['Not authorized.']);
            }
        });

        // define route to get user session
        user.get('/', this._session.handler, (req: any, res: Response) => {
            if (req.session) {
                sendjson(res, 200, [req.session.data] );
            } else {
                sendjson(res, 401, ['Not authorized.']);
            }
        });
    }

    private _authRoute(req: any, res: Response, next: NextFunction){
        //this._session.handler(req, res, false);
        this._session.session(req,res);
        if (req.session) {
            next();
        } else {
            sendjson(res, 401, ['Not authorized.']);
        }
    }
    /** Auth Route Middleware */
    public get AuthRoute(): RequestHandler{
        return this._authRoute.bind(this);
    }
}
// ===================================================
// === general methods ===============================
// ===================================================
function sendjson(res: Response, status: number, msg: any[]) {
    res.status(status).json({
        messages: msg,
        status: status
    });
}
// ===================================================
// === exports =======================================
// ===================================================
export { TAuthServer };

export let DefAStandard = {
    StandardModels: [
        new TSchema('dbUsers',{
            username: {
                type: String,
                default: '',
                required: [true,'UserName is required'],
                unique: [true,'This UserName already exists']
            },
            userpass: {
                type: String,
                default: '',
                required: [true,'Password is required'],
            }
        })
    ]
};