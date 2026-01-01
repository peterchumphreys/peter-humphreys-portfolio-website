const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const minify = require("gulp-clean-css");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");

function html() {
  console.log("HTML");
  return gulp.src("src/*.html").pipe(gulp.dest("dist"));
}

function style() {
  console.log("Style");
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(minify())
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());
}

function js() {
  console.log("JS");
  return gulp
    .src("src/js/*.js")
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(gulp.dest("dist/js"));
}

function images() {
  console.log("Images");
  return gulp
    .src("src/images/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/images"));
}

function pdf() {
  console.log("PDF");
  return gulp.src("src/pdf/**/*").pipe(gulp.dest("dist/pdf"));
}

function php() {
  console.log("PHP");
  return gulp.src("src/php/**/*").pipe(gulp.dest("dist/php"));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    online: true,
    tunnel: true,
  });
  gulp.watch("src/*.html", html).on("change", browserSync.reload);
  gulp.watch("src/scss/**/*.scss", style);
  gulp.watch("src/js/**/*.js", js).on("change", browserSync.reload);
  gulp.watch("src/pdf/**/*.pdf", pdf).on("change", browserSync.reload);
  gulp.watch("src/php/**/*.php", php).on("change", browserSync.reload);
  gulp.watch("src/images/**/*", images);
}

exports.html = html;
exports.style = style;
exports.watch = watch;

/*
    --TOP LEVEL FUNCTIONS
    gulp.task - Define tasks
    gulp.src - Point to files to use
    gulp.dest - Points to folder to output
    gulp.watch - Watch files and folders for changes
*/

//Need to include async keyword to allow task to finish properly

//Copy all HTML files
gulp.task("copyHTML", async () => {
  gulp.src("src/*.html").pipe(gulp.dest("dist"));
});

//Copy all PDF files
gulp.task("copyPDF", async () => {
  gulp.src("src/pdf/*.pdf").pipe(gulp.dest("dist/pdf"));
});

//Optimize images
gulp.task("optimizeImages", async () => {
  gulp.src("src/images/**/*").pipe(imagemin()).pipe(gulp.dest("dist/images"));
});

//Concatenate JS scripts into 1 file
gulp.task("scripts", async () => {
  gulp
    .src("src/scripts/*.js")
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(gulp.dest("dist/js"));
});

//Minify JS
gulp.task("minifyJS", async () => {
  gulp
    .src("src/js/*.js")
    .pipe(terser())
    .pipe((await gulp).dest("dist/js"));
});

//Compile SASS to minified CSS
gulp.task("compileSass", async () => {
  gulp
    .src("src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(minify())
    .pipe(gulp.dest("dist/css"));
});

function compileSass() {
  console.log("Compiling Sass");
  gulp
    .src("src/scss/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(minify())
    .pipe(gulp.dest("dist/css"));
}

//Default task
gulp.task(
  "default",
  gulp.series("copyHTML", "copyPDF", "optimizeImages", "compileSass", "scripts")
);
