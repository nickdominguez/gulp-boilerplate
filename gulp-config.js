var env = 'public/',
  pkg   = require('./package.json');
module.exports = {
  pkg: {
    name: pkg.name
  },
  pluginOpts: {
    browserSync: {
      port   : 1987,
      server : {
        baseDir: env
      }
    },
    babel: {
      presets: [ 'es2015' ]
    },
    gSize: {
      showFiles: true
    },
    jade: {
      pretty: true,
      data  : {
        name       : pkg.name,
        description: pkg.description
      }
    },
    load: {
      rename: {
        'gulp-gh-pages'    : 'deploy',
        'gulp-util'        : 'gUtil',
        'gulp-cssnano'     : 'minify',
        'gulp-autoprefixer': 'prefix'
      }
    },
    prefix: [
      'last 3 versions',
      'Blackberry 10',
      'Android 3',
      'Android 4'
    ],
    rename: {
      suffix: '.min'
    },
    stylint: {
      reporter: 'stylint-stylish'
    },
    wrap: '(function() { <%= contents %> }());'
  },
  paths: {
    base: env,
    sources: {
      docs     : 'src/jade/*.jade',
      markup   : 'src/jade/**/*.jade',
      overwatch: env + '**/*.{html,js,css}',
      scripts  : 'src/js/**/*.js',
      styles   : 'src/stylus/**/*.stylus'
    },
    destinations: {
      dist: './dist',
      css : env + 'css/',
      html: env,
      js  : env + 'js/'
    }
  }
};
