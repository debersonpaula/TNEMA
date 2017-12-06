const DebugMode = false;
function DebugLog(msg: string){
    if (DebugMode){
        console.log(msg);
    }
}

class TObject{
    // events controller
    public OnCreate: boolean;
    public OnDestroy: boolean;

    // constructor
    constructor() {
        DebugLog('TObject/constructor');
        this.OnCreate = false;
        this.OnDestroy = false;
    }

    // methods
    public Create(fn?: Function) {
        this.DoCreate(fn);
    }
    public Destroy(fn?: Function) {
        this.DoDestroy(fn);
    }

    // protected methods
    protected DoCreate(fn?: Function) {
        DebugLog('TObject/Create');
        this.OnCreate = true;
        fn && fn();
    }
    protected DoDestroy(fn?: Function) {
        DebugLog('TObject/Destroy');
        this.OnDestroy = true;
        fn && fn();
    }
}

class TObjectList{
    private objectList: Array<TObject>;
    // constructor
    constructor() {
        DebugLog('TObjectList/constructor');
        this.objectList = [];
    }
    // methods
    public AddObject(obj: TObject): void {
        DebugLog('TObjectList/AddObject');
        this.objectList.push(obj);
    }
    // create all objects
    public Create(fn?: Function): void {
        const self = this;
        for(const i in this.objectList){
            this.objectList[i].Create(function(){
                self.CheckIfCreated(fn);
            });
        }
    }
    // check if all objects were created and call fn
    private CheckIfCreated(fn?: Function){
        let result = false;
        for(const i in this.objectList){
            if (this.objectList[i].OnCreate){
                result = true;
            } else {
                result = false;
                break;
            }
        }
        if (result) {
            fn && fn();
        }
    }
    // destroy all objects
    public Destroy(fn?: Function): void {
        const self = this;
        for(const i in this.objectList){
            this.objectList[i].Destroy(function(){
                self.CheckIfDestroyed(fn);
            });
        }
    }
    // check if all objects were destroyed and call fn
    private CheckIfDestroyed(fn?: Function){
        let result = false;
        for(const i in this.objectList){
            if (this.objectList[i].OnDestroy){
                result = true;
            } else {
                result = false;
                break;
            }
        }
        if (result) {
            fn && fn();
        }
    }
}

export {TObject, TObjectList};