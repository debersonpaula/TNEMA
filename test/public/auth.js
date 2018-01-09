'use strict';
/*---------------------------------------------------*/
function SetAjaxHandler(ajax, cb){
    ajax.done(function(data){
        cb && cb(data);
    });
    ajax.fail(function(data){
        cb && cb(data.responseJSON);
    });
}
/*---------------------------------------------------*/
function GetTNEMAContent(method, url, cb){
    var sendAjax = $.ajax({
        type : method,
        url  : url,
    });
    SetAjaxHandler(sendAjax, cb);
}
/*---------------------------------------------------*/
function SetTNEMAContent(method, url, sendData, cb){
    var sendAjax = $.ajax({
        type : method,
        url  : url,
        data : sendData,
        dataType : 'json',
        encode : true
    });
    SetAjaxHandler(sendAjax, cb);
}
/*---------------------------------------------------*/
function CheckSession(elementID){
    var panel = $(elementID);
    GetTNEMAContent('GET','/user',function(res){
        if (res.status == 200) {
            panel.html('Hello ' + res.messages[0].username + ' | <button id="logout">Logout</button>');
            $('#logout').click(function(){
                $.ajax({type:'GET', url:'/user/logout'}).done(function(data){
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
        SetTNEMAContent('POST','/user',formData,function(res){
            if (res.status == 200) {
                window.location.replace('/');
            } else {
                $('#registermsg').html(res.messages.toString());
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
        SetTNEMAContent('POST','/user/login',formData,function(res){
            if (res.status == 200) {
                window.location.replace('/');
            } else {
                $('#loginmsg').html(res.messages.toString());
            }
        });
        event.preventDefault();
    });
}
/*---------------------------------------------------*/