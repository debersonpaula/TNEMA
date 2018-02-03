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
* V.0.3.6 - added schema list and options to authserver
* V.0.3.7 - reviewed get session
* V.0.4.2 - reviewed senders
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
    private _schemas: TSchema[];
    private _options: any;

    // constructor
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer, SessionID: string, SessionFile: string) {
        super();
        this._HttpServer = HttpServer;
        this._MongoServer = MongoServer;
        // create store for session
        this._session = new TSessionApp({appName: SessionID, filename: SessionFile});
        // initialize options
        this._options = {
            user: 'username',
            pass: 'userpass',
            users: 'dbUsers',
            sessionInfo: ['_id', 'username']
        }
        // initialize schemas
        this._schemas = [
            new TSchema(this._options.users ,{
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
        ];
    }

    // properties
    get Session(): TSessionApp {
        return this._session;
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

    // overwrite schemas
    public OverwriteSchemas(schemas: TSchema[]) {
        this._schemas = schemas;
    }

    // overwrite options
    public OverwriteOptions(options: any) {
        for (var field in options) {
            this._options[field] = options[field];
        }
    }

    // get all models from DefAStandard
    private InitStandardModels(){
        if (this._MongoServer){
            this._schemas.forEach(modelSchema => {
                this._MongoServer.AddModel(modelSchema);
            });
        }
    }

    //Login User
    private setLogin(req: any, res: Response): void {
        const username = req.body[ this._options.user ];
        const userpass = req.body[ this._options.pass ];
        if (username && userpass){
            const getdata: TModel = this._MongoServer.SearchModel( this._options.users );
            if (getdata) {
                // locate if the user and pass matches
                getdata.find({username: username, userpass: userpass}, (result) => {
                    // if result > 0, user found
                    if (result.length > 0){
                        let tokenid = this._session.createSession(req, res, this.getSessionData(result[0])).tokenid;
                        res.sendData(200, [{tokenid: tokenid}]);
                    } else {
                        res.sendData(403, ['User and Password not match.']);
                    }
                });
            }
        } else {
            res.sendData(403, ['User Name and Password fields cant be blank.']);
        }
    }

    //Register User
    private setRegister(req: any, res: Response): void {
        const userData = req.body;
        const model: TModel = this._MongoServer.SearchModel( this._options.users );
        if (model) {
            model.insert(userData, (result: any, err: any) => {
                if (err.length) {
                    res.sendData(403, err);
                } else {
                    // create session, get token id and send it to the requester
                    const tokenid = this._session.createSession(req, res, this.getSessionData(result)).tokenid;
                    res.sendData(200, [{tokenid: tokenid}]);
                }
            });
        }
    }

    private getSessionData(source: any) {
        var dest: any = {};
        this._options.sessionInfo.forEach( (element: string) => {
            dest[element] = source[element];
        });
        return dest;
    }

    // Init Routes
    private InitRoutes(){
        // define route to user api
        var user = this._HttpServer.Router('/user');

        // define route to add user
        user.post('/', (req: Request, res: Response) => {
            this.setRegister(req, res);
        });

        // define route to log user
        user.post('/login', (req: Request, res: Response) => {
            this.setLogin(req, res);
        });

        // define route to logout
        user.get('/logout', this._session.handler, (req: any, res: Response) => {
            if (req.session) {
                this._session.destroySession(req, res);
                res.sendData(200, []);
            } else {
                res.sendData(401, ['Not authorized.']);
            }
        });

        // define route to get user session
        user.get('/', this._session.handler, (req: any, res: Response) => {
            if (req.session) {
                res.sendData(200, [req.session.data] );
            } else {
                res.sendData(401, ['Not authorized.']);
            }
        });
    }

    private _authRoute(req: any, res: Response, next: NextFunction){
        this._session.session(req,res);
        if (req.session) {
            next();
        } else {
            res.sendData(401, ['Not authorized.']);
        }
    }
    /** Auth Route Middleware */
    public get AuthRoute(): RequestHandler{
        return this._authRoute.bind(this);
    }
}
// ===================================================
// === exports =======================================
// ===================================================
export { TAuthServer };
