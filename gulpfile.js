var gulp      = require('gulp'),
  gConfig     = require('./gulp-config'),
  browserSync = require('browser-sync'),
  plugins     = require('gulp-load-plugins')({
    rename: {
      'gulp-gh-pages'    : 'deploy',
      'gulp-util'        : 'gUtil',
      'gulp-minify-css'  : 'minify',
      'gulp-autoprefixer': 'prefix'
    }
  }),
  isDist       = (plugins.gUtil.env.dist)    ? true: false,
  isDev        = (plugins.gUtil.env.dev)     ? true: false,
  isDeploy     = (plugins.gUtil.env.deploy)  ? true: false,
  sources      = gConfig.paths.sources,
  destinations = gConfig.paths.destinations;

/*
  serve; creates local static livereload server using browser-sync.
*/
gulp.task('serve', function(event) {
  browserSync(gConfig.server);
  return gulp.watch(sources.overwatch).on('change', browserSync.reload);
});



/*
  coffee:compile/coffee:watch

  watch for changes to CoffeeScript files then compile app JavaScript file
  from source, concatenating and uglifying content and publishing output based on env flag.
*/

gulp.task('coffee:compile', function(event) {
  return gulp.src(sources.coffee)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(gConfig.pkg.name + '.coffee'))
    .pipe(plugins.coffee())
    .pipe(isDeploy ? plugins.gUtil.noop(): gulp.dest(isDist ? destination.dist: destinations.js))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(isDist ? destination.dist: destinations.js));
});
gulp.task('coffee:watch', function(event) {
  gulp.watch(sources.coffee, ['coffee:compile']);
});

/*
  stylus:compile/stylus:watch

  watch for changes to stylus files then compile stylesheet from source
  auto prefixing content and generating output based on env flag.
*/
gulp.task('stylus:compile', function(event) {
  return gulp.src(sources.stylus)
    .pipe(plugins.plumber())
    .pipe(plugins.concat(gConfig.pkg.name + '.stylus'))
    .pipe(plugins.stylus())
    .pipe(isDeploy ? plugins.gUtil.noop(): gulp.dest(isDist ? destination.dist: destinations.css))
    .pipe(plugins.prefix(gConfig.prefix))
    .pipe(plugins.minify())
    .pipe(plugins.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(isDist ? destination.dist: destinations.css));
});
gulp.task('stylus:watch', function(event) {
  gulp.watch(sources.stylus, ['stylus:compile']);
});


/*
  jade:compile/jade:watch

  watch for all jade file changes then compile
  page document files.
*/
gulp.task('jade:compile', function(event) {
  return gulp.src(sources.docs)
    .pipe(plugins.plumber())
    .pipe(isDeploy ? plugins.jade({pretty: true}): plugins.jade())
    .pipe(gulp.dest(destinations.html));
});
gulp.task('jade:watch', function(event){
  gulp.watch(sources.jade, ['jade:compile']);
});

gulp.task('deploy:ghpages', ['build:complete'], function(event) {
  isDeploy = true;
  return gulp.src(sources.overwatch)
    .pipe(plugins.deploy());
});

gulp.task('build:complete', [
  'jade:compile',
  'stylus:compile',
  'coffee:compile'
]);

gulp.task('watch', [
  'jade:watch',
  'stylus:watch',
  'coffee:watch'
]);

/*DEFAULT TASK*/
var defaultTasks = isDeploy ? [
  'deploy:ghpages'
]:[
  'build:complete',
  'serve',
  'watch'
];

gulp.task('default', defaultTasks);