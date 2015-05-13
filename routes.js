var main = require('./js/handlers/main.js');


module.exports = function (app) {
    app.get('/', main.home);
    app.post('/trains', main.getTrains);
    app.post('/pnr', main.getTrains);
    app.post('/route', main.getTrains);
    app.post('/live', main.getTrains);
    app.post('/seats', main.getTrains);
   /* app.get('/about', main.about);
    app.get('/thank-you', main.thankYou);
    app.get('/newsletter', main.newsletter);
    app.post('/newsletter', main.newsletterProcessPost);*/

};