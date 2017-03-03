
var resemblejs = require('node-resemble-js');
var fs = require('fs-extra');
var util = require('util');

// utility function to verify folder/image existance
var isEmptySync = function (searchPath) {
  try {
    var stat = fs.statSync(searchPath);
  } catch (e) {
    return true;
  }
  if (stat.isDirectory()) {
    var items = fs.readdirSync(searchPath);
    return !items || !items.length;
  }
  var file = fs.readFileSync(searchPath);
  return !file || !file.length;
};

exports.assertion = function(filename, path, expected, msg) {
    var path = path || 'test/screenshots/';

    var baselinePath = path + '/baseline/' ,
        resultPath = path + '/results/' ,
        diffPath = path + '/diffs/' ;

    var baselineImage = baselinePath + filename,
        resultImage = resultPath + filename,
        diffImage = diffPath + filename;

    this.message = msg || 'Unexpected compareScreenshot error.';
    this.expected =  expected || 0;   // misMatchPercentage tolerance default 0%

    this.command = function(callback) {

        //creating if not exists
        fs.ensureDirSync(baselinePath);
        fs.ensureDirSync(resultPath);
        fs.ensureDirSync(diffPath);

        // create new baseline photo if none exists
        if (isEmptySync(baselineImage)) {
            console.log('WARNING: Baseline Photo does NOT exist.');
            console.log('Creating Baseline Photo from Result: ' + baselineImage);
            fs.writeFileSync(baselineImage, fs.readFileSync(resultImage));
        }

        resemblejs
            .outputSettings({
                errorColor: {
                  red: 225,
                  green: 0,
                  blue: 255
                },
                errorType: 'movement',
                transparency: 0.1,
                largeImageThreshold: 1200
              });

        resemblejs(baselineImage).compareTo(resultImage)
            //.ignoreAntialiasing()
            //.ignoreColors()
            .onComplete(callback);

        return this;
    };

    this.value = function(result) {
        result.getDiffImage().pack().pipe(fs.createWriteStream(diffImage));
        return parseFloat(result.misMatchPercentage, 10);  // value this.pass is called with
    };

    this.pass = function(value) {
        var pass = value <= this.expected;
        if (pass) {
            this.message = util.format('Screenshots Matched for <%s> with a tolerance of "%s".', filename, this.expected);
        } else {
            this.message = util.format('Screenshots Match Failed for <%s> with a tolerance of "%s".', filename, this.expected);
        }
        return pass;
    };
};
