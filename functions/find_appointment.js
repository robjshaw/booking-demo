exports.handler = function(context, event, callback) {

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLEKEY}).base(process.env.AIRTABLEBASE);

    var fuzz = require('fuzzball');

    var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

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

    response.options = [];

    base('slots').select({
        filterByFormula: `{day} = "${response.day}"`
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
            
            var tmp = {};

            tmp.timing = record.get('timing');

            response.options.push(tmp);

        });

        callback(null, response);
    });
}


// ${response.day}