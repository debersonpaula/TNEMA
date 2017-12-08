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
import { TModel, TMongoServer } from './mongoServer';

import { Request, Response } from 'express';
import * as session from 'express-session';
import { Router } from 'express-serve-static-core';

// ===================================================
// === classes =======================================
class TAuthServer extends TObject {
    // components
    private hServer: THttpServer;
    private mServer: TMongoServer;
    private userAPI: Router;
    
    // constructor
    constructor(HttpServer: THttpServer, MongoServer: TMongoServer) {
        super();
        this.hServer = HttpServer;
        this.mServer = MongoServer;
        //start session
        HttpServer.AddMiddleware(session({
            secret: 'Was8-df90-poqw',
            resave: true,
            saveUninitialized: true
        }));
        //get user api
        this.userAPI = this.hServer.AddUseRouter('/user');
    }

    // start server
    public Create(fn?: Function) {
        const self = this;
        console.log(`Auth Server Started.`);
        this.InitStandardModels();
        this.InitRoutes();
        self.DoCreate(fn);
    }

    // stop server
    public Destroy(fn?: Function) {
        const self = this;
        //self.userAPI
        //delete self.userAPI;
        console.log(`Auth Server Stopped.`);
        self.DoDestroy(fn);
    }

    // get all models from DefAStandard
    private InitStandardModels(){
        if (this.mServer){
            DefAStandard.StandardModels.forEach(model => {
                this.mServer.AddModel(model.Schema, model.Name);
            });
        }
    }

    //standard way to send response
    private SendResponse(res: Response, code: string, msg: string): Response {
        const resp = { code: code, msg: msg};
        return res.json(resp);
    }

    //Login User
    private UserLogin(username: string, userpass: string, res: Response, req: any): void {
        const self = this;
        //const getdata: TModel = this.db.SearchModel('dbUsers');
        if (username && userpass){
            const getdata: TModel = this.mServer.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user and pass matches
                getdata.Find({username: username, userpass: userpass},function(result){
                    // if result > 0, user found
                    if (result.length){
                        self.CreateSession(req, username);
                        self.SendResponse(res,'ACCEPTED','User logged.');
                    } else {
                        self.SendResponse(res,'INVALID','User and Password not match.');
                    }
                });
            }
        } else {
            this.SendResponse(res,'INVALID','User Name and Password fields cant be blank.');
        }
    }

    //Register User
    private RegisterLogin(username: string, userpass: string, userpass2: string, res: Response): void {
        const self = this;

        if (!username || !userpass || userpass !== userpass2) {
            self.SendResponse(res,'INVALID','User Name and Password fields cant be blank and Passwords should be the same.');
        } else {
            const getdata: TModel = self.mServer.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user exists
                getdata.Find({username: username},function(result){
                    if (result.length){
                        self.SendResponse(res,'INVALID','This user already exists.');
                    }else {
                        // create user
                        getdata.Save({username: username, userpass: userpass}, function(result: any){
                            if (result) {
                                self.SendResponse(res,'ACCEPTED','User registered.');
                            }
                        });
                    }
                });
            }
        }        
    }

    //method to register user in session
    private CreateSession(req: any, username: string){
        req.session.username = username;
        //req.session.userid = userdata._id;
        req.session.logged = true;
    }

    // Init Routes
    private InitRoutes(){
        const self = this;
        // define route to user registration
        //let user = this.hServer.AddUseRouter('/user');
        let user = this.userAPI;

        // Authentication and Authorization Middleware
        var auth = function(req: Request, res: Response, next: Function) {
            if (req.session && req.session.logged === true)
                return next();
            else{
                return self.SendResponse(res,'UNAUTHORIZED','You are not logged!');
            }
        };

        // define route to add user
        user.post('/', function (req: Request, res: Response){
            self.RegisterLogin(
                req.body.username,
                req.body.userpass,
                req.body.userpass2,
                res);
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
            return self.SendResponse(res,'LOGGED','You are logged!');
        });

        // define route to logout
        user.get('/logout', auth, function (req: any, res: Response){
            req.session.destroy();
            return self.SendResponse(res,'LOGOUT','You are logged out!');
        });

        // define route to logout
        user.get('/test', function (req: any, res: Response){
            //return self.SendResponse(res,'LOGOUT','You are logged out!');
            res.send('hello Test 7');
        });
    }
}
// ===================================================
// === exports =======================================
export { TAuthServer };

export let DefAStandard = {
    StandardModels: [
        {
            Name: 'dbUsers',
            Schema: {
                username: {type: String, default: ''},
                userpass: {type: String, default: ''}
            }
        }
    ]
};