/*---------------------------------------------------*/

function CheckSession(elementID){

    var panel = $(elementID);

    var sendAjax = $.ajax({
        type : 'GET',
        url  : '/user',
    });

    sendAjax.done(function(data){
        console.log(data);

        if (data.code == 'LOGGED'){
            panel.html('Logged | <button id="logout">Logout</button>');
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