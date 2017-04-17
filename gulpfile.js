// include gulp
var gulp = require('gulp');
var pgPromise = require('pg-promise');
var config = require('./bin/lib/config/database.json');
var foreach = require('gulp-flatmap');

const pgp = pgPromise({});
const db = pgp(`postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.database}`);

// include plug-ins

// JS hint task
gulp.task('copy', function() {
  gulp.src(['./**/*.json','!./bin/**/*', '!*.json', './**/*.sql', './**/*.ejs'])
    .pipe(gulp.dest('./bin'));
});

gulp.task('update-functions', function() {
  gulp.src(['./**/functions/*.sql', '!./bin/**/*'])
    .pipe(foreach(function(stream, file) {
      console.log(file.path);
      var file = new pgp.QueryFile(file.path);
      //
      db.query(file)
        .then(function() {

          console.log('added')

        })
        .catch(function(e) {
          console.log(e);
        });
      return stream;
    }));
});
