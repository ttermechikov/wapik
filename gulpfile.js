var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var chmod = require("gulp-chmod");
var uglify = require("gulp-uglify");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var del = require("del");

gulp.task("clean", function () {
  return del("build/");
});

gulp.task("copy", function () {
  return gulp
    .src(["src/fonts/**", "src/img/**", "src/js/**"], {
      base: "./src/",
    })
    .pipe(gulp.dest("build"));
});

gulp.task("html", function () {
  return gulp
    .src(["src/*.html"])
    .pipe(gulp.dest("build"))
    .pipe(server.reload({ stream: true }));
});

gulp.task("js", function () {
  return gulp
    .src(["src/js/**/*.js"])
    .pipe(plumber())
    .pipe(gulp.dest("build/js"))
    .pipe(uglify())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(server.reload({ stream: true }));
});

gulp.task("style", function () {
  return gulp
    .src("src/less/style.less")
    .pipe(plumber())
    .pipe(chmod(0o755))
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.reload({ stream: true }));
});

gulp.task("images", function () {
  return gulp
    .src("src/img/**/*.{jpg,jpeg,png,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.svgo(),
      ])
    )
    .pipe(gulp.dest("src/img"));
});

gulp.task(
  "build",
  gulp.series("clean", "images", "copy", "html", "style", "js", function (
    done
  ) {
    done();
  })
);

gulp.task("serve", function () {
  server.init({
    server: "build/",
  });

  gulp.watch("src/less/**/*.less", gulp.series("style"));
  gulp.watch("src/*.html", gulp.series("html"));
  gulp.watch("src/js/**/*.js", gulp.series("js"));
});
