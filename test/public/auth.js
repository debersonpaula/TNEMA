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
            panel.html('Logged');
        } else {
            
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