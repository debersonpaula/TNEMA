/*---------------------------------------------------*/
function GetTNEMAContent(method, url, cbSuccess){
    var sendAjax = $.ajax({
        type : method,
        url  : url,
    });
    sendAjax.done(function(data){
        if (cbSuccess) {
            console.log(method + ' code = ' + data.code);
            console.log(data.content);
            cbSuccess(data.code, data.content);
        }
    });
}
/*---------------------------------------------------*/
function SetTNEMAContent(method, url, sendData, cbSuccess){
    var sendAjax = $.ajax({
        type : method,
        url  : url,
        data : sendData,
        dataType : 'json',
        encode : true
    });
    sendAjax.done(function(data){
        if (cbSuccess) {
            console.log(method + ' code = ' + data.code);
            console.log(data.content);
            cbSuccess(data.code, data.content);
        }
    });
}
/*---------------------------------------------------*/
function CheckSession(elementID){
    var panel = $(elementID);
    GetTNEMAContent('GET','/user',function(code,content){
        if (code == 'SESSION'){
            panel.html('Hello ' + content.username + ' | <button id="logout">Logout</button>');
            $('#logout').click(function(){
                console.log('Action = Logout');
                $.ajax({type:'GET', url:'/user/logout'}).done(function(data){
                    console.log(data);
                    window.location.replace('/');
                });
            });
        } else {
            panel.html('<a href="/register.html">Register</a> | <a href="/login.html">LogIn</a>');
        }
    });
}
/*---------------------------------------------------*/
function DefineRegister(elementID){
    var form = $(elementID);
    form.submit(function( event ) {
        var formData = form.serialize();
        SetTNEMAContent('POST','/user',formData,function(code,content){
            if (code == 'DONE'){
                window.location.replace('/');
            } else {
                $('#registermsg').html(content);
            }
        });
        event.preventDefault();
    });
}
/*---------------------------------------------------*/
function DefineFormLogin(elementID){
    var form = $(elementID);
    
    form.submit(function( event ) {
        var formData = form.serialize();

        var sendAjax = $.ajax({
            type : 'POST',
            url  : '/user/login',
            data : formData,
            dataType : 'json',
            encode : true
        });

        sendAjax.done(function(data){
            console.log(data);
            if (data.code == 'ACCEPTED'){
                window.location.replace('/');
            } else {
                $('#loginmsg').html(data.code + ': ' + data.msg);
            }
        });

        event.preventDefault();
    });
}
/*---------------------------------------------------*/