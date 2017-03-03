var gulp = require('gulp'),
    postcss = require('gulp-postcss'),
    pug = require('gulp-pug'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    header  = require('gulp-header'),
    rename = require('gulp-rename'),
    cssnano = require('cssnano'),
    gls = require('gulp-live-server'),
    open = require('gulp-open'),
    fs = require('fs-extra'),
    nightwatch = require('gulp-nightwatch'),
    argv = require('yargs').argv,
    package = require('./package.json');

var server = gls.new('app.js');

var banner = [
  '/*!\n' +
  ' * <%= package.name %>\n' +
  ' * <%= package.title %>\n' +
  ' * <%= package.url %>\n' +
  ' * @author <%= package.author %>\n' +
  ' * @version <%= package.version %>\n' +
  ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
  ' */',
  '\n'
].join('');


gulp.task('css', function () {
  return gulp.src('app/css/style.css')
    .pipe(postcss())
    .pipe(gulp.dest('public/css'));
    // .pipe(cssnano())
    // .pipe(rename({ suffix: '.min' }))
    // .pipe(header(banner, { package : package }))
    // .pipe(gulp.dest('public/css'));
});

gulp.task('js',function(){
  gulp.src('app/scripts/scripts.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(header(banner, { package : package }))
    .pipe(gulp.dest('public/js'))
    .pipe(uglify())
    .pipe(header(banner, { package : package }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('server', function () {
    // Start the server at the beginning of the task
    server.start();
});

gulp.task('uri', function(){
  gulp.src(__filename)
  .pipe(open({uri: 'http://localhost:3000'}));
});

gulp.task('default', ['css', 'js', 'server', 'uri'], function () {
    gulp.watch("app/sass/*.scss", ['css']);
    gulp.watch("app/scripts/*.js", ['js']);

    gulp.watch("app/views/*.pug", function (file) {
      server.notify.apply(server, [file]);
    });
    gulp.watch(['app.js', 'app/routes/**/*.js', 'app/routes/*.js', 'app/controllers/*.js'], function(){
      server.start.bind(server)()
    }); //restart my server
});

//gulp  run test independently
// gulp test -t 000000
gulp.task('test', function() {
  console.log("Running Testcase for program id >> "+argv.t);
  var targetReportPath = __dirname+'/test/'+argv.t+'/'+'reports';
  fs.removeSync(targetReportPath);
  fs.ensureDirSync(targetReportPath);
  var targetJson = __dirname+'/test/'+argv.t+'/'+'nightwatch.json';
  var reporterURL = __dirname+'/test/reporter/junit.js';
  return gulp.src('')
    .pipe(nightwatch({
      configFile: targetJson,
      cliArgs: { reporter: reporterURL }
    }));
});
