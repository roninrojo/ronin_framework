'use strict';




/*--------------------------------------------------------*\
	 REQUERIMENTS
\*--------------------------------------------------------*/

/**
 * npm packages
 */


var gulp = require('gulp');
var purgecss = require('gulp-purgecss');
var del = require('del');
var cache = require('gulp-cache');
var runSequence = require('run-sequence');
var prompt = require('gulp-prompt');
var gutil = require('gulp-util');
var merge = require('merge-stream');
// var vinylPaths = require('vinyl-paths');

// Frontend
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');


// nunjuks
var nunjucksRender = require('gulp-nunjucks-render');

// Manipulación de datos
// var rename = require('gulp-rename');
var data = require('gulp-data');
var jsonSass = require('gulp-json-sass');
// var jsoncombine = require("gulp-jsoncombine");
var concat = require('gulp-concat');
var jsonInjector = require('gulp-json-injector');





/*--------------------------------------------------------*\
	 CONFIGURATION
\*--------------------------------------------------------*/

/**
 * Idiiomas
 */

var idioma = 'es';
var idiomas = {
	es : "./src/json/lang_es.json",
	cat : "./src/json/lang_cat.json",
	en : "./src/json/lang_en.json"
}


 /**
 * Paths
 */

var src = {
	base : "./src",
	base_css : "./src/assets/css",
	base_js : "./src/assets/js",
	base_sass : "./src/assets/sass",

	css : "./src/assets/css/**/*.css",
	html : "./src/*.html",
	img : "./src/assets/img/**/*.+(jpg|png|svg)",
	js : "./src/assets/js/**/*.js",
	pages : "./src/pages/**/*.+(html|njk)",
	sass : "./src/assets/sass/**/*.scss",
	fonts : "./src/assets/fonts/*",

	// Rutas imagenes para inyección en .njk
	json_img : "./src/json/urls-img.json",

	// Rutas absolutas para inyección en .njk
	json_urls_dev : "./src/json/urls-dev.json",
	json_urls_test : "./src/json/urls-test.json",
	json_urls_prod : "./src/json/urls-prod.json",

	// Rutas de Imagenes para css
	css_img_urls : "./src/json/url-img-css.json",

	// Rutas absolutas para css
	css_urls_dev : "./src/json/url-css-dev.json",
	css_urls_test : "./src/json/url-css-test.json",
	css_urls_prod : "./src/json/url-css-prod.json"
};

// Ruta de destino, se crea dinámicamente en la task 'nombre_landing'

var dist = {
	base : "./dist/" ,
	css : "./dist/assets/css",
	js : "./dist/assets/js",
	img : "./dist/assets/img",
	fonts : "./dist/assets/fonts"
}


/*--------------------------------------------------------*\
	 DEV TASKS
\*--------------------------------------------------------*/



// Browser Sync con live-reload
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			 baseDir: src.base
		}
	});
});

// Reload de browser sync (para simplificar código)
gulp.task('reload', function () {
	browserSync.reload();
});

// Procesamos los datos del archivo JSON y la importamos como variables SASS
gulp.task('sass-json-vars:dev', function(){
	return gulp.src([src.css_urls_dev, src.css_img_urls, src.base_sass + '/modules/variables/_variables-paths.scss'])
	.pipe(jsonSass({
	  sass: false
	}))
	.pipe(concat('_variables-all-paths.scss'))
	.pipe(gulp.dest(src.base_sass + '/modules/variables/'));
});

// Procesamos los estilos
gulp.task('sass:dev', ['sass-json-vars:dev'], function(){
	return gulp.src([src.sass])
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(src.base_css))
});


// Procesamos Nunjucks
gulp.task('njk:dev', function() {
	// Gets .html and .nunjucks files in pages
	return gulp.src(src.pages)
	// Cargando las urls dev
	.pipe(data(function() {
		return require(src.json_urls_dev)
	}))
	// Cargando las urls imagenes dev
	.pipe(data(function() {
		return require(src.json_img)
	}))
	// Cargamos el idioma elegido
	.pipe(data(function() {
		return require(idiomas[idioma])
	}))
	// Renders template with nunjucks
	.pipe(nunjucksRender({
		path: ['src/templates/','src/templates/partials', 'src/templates/include']
	}))
	// output files in app folder
	.pipe(gulp.dest('./src'))
});

