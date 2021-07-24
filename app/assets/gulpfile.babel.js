import gulp from 'gulp';
import yargs from 'yargs';
import del from 'del';
import cleanCSS from 'gulp-clean-css';
import gulpIf from 'gulp-if';
import sourceMaps from 'gulp-sourcemaps';
const sass = require('gulp-sass')(require('sass'));
import packageImporter from 'node-sass-package-importer';

const PRODUCTION = yargs.argv.prod;

const paths = {
  styles: {
    src: ['src/scss/bundle.scss'],
    dest: ['dist/css'],
  },
  materializeCss: {
    src: ['./node_modules/materialize-css/**/*.min.css'],
    dest: ['dist/css/materialize-css'],
  },
  normalizeCss: {
    src: ['./node_modules/normalize.css/**/*.css'],
    dest: ['dist/css/normalize.css'],
  },
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
    .pipe(
      sass({
        includePaths: ['node_modules'],
      }).on('error', sass.logError)
    )
    .pipe(gulpIf(PRODUCTION, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulpIf(!PRODUCTION, sourceMaps.write()))
    .pipe(gulp.dest(paths.styles.dest));
};

export const watch = () => {
  gulp.watch('src/scss/**/*.scss', styles);
};

export const dev = gulp.series(
  clean,
  gulp.parallel([importNormalize, importMaterialize, styles]),
  watch
);
