import { src, dest, watch, series, parallel } from 'gulp';


import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
// import imagemin from 'gulp-imagemin';
import del from 'del';
import named from 'vinyl-named';
import webpack from 'webpack-stream';
import stripdebug from 'gulp-strip-debug';
import terser from 'gulp-terser-js';
import wpPot from "gulp-wp-pot";
import browserSync from "browser-sync";
import concat from "gulp-concat";
import gutil from "gulp-util";
// import deporder from "gulp-deporder";
// import uglify from "gulp-uglify";
// const rename = require('gulp-rename');
// const path = require('path');

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
    return src('./src/fonts/*')
        .pipe(dest('dist/fonts'));
}

export const cssFontIcon = () => {
    return src('./src/sass/bootstrap-icon.scss')
        .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
        .pipe(sass())
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('./dist/css'))


        .pipe(sass({
            outputStyle: 'compressed',
            // imagePath       : images.build,
            precision: 3,
            errLogToConsole: true
        }))

        .pipe(concat('bootstrap-icon.min.css'))
        .pipe(gulpif(PRODUCTION, postcss([autoprefixer])))
        .pipe(gulpif(PRODUCTION, cleanCss({compatibility: 'ie8'})))
        .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
        .pipe(dest('./dist/css'))

        .pipe(gutil.noop())
        .pipe(server.stream());
}

export const CssDocs = () => {
    return src(['./src/sass/bootstrap.scss','./src/sass/docs.scss'])
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
export const CopyDist = () => {
    return src('./dist/**/*')
        .pipe(dest('./docs/dist'));
}
export const JsDocs = () =>{
    return src('./src/js/docs.js')
        .pipe(named())
        .pipe(webpack({
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets:  []
                            }
                        }
                    }
                ]
            },
            mode: PRODUCTION ? 'production' : 'development',
            devtool: !PRODUCTION ? 'inline-source-map' : false,
            output: {
                filename: '[name].js'
            },
            externals: {
                jquery: 'jQuery'
            },
        }))
        .pipe(terser())
        .pipe(gulpif(PRODUCTION, stripdebug()))

        .pipe(dest('./dist/js'));
}



export const watchForChanges = () => {
    watch('src/sass/bootstrap-icon.scss', cssFontIcon);
    watch('src/sass/docs.scss', CssDocs);
    watch('src/js/*.js', JsDocs);
    watch('src/fonts/*.{eot,svg,ttf,woff,woff2}', series(FontCopy, reload));
    watch("**/*.html", reload);
}

export const dev = series(clean, series(cssFontIcon,CssDocs,FontCopy,JsDocs),serve, watchForChanges,CopyDist);
export const build = series(clean, parallel(cssFontIcon,CssDocs,FontCopy,JsDocs),CopyDist);
export default dev;
