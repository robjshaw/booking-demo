exports.handler = function(context, event, callback) {

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLEKEY}).base(process.env.AIRTABLEBASE);

    var fuzz = require('fuzzball');

    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    var response = {};

    response.day_confidence = 0;

    days.forEach(function (arrayItem) {

        var tmp = fuzz.ratio(arrayItem, event.gather);
        console.log(tmp);

        if (tmp > response.day_confidence){
            response.day_confidence = tmp;
            response.day = arrayItem
        }

    });

    callback(null, response);


}