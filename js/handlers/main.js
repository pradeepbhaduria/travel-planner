/*jslint nomen: true*/
/*global console, $, require, exports */

var http = require("http"),
    credentials = require('../../credentials.js');

var home = function (req, res) {
    'use strict';
    res.render('client-templates');
};

var getTrains = function (req, res) {
    'use strict';
    console.log("params: ", req.url, req.body.params);
    //==
    var handleResponse = function (response) {
        console.log("statusCode: ", response.statusCode);
        var data = '';
        response.on('data', function (d) {
            data = data + d;
        });

        response.on('end', function () {
            // console.log(JSON.parse(data));
            res.send({
                result: JSON.parse(data).result
            });
        });
    };
    var path = req.url + '/?key=' + credentials.erail.key,
        key;
    for (key in req.body.params) {
        if (req.body.params.hasOwnProperty(key)) {
            path = path + "&" + key + "=" + req.body.params[key];
        }
    }
    // options for GET
    var options = {
        host: 'api.erail.in', // here only the domain name
        path: path, // the rest of the url with parameters if needed
        method: 'GET' // do GET
    };
    // do the GET request
    var reqGet = http.request(options, handleResponse);

    reqGet.end();
    reqGet.on('error', function (e) {
        console.error("Error in fetching data: ",e);
    });
    //======

};

exports.home = home;
exports.getTrains = getTrains;