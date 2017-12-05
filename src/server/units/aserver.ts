/*
* AServer unit
* descr: authentication plugin
* scope: only server
* dependencies: tserver, mserver
* author: dpaula
* https://github.com/debersonpaula
*/
import { Request, Response } from 'express';
import * as session from 'express-session';
import { TServer, TServerObject } from './tserver';
import { MServer, TModel } from './mserver';

class AServer extends TServerObject {
    private db: MServer;
    constructor(AOwner: TServer) {
        super(AOwner);
    }
    DoBeforeListen() {
        const self = this;
        self.db = self.SOwner.Find(MServer);
        self.RegisterStandardModels();

        // define route to user registration
        let user = this.SOwner.AddUseRouter('/user');

        // define route to add user
        user.post('/', function (req: Request, res: Response){
            const username = req.body.username,
                userpass = req.body.userpass,
                userpass2 = req.body.userpass2;
            if (!username || !userpass || userpass !== userpass2) {
                self.SendResponse(res,'INVALID','User Name and Password fields cant be blank and Passwords should be the same.');
            } else {
                const getdata: TModel = self.db.SearchModel('dbUsers');
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
        });

        // define route to add user
        user.get('/login', function (req: Request, res: Response){
            res.send('teste');
        });
    }

    DoOnDestroy() {}
    
    // private RoutePostRegister
    private RegisterStandardModels(){
        if (this.db){
            DefAStandard.StandardModels.forEach(model => {
                this.db.AddModel(model.Schema,model.Name);
            });
        }
    }

    //standard way to send response
    private SendResponse(res: Response, code: string, msg: string): void {
        const resp = { code: code, msg: msg};
        res.json(resp);
    }

    //Login User
    private UserLogin(username: string, userpass: string, res: Response): boolean {
        let result = false;
        const self = this;
        //const getdata: TModel = this.db.SearchModel('dbUsers');
        if (username && userpass){
            const getdata: TModel = this.db.SearchModel('dbUsers');
            if (getdata) {
                // locate if the user and pass matches
                getdata.Find({username: username, userpass: userpass},function(result){
                    // if result > 0, user found
                    if (result.length){
                        self.SendResponse(res,'ACCEPTED','User logged.');
                    } else {
                        self.SendResponse(res,'INVALID','User and Password not match.');
                    }
                });
            }
        } else {
            this.SendResponse(res,'INVALID','User Name and Password fields cant be blank.');
        }
        return result;
    }
}

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

export {AServer};
