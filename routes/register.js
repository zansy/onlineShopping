module.exports = function (app) {
    app.get('/register', function (req, res) {
        res.render('register');
    });

    app.post('/register', function (req, res) {
        var User = global.dbHelper.getModel('user'),
            uname = req.body.uname;

        User.findOne({name: uname}, function (error, doc) {
            if (error){
                res.send(500);
                req.session.error = 'network error!';
                console.log(error);
            }else if (doc){
                req.session.error = 'The username already exists.'
                res.send(500);
            }else {
                User.create({
                    name: uname,
                    password: req.body.upwd
                },function (error, doc) {
                    if (error){
                        res.send(500);
                        console.log(error);
                    }else {
                        req.session.error = 'Username created successfully.';
                        res.send(200);
                    }
                });
            }
        });
    });
}