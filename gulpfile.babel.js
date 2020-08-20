import { src, dest, watch, series, parallel } from 'gulp';


import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import named from 'vinyl-named';
import webpack from 'webpack-stream';
import stripdebug from 'gulp-strip-debug';
import terser from 'gulp-terser-js';
import wpPot from "gulp-wp-pot";
import browserSync from "browser-sync";
import concat from "gulp-concat";
import gutil from "gulp-util";
import deporder from "gulp-deporder";
import uglify from "gulp-uglify";
const rename = require('gulp-rename');
const path = require('path');


const PRODUCTION = yargs.argv.prod;

// const webpack_config = require('./webpack.config.js');


const server = browserSync.create();
export const serve = done => {
    server.init({

    });
    done();
};
export const reload = done => {
    server.reload();
    done();
};

export const clean = () => del(['dist']);

export const FontCopy = () => {
    return src('src/fonts/*.{eot,svg,ttf,woff,woff2}')
        .pipe(dest('dist/fonts'));
}

export const cssFontIcon = () => {
    return src('./src/sass/bootstrap-icon.scss')
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'compressed',
            // imagePath       : images.build,
            precision: 3,
            errLogToConsole: true
        }))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('./dist/css'))
        .pipe(gutil.noop())
        .pipe(server.stream());
}

export const CssDocs = () => {
    return src('./src/sass/docs.scss')
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass({
            outputStyle: 'compressed',
            // imagePath       : images.build,
            precision: 3,
            errLogToConsole: true
        }))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('./dist/css'))
        .pipe(gutil.noop())
        .pipe(server.stream());
}

export const watchForChanges = () => {
    watch('src/sass/*.scss', cssFontIcon);
    watch('src/fonts/*.{eot,svg,ttf,woff,woff2}', series(FontCopy, reload));
    watch("**/*.html", reload);
}

export const dev = series(clean, series(cssFontIcon,CssDocs),serve,  watchForChanges);
export const build = series(clean, parallel(cssFontIcon,CssDocs));
export default dev;
