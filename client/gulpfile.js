var source = require('vinyl-source-stream'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    watchify = require('watchify'),
    notify = require("gulp-notify");

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch, debug) {
  
    var props = {
	entries: ['./scripts/' + file],
	debug: debug,
	transform: [babelify.configure({presets: ["react"]})],
	cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
    };
  
    var bundler = watch ? watchify (browserify(props)) : browserify(props);
 
    function rebundle() {
	var stream = bundler.bundle();
	return stream.on('error', handleErrors)
	    .pipe(source(file))
	    .pipe(rename('bundle.js'))
	    .pipe(gulp.dest('./public/js/'));
    }
  
    bundler.on('update', function() {
	rebundle();
	gutil.log('Rebundle...');
    });
    
    // run it once the first time the buildScript is called
    return rebundle();
}


// run only once
gulp.task('build', function() {
    return buildScript('main.js', false, true);
});


// run build first and then watch for changes
gulp.task('default', ['build'], function() {
    return buildScript('main.js', true, true);
});
