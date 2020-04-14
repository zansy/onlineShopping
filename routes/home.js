global.dbHelper = require('../common/dbHelper');
module.exports = function (app) {
    app.get('/home', function (req, res) {
        if (req.session.user){
            var Commodity = global.dbHelper.getModel('commodity');
            Commodity.find({}, function (error, docs) {
                res.render('home',{Commodities: docs})
            });
        }else {
            req.session.error = "Please Login First.";
            res.redirect('/login');
        }
    });

    app.get('/addCommodity', function (req, res) {
        res.render('addCommodity');
    })
    app.post('/addCommodity', function (req, res) {
        var Commodity = global.dbHelper.getModel('commodity');
        Commodity.create({
            name: req.body.name,
            price: req.body.price,
            imgSrc: req.body.imgSrc
        }, function (error, doc) {
            if (doc){
                res.send(200);
            }else res.send(404);
        });
    });

}