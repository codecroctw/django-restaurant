import gulp from 'gulp';
import yargs from 'yargs';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import sourceMaps from 'gulp-sourcemaps';
import browserSync from 'browser-sync';
const sass = require('gulp-sass')(require('sass'));

const PRODUCTION = yargs.argv.prod;

const server = browserSync.create();

const paths = {
  styles: {
    src: ['src/scss/bundle.scss'],
    dest: ['dist/css'],
  },
  normalizeCss: {
    src: ['./node_modules/normalize.css/**/*.css'],
    dest: ['dist/css/normalize.css'],
  },
  materializeCss: {
    src: ['./node_modules/materialize-css/**/*.min.css'],
    dest: ['dist/css/materialize-css'],
  },
};

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

const importNormalize = () =>
  gulp.src(paths.normalizeCss.src).pipe(gulp.dest(paths.normalizeCss.dest));

const importMaterialize = () =>
  gulp.src(paths.materializeCss.src).pipe(gulp.dest(paths.materializeCss.dest));

export const styles = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(gulpIf(!PRODUCTION, sourceMaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(PRODUCTION, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpIf(!PRODUCTION, sourceMaps.write()))
    .pipe(gulp.dest(paths.styles.dest));
};

export const watch = () => {
  gulp.watch('src/scss/**/*.scss', gulp.series(styles, reload));
};

export const dev = gulp.series(
  clean,
  gulp.parallel([importNormalize, importMaterialize, styles]),
  serve,
  watch
);