gulp.task('watch', function() {
	// watch CSS
	gulp.watch(src.sass, function(){
		runSequence('sass:dev','reload')
	});
	gulp.watch('./src/*.html', function(){
		runSequence('sass:dev','reload')
	});
	// watch Pages
	gulp.watch([src.pages], function(){
		runSequence('njk:dev','reload')
	});
	// watch Templates
	gulp.watch('./src/templates/**/*.njk', function(){
		runSequence('njk:dev','reload')
	});
	// watch JS
	gulp.watch(src.js, ['js','reload']);
	// watch JSON
	gulp.watch('src/json/*.json', function() {
		runSequence(['sass-json-vars:dev','njk:dev'],'reload')
	});
});




/*--------------------------------------------------------*\
	 TEST TASKS
\*--------------------------------------------------------*/

/**
 * Tasks pensadas para optimizar y procesar el build final
 */

 // Procesamos Nunjucks
gulp.task('njk:test', function() {
	// Gets .html and .nunjucks files in pages
	return gulp.src(src.pages)
	// Cargando las urls dev
	.pipe(data(function() {
		return require(src.json_urls_test)
	}))
	// Cargando las urls imagenes dev
	.pipe(data(function() {
		return require(src.json_img)
	}))
	// Cargamos el idioma elegido
	.pipe(data(function() {
		return require(idiomas[idioma])
	}))

	// Renders template with nunjucks
	.pipe(nunjucksRender({
		path: ['src/templates/','src/templates/partials', 'src/templates/include']
	}))
	// output files in app folder
	.pipe(gulp.dest(src.base))
});

// Procesamos los datos del archivo JSON y la importamos como variables SASS
gulp.task('sass-json-vars:test', function(){
	return gulp.src([src.css_urls_test,src.css_img_urls,src.base_sass + '/modules/variables/_variables-paths.scss'])
	.pipe(jsonSass({
	  sass: false
	}))
	.pipe(concat('_variables-all-paths.scss'))
	.pipe(gulp.dest(src.base_sass + '/modules/variables/'));
});

// Procesamos los estilos
gulp.task('sass:test', ['sass-json-vars:test'], function(){
	return gulp.src([src.sass])
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(src.base_css))
});





/*--------------------------------------------------------*\
	 PROD TASKS
\*--------------------------------------------------------*/

/**
 * Tasks pensadas para optimizar y procesar el build final
 */

 // Procesamos Nunjucks
gulp.task('njk:prod', function() {
	// Gets .html and .nunjucks files in pages
	return gulp.src(src.pages)
	// Cargando las urls dev
	.pipe(data(function() {
		return require(src.json_urls_prod)
	}))
	// Cargando las urls imagenes dev
	.pipe(data(function() {
		return require(src.json_img)
	}))
	// Cargamos el idioma elegido
	.pipe(data(function() {
		return require(idiomas[idioma])
	}))


	// Renders template with nunjucks
	.pipe(nunjucksRender({
		path: ['src/templates/','src/templates/partials', 'src/templates/include', '!src/pages/test.njk', '!src/pages/example.njk']
	}))
	// output files in app folder
	.pipe(gulp.dest(src.base))
});

// Procesamos los datos del archivo JSON y la importamos como variables SASS
gulp.task('sass-json-vars:prod', function(){
	return gulp.src([src.css_urls_prod,src.css_img_urls,src.base_sass + '/modules/variables/_variables-paths.scss'])
	.pipe(jsonSass({
	  sass: false
	}))
	.pipe(concat('_variables-all-paths.scss'))
	.pipe(gulp.dest(src.base_sass + '/modules/variables/'));
});

// Procesamos los estilos
gulp.task('sass:prod', ['sass-json-vars:prod'], function(){
	return gulp.src([src.sass])
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(src.base_css))
});





/*--------------------------------------------------------*\
     TO DO'S
\*--------------------------------------------------------*/

/**
 * Iplementaciones futuras:

 - Commit de los cambios github
 - Subir a producción ssh/ftp
 - Deploy rsync

 */







/*--------------------------------------------------------*\
	 IDIOMAA
\*--------------------------------------------------------*/

