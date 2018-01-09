/*
* authServer
* descr: creates basic authentication server
* scope: only server
* dependencies: httpServer, mongoServer
* author: dpaula
* https://github.com/debersonpaula
*/

// ===================================================
// === imports =======================================
import { TObject } from 'tobjectlist';
import { THttpServer } from './httpServer';
import { TSchema, TModel, TMongoServer } from './mongoServer';

import { Request, Response } from 'express';
import * as express from 'express';
import * as session from 'express-session';
import { Router } from 'express-serve-static-core';
import { RequestHandler } from '_debugger';

// ===================================================
// === classes =======================================
class TAuthServer extends TObject {
    // components
    private hServer: THttpServer;
    private mServer: TMongoServer;
    private userAPI: Router;
    private sessionHandler: express.RequestHandler;    
    
    // constructor
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer, SessionID: string, SecretID: string) {
        super();
        this.hServer = HttpServer;
        this.mServer = MongoServer;
        //create store for session
        let FileStore = require('session-file-store')(session);
        //start session
        HttpServer.AddMiddleware(session({
            store: new FileStore,
            secret: SecretID,
            name: SessionID,
            resave: true,
            saveUninitialized: true
        }));
        //get user api
        this.userAPI = this.hServer.UseRouter('/user');
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
        if (this.mServer){
            DefAStandard.StandardModels.forEach(modelSchema => {
                this.mServer.AddModel(modelSchema);
            });
        }
    }

    //Login User
    private UserLogin(username: string, userpass: string, res: Response, req: any): void {
        // const self = this;
        if (username && userpass){
            const getdata: TModel = this.mServer.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user and pass matches
                getdata.find({username: username, userpass: userpass}, (result) => {
                    // if result > 0, user found
                    if (result.length){
                        this.CreateSession(req, username);
                        sendjson(res, 200, []);
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
            const model: TModel = this.mServer.SearchModel('dbUsers');
            if (model) {
                model.insert({username: username, userpass: userpass}, (result: any, err: any) => {
                    if (err.length) {
                        sendjson(res, 403, err);
                    } else {
                        this.CreateSession(req, username);
                        sendjson(res, 200, []);
                    }
                });
            }
        }        
    }

    //method to register user in session
    private CreateSession(req: any, username: string){
        req.session.username = username;
        req.session.logged = true;
    }

    // Init Routes
    private InitRoutes(){
        const self = this;
        // define route to user registration
        let user = this.userAPI;

        // Authentication and Authorization Middleware
        var auth = function(req: Request, res: Response, next: Function) {
            if (req.session && req.session.logged === true)
                return next();
            else{
                sendjson(res, 401, ['Not authorized.']);
            }
        };

        // define route to add user
        user.post('/', function (req: Request, res: Response){
            self.RegisterLogin(
                req.body.username,
                req.body.userpass,
                req.body.userpass2,
                res, req);
        });

        // define route to log user
        user.post('/login', function (req: Request, res: Response){
            self.UserLogin(
                req.body.username,
                req.body.userpass,
                res, req);
        });

        // define route to get user session
        user.get('/', auth, function (req: Request, res: Response){
            const session: any = req.session;
            const content = {
                username: session.username
            };
            //console.log(session);
            sendjson(res, 200, [{username: session.username}] );
        });

        // define route to logout
        user.get('/logout', auth, function (req: any, res: Response){
            req.session.destroy();
            sendjson(res, 200, []);
        });
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