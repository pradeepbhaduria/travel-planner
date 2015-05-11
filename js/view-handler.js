/*jslint nomen: true*/
/*global console, $, Handlebars */
var travelPlanner = {};

travelPlanner.trainsViewHandler = (function () {
    'use strict';
    var $root = $("#queryCointainer"),
        trainsTemplate,
        postDataToServer = function (event) {
            console.log("Sending data to server");
            // Stop form from submitting normally
            event.preventDefault();
            var url = $root.find('form').attr("action"),
                params = {};

            $root.find('input[name]').each(function () {
                params[$(this).attr('name')] = $(this).val();
            });
            // Send the data using post
            var posting = $.post(url, {
                params: params
            });

            // Put the results in a div
            posting.done(function (result) {
                console.log("Data Received:", result);
                //var data = {data : result.data[0]};
                var source = $("#trains-template").html();
                trainsTemplate = Handlebars.compile(source);
                var content = trainsTemplate(result);
                $("#result").empty().append(content);
            });
        };

    return {
        init: function () {
            $root.on("click", "#findTrains", postDataToServer);
        }
    };
}());


$(document).ready(function () {
    travelPlanner.trainsViewHandler.init();
});