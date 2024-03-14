import gulp from 'gulp'
import plumber from 'gulp-plumber'
import gulpStylelint from 'gulp-stylelint'
import filter from 'gulp-filter'
import sassGlob from 'gulp-sass-glob'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import browsersync from 'browser-sync'

const sass = gulpSass(dartSass)

export default function styles() {
  return gulp.src('src/**/*.scss')
    .pipe(plumber())
    .pipe(gulpStylelint({
      failAfterError: false,
      reporters: [{ formatter: 'string', console: true }]
    }))
    .pipe(filter('src/styles/main.scss'))
    .pipe(sassGlob())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(rename({ dirname: 'css' }))
    .pipe(gulp.dest('build'))
    .pipe(gulp.src('src/**/*.css')) // библиотеки
    .pipe(filter('src/libs/**/*.css'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.src('src/**/*.css')) // style.css
    .pipe(filter('src/styles/style.css'))
    .pipe(rename({ dirname: 'css' }))
    .pipe(gulp.dest('build'))
    .pipe(browsersync.stream())
}
