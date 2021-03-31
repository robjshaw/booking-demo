exports.handler = function(context, event, callback) {

    var response = {};

    response.say = 'confirmed you are all booked in.';

    console.log(Array.isArray(event.options));
    /*
    event.options.forEach(function (arrayItem) {
        console.log(arrayItem.timing);
    });
    */

    console.log(event);

    callback(null, response);

}