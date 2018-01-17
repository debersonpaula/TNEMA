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
    var tokenid = GetToken();
    var sendAjax = $.ajax({
        type : method,
        url  : url,
        beforeSend: function(request) {
            request.setRequestHeader("tokenid", tokenid);
        }
    });
    SetAjaxHandler(sendAjax, cb);
}
/*---------------------------------------------------*/
function SetTNEMAContent(method, url, sendData, cb){
    var tokenid = GetToken();
    var sendAjax = $.ajax({
        type : method,
        url  : url,
        data : sendData,
        dataType : 'json',
        encode : true,
        beforeSend: function(request) {
            request.setRequestHeader("tokenid", tokenid);
        }
    });
    SetAjaxHandler(sendAjax, cb);
}
/*---------------------------------------------------*/
function CheckSession(elementID){
    var panel = $(elementID);
    GetTNEMAContent('GET','/user',function(res){
        if (res.status == 200) {
            panel.html('Hello ' + res.messages[0].firstname + ' ' + res.messages[0].lastname + ' | <button id="logout">Logout</button>');
            $('#logout').click(function(){
                DoLogout();
            });
        } else {
            panel.html('<a href="/register.html">Register</a> | <a href="/login.html">LogIn</a>');
        }
    });
}
/*---------------------------------------------------*/
function DoLogout(){
    GetTNEMAContent('GET','/user/logout',function(res){
        if (res.status == 200) {
            window.location.replace('/');
        } else {
            alert(res.messages.toString());
        }
    });
}
/*---------------------------------------------------*/
function DefineRegister(elementID){
    var form = $(elementID);
    form.submit(function( event ) {
        if ($('#userpass').val() === $('#userpass2').val()) {
            var formData = form.serialize();
            SetTNEMAContent('POST','/user',formData,function(res){
                if (res.status == 200) {
                    // on sucess, reload page
                    var tokenid = res.messages[0].tokenid;
                    StoreToken(tokenid);
                    window.location.replace('/');
                } else {
                    // on fail, show error
                    $('#registermsg').html(res.messages.toString());
                }
            });
        } else {
            $('#registermsg').html('Password confirmation should be exactly');
        }
        
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
                // on sucess, reload page
                var tokenid = res.messages[0].tokenid;
                StoreToken(tokenid);
                window.location.replace('/');
            } else {
                // on fail, show error
                $('#loginmsg').html(res.messages.toString());
            }
        });
        event.preventDefault();
    });
}
/*---------------------------------------------------*/
function StoreToken(tokenid) {
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem("tokenid", tokenid);
        return true;
    } else {
        alert('Your Browser does not have support for this site');
        return false;
    }
}
/*---------------------------------------------------*/
function GetToken() {
    if (typeof(Storage) !== "undefined") {
        var tokenid = localStorage.getItem("tokenid");
        return tokenid;
    } else {
        alert('Your Browser does not have support for this site');
        return '';
    }
}
/*---------------------------------------------------*/
function testAuth() {
    GetTNEMAContent('GET','/auth',function(res){
        console.log('res = ', res);
    });
}