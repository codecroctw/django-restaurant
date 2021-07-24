import gulp from 'gulp';
import yargs from 'yargs';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import sourceMaps from 'gulp-sourcemaps';
const sass = require('gulp-sass')(require('sass'));

const PRODUCTION = yargs.argv.prod;

const paths = {
  styles: {
    src: ['src/scss/bundle.scss'],
    dest: ['dist/css'],
  },
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
