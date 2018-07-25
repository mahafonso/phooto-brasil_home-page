'use strict';

var gulp				 = require('gulp'),
	$					 = require('gulp-load-plugins')(),
	del					 = require('del'),
	sassLint 			 = require('gulp-sass-lint'),
	sassPartialsImported = require('gulp-sass-partials-imported'),
	cached 				 = require('gulp-cached'),
	cssnano 			 = require('cssnano'),
	cssMqpacker			 = require('css-mqpacker'),
	browserSync 		 = require('browser-sync');
	
var paths = {
	scripts: 'src/scripts/**/*.js',
	styles: 'src/styles/*.scss',
	images: 'src/images/**/*.{png,jpeg,jpg,gif,ico}',
	fonts:  'src/fonts/*',
	extras: ['src/*.*'],
	dest: {
		scripts : 'build/js',
		styles: 'build/css',
		images: 'build/img',
		fonts: 'build/fonts',
		extras: 'build'
	}
};

gulp.task('lint', function () {
	return gulp.src(['src/scripts/app.js'])
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('scripts', ['lint'], function () {
	var file = 'app.min.js';
	
	return gulp.src(paths.scripts)
		.pipe($.plumber())
		.pipe($.newer(paths.dest.scripts + file))
		.pipe($.uglifyjs(file, {
			outSourceMap: true
			//basePath: '~/src/scripts'
		}))
		.pipe(gulp.dest(paths.dest.scripts));
});

gulp.task('sassLint', function () {
	return gulp.src(paths.styles)
		.pipe(cached('sassLinting'))
		.pipe(sassLint({
			options: {
				'config-file': '.sass-lint.yml'
			}
		}))
		.pipe(sassLint.format());
	// .pipe(sassLint.failOnError());
});

gulp.task('styles', ['sassLint'], function () {
	return gulp.src(paths.styles)
		.pipe(sassPartialsImported('src/styles/'))
		.pipe($.plumber())
		.pipe($.newer(paths.dest.styles))
		.pipe($.sass({
			outputStyle:'compressed'
		}))
		.pipe($.util.env.production ? $.postcss([
			cssnano({
				zindex: false,
				reduceIdents: false
			}),
			cssMqpacker()
		]) : $.postcss([
			cssMqpacker()
		]))
		.pipe(gulp.dest(paths.dest.styles));
});

gulp.task('images', function () {
	return gulp.src(paths.images)
		// .pipe($.plumber())
		// .pipe($.newer(paths.dest.images))
		// .pipe($.imagemin({
		// 	optimizationLevel: 5,
		// 	progressive: true,
		// 	interlaced: true
		// }))
		.pipe(gulp.dest(paths.dest.images));
});

gulp.task('fonts', function () {
	return gulp.src(paths.fonts)
		.pipe($.newer(paths.dest.fonts))
		.pipe(gulp.dest(paths.dest.fonts));
});

gulp.task('extras', function () {
	return gulp.src(paths.extras)
		.pipe($.newer(paths.dest.extras))
		.pipe(gulp.dest(paths.dest.extras));
});

gulp.task('clean', function (cb) {
	del(paths.dest.extras, cb);
});

gulp.task('server', ['watch'], function () {
	browserSync({
		files: [ 'build/**', '!build/**/*.map' ],
		server:{
			baseDir: ['build','./']
		},
		//proxy: 'onthestop',
		open: !$.util.env.no
	});
});

gulp.task('watch', ['scripts', 'styles', 'images','fonts', 'extras'], function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch('src/styles/**/*.scss', ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.fonts, ['fonts']);
	gulp.watch(paths.extras, ['extras']);
});

gulp.task('default', ['clean'], function () {
	gulp.start('server');
});