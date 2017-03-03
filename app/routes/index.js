module.exports = function (app) {
  app.get('/', app.auth, function(req, res){
    res.render('index', {
      title: 'Dashboard',
      user: req.user
    });
  });
}
