/**
 * Created by brad.wu on 9/8/2015.
 */
(function () {
    $.mockjax({
        url: '/app/test',
        response: function () {
            this.responseText = 'Response from /app/test';
        }
    });

    $.ajax('/app/test').done(function (data) {
        console.log(data);
    });
    $.ajax('/app/test1').done(function (data) {
        console.log(data);
    });
}());