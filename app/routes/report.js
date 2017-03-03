var glob = require("glob");
var fs = require('fs-extra');

module.exports = function (app) {
  app.post('/report/:action', app.auth, function (req, res, next) {
    var action = req.params.action;
    switch(action) {
      case 'detail':
        var result = [];
        glob(req.body.basepath+'results/*.png', function (er, files) {
          files.forEach(function(item) {
            var filename = item.split('/').pop();
            result.push({
              baseline: req.body.basepath+'baseline/'+filename,
              diffs: req.body.basepath+'diffs/'+filename,
              results: req.body.basepath+'results/'+filename
            });
          });
          res.json(result);
        });
      break;
      case 'updatebaseline':
        //copy from results to baseline
        fs.copy(req.body.basepath+'/results', req.body.basepath+'/baseline', function (err) {
          if (err) {
            res.json(err);
          } else {
            res.json('success');
          }
        });
      break;
      default:
    }
  });
}
