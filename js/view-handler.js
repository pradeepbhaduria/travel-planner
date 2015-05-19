/*jslint nomen: true, vars:true*/
/*global console, $, Handlebars, Hogan */
var travelPlanner = {};

travelPlanner.resultTemplates = {};
travelPlanner.queryTemplates = {};


travelPlanner.TemplateHandler = (function () {
    'use strict';
    var $queryRoot = $("#query"),
        $resultRoot = $('#result'),
        postDataToServer = function (event, template) {
            console.log("Sending data to server");

            var url = $queryRoot.find('form').attr("action"),
                params = {};

            $queryRoot.find('input[name]').each(function () {
                var value = $(this).val();
                if ($(this).hasClass('typeahead')) {
                    value = this.getAttribute('data-stn');
                }
                params[$(this).attr('name')] = value;


            });
            console.log(params);
            // Send the data using post
            var posting = $.post(url, {
                params: params
            });

            // Put the results in a div
            posting.done(function (result) {
                console.log("Data Received:", result);
                var content = template(result);
                $resultRoot.empty().append(content);
            });
        };

    //Custom Template
    var initAutoComplete = function () {
        console.log("register for auto complete");
        var T = {};
        T.compile = function (template) {
            var compile = Handlebars.compile(template),
                render = {
                    render: function (ctx) {
                        return compile(ctx);
                    }
                };
            return render;
        };
        $('.typeahead').typeahead({
            name: 'Stations',
            valueKey: 'name',
            prefetch: '../js/station-source.json',

            template: [
                '<p class="stn-name">{{name}}</p>',
                '<p class="stn-code">{{code}}</p>'
            ].join(''),
            engine: T
        }).on('typeahead:selected', function (ele, datum) {
            ele.target.setAttribute("data-stn", datum.code); 
            console.log("selected ", datum.code);
        });
    };

    return {
        init: function () {
            $queryRoot.on("submit", function (event) {
                // Stop form from submitting normally
                event.preventDefault();
                console.log("action: ", $queryRoot.find('form').attr("action"));
                postDataToServer(event, travelPlanner.resultTemplates[$queryRoot.find('form').attr("action").substr(1)]);
            });

            //init for the first time
            initAutoComplete();
        },
        handleTemplate: function (target) {
            var content = travelPlanner.queryTemplates[target];
            $resultRoot.empty();
            $queryRoot.empty().append(content({}));
            initAutoComplete();
        }
    };
}());

travelPlanner.NavigationHandler = (function () {
    'use strict';
    var $root = $("#nav-sidebar"),
        handleNavigation = function (target) {
            $root.find('.active').removeClass('active');
            $root.find('#' + target).addClass('active');
            travelPlanner.TemplateHandler.handleTemplate(target);
        };

    return {
        init: function () {
            $root.on("click", function (event) {
                console.log("action: ", event.target);
                var target = $(event.target).parent().attr('id');
                handleNavigation(target);
            });
        }
    };
}());

travelPlanner.init = function () {
    'use strict';
    Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
        lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);

        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    });
    this.resultTemplates.trains = Handlebars.compile($("#trains-result-template").html());
    this.resultTemplates.pnr = Handlebars.compile($("#pnr-result-template").html());
    this.resultTemplates.route = Handlebars.compile($("#route-result-template").html());
    this.resultTemplates.live = Handlebars.compile($("#live-result-template").html());
    this.resultTemplates.seats = Handlebars.compile($("#seats-result-template").html());
    this.queryTemplates.trains = Handlebars.compile($("#trains-query-template").html());
    this.queryTemplates.pnr = Handlebars.compile($("#pnr-query-template").html());
    this.queryTemplates.route = Handlebars.compile($("#route-query-template").html());
    this.queryTemplates.live = Handlebars.compile($("#live-query-template").html());
    this.queryTemplates.seats = Handlebars.compile($("#seats-query-template").html());

    travelPlanner.TemplateHandler.init();
    travelPlanner.NavigationHandler.init();
};

$(document).ready(function () {
    'use strict';
    travelPlanner.init();

});