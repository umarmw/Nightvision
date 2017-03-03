var glob = require("glob");

var rReadFile = function (filePath) {
  var URLs = new Array();
  glob(filePath, function (er, files) {
    console.log(files);
    URLs.push(files);
  });
  return URLs;
}

module.exports = rReadFile;