var main = require('./js/handlers/main.js');


module.exports = function (app) {
    app.get('/', main.home);
    app.post('/trains', main.getTrains);
   /* app.get('/about', main.about);
    app.get('/thank-you', main.thankYou);
    app.get('/newsletter', main.newsletter);
    app.post('/newsletter', main.newsletterProcessPost);*/

};