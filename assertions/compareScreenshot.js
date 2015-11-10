
var resemblejs = require('node-resemble-js');
var mkdirp = require('mkdirp');
var fs = require('fs');

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

        if (!fs.existsSync(baselinePath)) {
            mkdirp(baselinePath, function (err) {
                if (err) console.error(err)
            });
        }

        if (!fs.existsSync(diffPath)) {
            mkdirp(diffPath, function (err) {
                if (err) console.error(err)
            });
        }

        // create new baseline photo if none exists
        if (!fs.existsSync(baselineImage)) {
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
            this.message = 'Screenshots Matched for ' + filename +' with a tolerance of ' + this.expected + '%';
        } else {
            this.message = 'Screenshots Match Failed for ' + filename +' with a tolerance of ' + this.expected + '%';
                // '   Screenshots at:\n' +
                // '    Baseline: ' + baselineImage + '\n' +
                // '    Result: ' + resultImage + '\n' +
                // '    Diff: ' + diffImage + '\n' +
                // '   Open ' + diffImage + ' to see how the screenshot has changed.\n' +
                // '   If the Result Screenshot is correct you can use it to update the Baseline Screenshot and re-run your test:\n' +
                // '    cp ' + resultImage + ' ' + baselineImage;
        }
        return pass;
    };
};