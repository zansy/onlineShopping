global.dbHelper = require('../common/dbHelper');
module.exports = function (app) {
    //view cart's items
    app.get('/cart', function (req, res) {
        var Cart = global.dbHelper.getModel('cart');
        if (!req.session.user){
            req.session.error = "Session has expired, please login again.";
            res.redirect('/login');
        }else{
            Cart.find({"uId":req.session.user._id, "cStatus": false}, function (error, docs) {
                res.render('cart', {carts:docs});
            });
        }
    });
    
    //add cart's item
    app.get("/addToCart/:id", function (req, res) {
        if (!req.session.user){
            req.session.error = "Session has expired, please login again.";
            res.redirect('/login');
        }else{
            var Commodity = global.dbHelper.getModel('commodity'),
                Cart = global.dbHelper.getModel('cart');
            Cart.findOne({"uId":req.session.user._id, "cId":req.params.id},function (error, doc) {
                //Goods already in existence, +1
                if (doc){
                    Cart.update({"uId":req.session.user._id, "cId":req.params.id}, {$set:{cQuantity: doc.cQuantity + 1}}, 
                        function (error, doc) {
                            if (doc > 0){
                                res.redirect('/home');
                            }
                        });
                }else {
                    Commodity.findOne({"_id": req.params.id}, function (error, doc) {
                        if (doc){
                            Cart.create({
                                uId: req.session.user._id,
                                cId: req.params.id,
                                cName: doc.name,
                                cPrice: doc.price,
                                cImgSrc: doc.imgSrc,
                                cQuality: 1
                            }, function (error, doc) {
                                if (doc){
                                    res.redirec('/home');
                                }
                            });
                        }else {

                        }
                    });
                }
            });
        }
    });

    app.get("/delFromCart/:id", function (req, res) {
        var Cart = global.dbHelper.getModel('cart');
        Cart.remove({"_id": req.params.id}, function (error, doc) {
            if (doc > 0){
                res.redirect('/cart');
            }
        });
    });

    app.post("/cart/checkout", function (req, res) {
        var Cart = global.dbHelper.getModel('cart');
        Cart.update({"_id":req.body.cid},{$set: {cQuantity: req.body.cnum, cStatus: true}}, function (error, doc) {
            if (doc > 0){
                res.send(200);
            }
        });
    });
}