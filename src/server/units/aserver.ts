/*
* AServer unit
* descr: authentication plugin
* scope: only server
* dependencies: tserver, mserver
* author: dpaula
* https://github.com/debersonpaula
*/
import { Request, Response } from 'express';
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
        });


        this.SOwner.AddRouter('/register')
            .post(function(req: Request, res: Response){
                const username = req.body.username,
                    userpass = req.body.userpass,
                    userpass2 = req.body.userpass2;
                if (!username || !userpass || userpass !== userpass2) {
                    res.send('User Name and Password fields cant be blank and Passwords should be the same.');
                }else {
                    const getdata: TModel = self.db.SearchModel('dbUsers');
                    if (getdata) {
                        // locate if the user exists
                        getdata.Find({username: username},function(result){
                            if (result.length){
                                res.status(200);
                                res.send('this user already exists');
                            }else {
                                // create user
                                getdata.Save({username: username, userpass: userpass}, function(result: any){
                                    if (result) {
                                        res.status(200);
                                        res.send('user registered');
                                    }
                                });
                            }
                        });
                    }
                }
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
