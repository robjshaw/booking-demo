exports.handler = function(context, event, callback) {

    var Airtable = require('airtable');
    var base = new Airtable({apiKey: process.env.AIRTABLEKEY}).base(process.env.AIRTABLEBASE);
    
    var response = {};

    response.known = false;
    response.name = "";
    response.product = "";
    response.product_type = "";

    console.log(event.From);

    base('custRecords').select({
        filterByFormula: `{phoneNumber} = "${event.From}"`
    }).eachPage(function page(records, fetchNextPage) {
        
        records.forEach(function(record) {

            response.known = true;
            response.name = record.get('firstName');
            response.product = record.get('productModelA');
            response.product_type = record.get('productTypeA');
            if (Array.isArray(record.get('slots')) == true){
                response.slots = record.get('slots')[0];
            }else{
                response.slots = 0;
            }
        });

        callback(null, response);

    });

}