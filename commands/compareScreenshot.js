
exports.command = function(filename, expected, callback) {
    var self = this,
        screenshotPath = 'test/screenshots/',
        resultPath = screenshotPath + 'results/' + filename;

        console.log("i was in command .comparescreenshot");

    self.saveScreenshot(resultPath, function(response) {
        self.assert.compareScreenshot(filename, expected, function(result) {
            if (typeof callback === 'function') {
                callback.call(self, result);
            }
        });
    });

    return this; // allows the command to be chained.
};