import gulp from 'gulp';
import yargs from 'yargs';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import sourceMaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
import info from './package.json';
import webpack from 'webpack-stream';
import uglify from 'gulp-uglify';
import imageMin from 'gulp-imagemin';
import named from 'vinyl-named';

const sass = require('gulp-sass')(require('sass'));

const PRODUCTION = yargs.argv.prod;

const server = browserSync.create();

const paths = {
  styles: {
    src: ['scss/bundle.scss'],
    dest: ['dist/css'],
  },
  scripts: {
    src: ['js/bundle.js'],
    dest: 'dist/js',
  },
  images: {
    src: ['img/**/*.{jpg,jpeg,png,svg,gif}'],
    dest: 'dist/img',
  },
};

const nodePaths = Object.keys(info.dependencies).map(
  packageName => `node_modules/${packageName}{,/**}`
);

export const copyNodes = () =>
  gulp.src(nodePaths).pipe(gulp.dest('dist/node_modules'));

export const serve = done => {
  server.init({
    proxy: 'http://localhost:8000',
  });
  done();
};

export const reload = done => {
  server.reload();
  done();
};

export const clean = () => del(['dist']);

export const styles = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(gulpIf(!PRODUCTION, sourceMaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(PRODUCTION, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpIf(!PRODUCTION, sourceMaps.write()))
    .pipe(gulp.dest(paths.styles.dest));
};

export const scripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(named())
    .pipe(
      webpack({
        module: {
          rules: [
            {
              test: /\.js$/,
              use: {
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'] },
              },
            },
          ],
        },
        output: {
          filename: '[name].js',
        },
        devtool: !PRODUCTION ? 'inline-source-map' : false,
        mode: PRODUCTION ? 'production' : 'development',
      })
    )
    .pipe(gulpIf(PRODUCTION, uglify()))
    .pipe(gulp.dest(paths.scripts.dest));
};

export const images = () => {
  return gulp
    .src(paths.images.src)
    .pipe(imageMin())
    .pipe(gulp.dest(paths.images.dest));
};

export const watch = () => {
  gulp.watch('js/**/*.js', gulp.series(scripts, reload));
  gulp.watch('scss/**/*.scss', gulp.series(styles, reload));
  gulp.watch(paths.images.src, gulp.series(images, reload));
  gulp.watch('../templates/**/*', reload);
};

export const dev = gulp.series(
  clean,
  copyNodes,
  gulp.parallel([styles, images, scripts]),
  serve,
  watch
);
