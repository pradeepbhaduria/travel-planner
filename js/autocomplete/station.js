/*jslint nomen: true, plusplus:true*/
/*global console, $, require, exports */

var fs = require("fs"),
    stationSource = require('./station-source.json'),
    stationHash = {},
    stationKeysSorted;


var createStationHash = (function () {
    'use strict';
    var index,
        obj;
    for (index = 0; index < stationSource.length; index++) {
        obj = stationSource[index];
        stationHash[obj.name] = obj.code;
    }
    stationKeysSorted = Object.keys(stationHash).sort();
    //console.log(stationKeysSorted);
    // console.log("Hash:", stationSource);
}());

var _getOptions = function (key) {
    'use strict';
    var i,
        str,
        returnArray = [],
        found;
    //converting input to Firstletter Capital rest small as per the data
    key = key.toLowerCase();
    key = key.charAt(0).toUpperCase() + key.slice(1);
    for (i = 0; i < stationKeysSorted.length; i++) {
        str = stationKeysSorted[i];
        if (str.indexOf(key) === 0) {
            found = true;
            returnArray.push(str + '(' + stationHash[str] + ')');
        } else if (found) {
            break;
        }
    }
    return returnArray;
};

var getOptions = function (req, res) {
    'use strict';
    console.log(req.query);
    res.send({
        result: _getOptions(req.query.key)
    });
};

exports.getOptions = getOptions;
//exports._getOptions = _getOptions;