/**
 * Selección de idioma mediante checkbox en un prompt del terminal
 * Seleccionamos el idioma mediante notación de corchetes
 */


// Selector de idioma
gulp.task('idioma', function() {

	var idiomas = ['es','cat','en'];

	return gulp.src('./gulpfile.js')
		.pipe(prompt.prompt({
		type: 'checkbox',
		name: 'idioma',
		message: '¿Qué idioma usamos para desarrollo?',
		choices: idiomas
	}, function(res){
		idioma = res.idioma;
		gutil.log('Idioma elegido: ' + gutil.colors.green(idioma));
	}));
});


// testeo
// gulp.task('nombre', function() {
// 	gutil.log('Nombre de dist.base: ' + gutil.colors.green(dist.base) + '\n' + 'Nombre carpeta: ' + landing_name);
// });



/*--------------------------------------------------------*\
	 OPTIMIZACION
\*--------------------------------------------------------*/

/**
 * Optimización y organización de recursos
 */

// limpiar directorio del build para dev/test/prod
gulp.task('clean:dist', function() {
  return del.sync(dist.base);
});


// Mover los recursos a sus carpetas
 gulp.task('move_assets', function(){
	return merge(
		gulp.src(src.css)
			.pipe(gulp.dest(dist.css)),
		gulp.src(src.js)
			.pipe(gulp.dest(dist.js)),
		gulp.src([src.fonts, '!./src/assets/fonts/selection.json'])
			.pipe(gulp.dest(dist.fonts)),
		gulp.src([src.html,'!./src/index.html','!./src/test.html','!./src/example.html',,'!./src/readme.html'])
			.pipe(gulp.dest(dist.base)),
		gulp.src(src.img)
			.pipe(gulp.dest(dist.img))
	);
});

// Limpiar CSS
gulp.task('purgecss', () => {
	return gulp
	.src([dist.css + '/*.css'])
	.pipe(
	  purgecss({
		content: [dist.base + '/*.html']
	  })
	)
	.pipe(gulp.dest(dist.css));
})

// Minificar CSS
gulp.task('minifyCSS', function() {
	return gulp.src([src.css])
		.pipe(cssnano())
		.pipe(gulp.dest(dist.css))
});

// Minificar HTML
gulp.task('minifyHTML', function() {
  return gulp.src(dist.base + '/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(dist.base));
});

// Optimización de imagenes para prod
gulp.task('images', function(){
	gulp.src(dist.img + '/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest(dist.img));
});

// Concat de los js
gulp.task('js', function () {
	return gulp.src([dist.js + '/*.js', '!' + dist.js + '/form-landing.js'])
	.pipe(concat('landing-custom.js'))
	.pipe(uglify())
	.pipe(gulp.dest(dist.js))
});

// Fuentes
gulp.task('fonts', function() {
	gulp.src([src.fonts, '!./src/assets/fonts/selection.json'])
	.pipe(gulp.dest(dist.fonts))
});





/*--------------------------------------------------------*\
	 DEFAULT TASK & OTHERS
\*--------------------------------------------------------*/

// Limipiamos la carpeta dist y copiamos todo el contenido
// del build (minificado y optimizado) en las rutas correspondientes.
// Limpiamos renders de html para dejar solo .njk

// Landing Desarrollo
gulp.task('build:dev', function () {
	runSequence(
				'idioma',
				'clean:dist',
				'sass:dev',
				'njk:dev',
				'move_assets'
	)
});

// Landing Test
gulp.task('build:test', function () {
	runSequence(
				'idioma',
				'sass:test',
				'njk:test',
				'clean:dist',
				'move_assets',
				'purgecss'
	)
});

// Landing Producción
gulp.task('build:prod', function () {
	runSequence(
				'idioma',
				'sass:prod',
				'njk:prod',
				'clean:dist',
				'move_assets',
				[
				'minifyHTML',
				'minifyCSS',
				'images',
				'js',
				'fonts'
				],
				'purgecss'
	)
});



// Default $gulp
gulp.task('default', function() {
	runSequence(
				'idioma',
				[
				'sass:dev',
				'njk:dev'
				],
				'browser-sync',
				'watch'
	)
});