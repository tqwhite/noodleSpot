
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Passport Demo' });
};

exports.login = function(req, res){
  res.render('login', { title: 'Passport Login' });
};