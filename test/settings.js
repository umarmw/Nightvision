module.exports = {
  //List of devices
  env: function () {
    var browserWidthPadding = 31; // to fix firefox issue
    var env = [
      {device: "tablet_landscape", width: (1024+browserWidthPadding), height: "768"},
      {device: "tablet_portrait", width: (768+browserWidthPadding), height: "1024"},
      {device: "phone", width: (320+browserWidthPadding), height: "480"}
    ];
    return env;
  },
  //Shared default variables
  tolerance: function () {
    var tolerance = 0;
    return tolerance;
  }
  
}