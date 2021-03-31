exports.handler = function(context, event, callback) {

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLEKEY}).base(process.env.AIRTABLEBASE);

    var fuzz = require('fuzzball');

    var days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    var response = {};

    response.day_confidence = 0;

    days.forEach(function (arrayItem) {

        var tmp = fuzz.ratio(arrayItem, event.gather);
        console.log(arrayItem + '-' + tmp);

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

            if (record.get('Status') == 'available'){

                tmp.timing = record.get('timing');
                tmp.id = record.id;

                response.options.push(tmp);

                response.available = true;

                if (typeof response.times === 'undefined') {
                    response.times = tmp.timing
                }else{
                    response.times = response.times + ',' + tmp.timing;
                }
            };

        });

        response.say = "We have appointment slots in the " + response.times + " for " + response.day + ". What would work for you?";
        

        callback(null, response);
    });
}