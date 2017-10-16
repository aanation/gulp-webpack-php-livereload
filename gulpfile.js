const gulp = require('gulp');

const sass               = require('gulp-sass'),
      sourcemaps         = require('gulp-sourcemaps'),
      cssmin             = require('gulp-minify-css'),
      prefixer           = require('gulp-autoprefixer'),
      uglify             = require('gulp-uglify'),
      imagemin           = require('gulp-imagemin'),
      pngquant           = require('imagemin-pngquant'),
      rigger             = require('gulp-rigger'),
      inject             = require('gulp-inject'),
      webpack            = require('webpack-stream'),
      webpackConfig      = require('./webpack.config'),
      replace            = require('gulp-url-replace'),
      browserSync        = require('browser-sync'),
      connectPHP         = require('gulp-connect-php');

      let reload = browserSync.reload;



const PATHS = {
    src: {
        scss: 'src/scss/main.scss', 
        js: {
            path: 'src/js/**/*.js',
            entry: 'src/js/main.js'
        }, 
        fonts: 'src/fonts/**/*.*',
        img: 'src/img/**/*.*'
    },   
    webpackPublicPath: "/assets/js",
    build: {
        css: 'assets/css', 
        js: 'assets/js', 
        fonts: 'assets/fonts',
        img: 'assets/img'
    },      
    watch: {
        php: '*',
        js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },    
}; 


/* Следующий набор задач собирает ассеты  */

/* Собираем scss */
gulp.task('sass', () => {
    return gulp.src(PATHS.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATHS.build.css))
        .pipe(reload({stream:true}));
});

/* Собираем js с помощью webpack-strem */
gulp.task('js', () => {
    return gulp.src(PATHS.src.js.entry)
        .pipe(webpack(webpackConfig(PATHS)))
        .pipe(gulp.dest(PATHS.build.js))
        .pipe(reload({stream:true}));
}); 
/* Прогрессив обработка пикч */
gulp.task('image', () => {
    return gulp.src(PATHS.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(PATHS.build.img))
        .pipe(reload({stream:true}));
});
/* Шрифты */
gulp.task('fonts', () => {
    return gulp.src(PATHS.src.fonts)
        .pipe(gulp.dest(PATHS.build.fonts))
        .pipe(reload({stream:true}));
});

gulp.task('build', ['js', 'image', 'sass', 'fonts']);

//чтение файлов php из директории и перенаправление потока в browserSync 
gulp.task('php', () => {
    return gulp.src(PATHS.watch.php)
        .pipe(reload({stream:true}));
});

const path = require('path');

gulp.task('php-server', () => {
    connectPHP.server({ 
        //router: 'index.php', //на этот файл будут отправляться все реквесты
        //ini: 'php.ini', //кастомный php ini
        base: '.',
        keepalive:true, 
        hostname: 'localhost', 
        port:8080, 
        open: false
    }, function() {
        browserSync({
            proxy:'127.0.0.1:8080'
        });
    });
});

gulp.task('custom-php-server', () => {
    browserSync({
        proxy:'127.0.0.1:3535' //myhost.ru, host:8080, etc
    });
});

gulp.task('watcher',function(){
    gulp.watch(PATHS.watch.scss, ['sass']);
    gulp.watch(PATHS.watch.js, ['js']);
    gulp.watch(PATHS.watch.img, ['image']);
    gulp.watch(PATHS.watch.fonts, ['fonts']);
    gulp.watch(PATHS.watch.php, ['php']);
});

gulp.task('with-php-connect', ['watcher', 'php-server']); //если запускать на сервере с использованием gulp-php-connect
gulp.task('with-custom-php-server', ['watcher', 'custom-php-server' ]); //запуск на кастомном сервере, LAMP, OpenServer


