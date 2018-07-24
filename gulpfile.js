'use strict';

var gulp		= require('gulp'),
	$			= require('gulp-load-plugins')(),
	del			= require('del'),
	browserSync = require('browser-sync');
	
var paths = {
	scripts: 'src/scripts/**/*.js',
	styles: 'src/styles/**/*.scss',
	images: 'src/images/**/*.{png,jpeg,jpg,gif}',
	fonts:  'src/fonts/*',
	extras: ['src/*.*'],
	dest: {
		scripts : 'dist/js',
		styles: 'dist/css',
		images: 'dist/img',
		fonts: 'dist/fonts',
		extras: 'dist'
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

gulp.task('styles', function () {
	return gulp.src(paths.styles)
		.pipe($.plumber())
		.pipe($.newer({dest: paths.dest.styles + 'style.css', ext: '.css'}))
		.pipe($.rubySass({
			noCache: true,
			style:'compressed'
		}))
		.pipe($.autoprefixer('last 2 version'))
		//.pipe($.csso())
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

gulp.task('serve', ['watch'], function () {
	browserSync({
		files: [ 'dist/**', '!dist/**/*.map' ],
		server:{
			baseDir: ['dist','./']
		},
		//proxy: 'onthestop',
		open: !$.util.env.no
	});
});

gulp.task('watch', ['scripts', 'styles', 'images','fonts', 'extras'], function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.fonts, ['fonts']);
	gulp.watch(paths.extras, ['extras']);
});

gulp.task('default', ['clean'], function () {
	gulp.start('serve');
});