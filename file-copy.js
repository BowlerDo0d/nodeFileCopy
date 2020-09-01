/**
 * Run with `node json-list <path>` or
 * send to file with `node json-list <path> > output.json`
 */
var fs = require('fs'),
  path = require('path');

function fileList(filepath) {
  function captureFiles(filepath) {
    var stats = fs.lstatSync(filepath);

    if (stats.isDirectory()) {
      fs.readdirSync(filepath).map(function(child) {
        return captureFiles(filepath + '/' + child);
      });
    } else {
      // Assuming it's a file. In real life it could be a symlink or something else!
      var fileInfo = path.basename(filepath).split('.'),
        fileExt = fileInfo.pop(),
        fileName = fileInfo.join(),
        fileCount = 0,
        newFileFound = false;

      if (['jpg','jpeg','bmp','png','gif','avi','mpg','mpeg','wmv'].includes(fileExt.toLowerCase())) {
        while (!newFileFound && fileCount < 1000) {
          if (fileCount === 0) {
            var newFileName = fileName + '.' + fileExt;
          } else {
            var newFileName = fileName + '(' + fileCount + ').' + fileExt;
          }

          if (!allFiles[newFileName]) {
            allFiles[newFileName] = {
              data: {
                original: {
                  path: filepath,
                  name: path.basename(filepath)
                },
                newName: newFileName
              }
            };

            copyList.push({
              from: filepath,
              to: 'E:/JenFinal/' + newFileName
            });

            newFileFound = true;
          }

          fileCount += 1;
        }
      }
    }
  }

  var allFiles = {},
    copyList = [],
    errorList = [];

  captureFiles(filepath);

  copyList.forEach((file) => {
    fs.copyFile(file.from, file.to, (err) => {
      if (err) {
        // console.log(err);
        errorList.push(file.from);
      } else {
        // console.log('Copied ' + file.to);
      }
    });
  });

  // return allFiles;
  // return copyList;
  return errorList;
}

if (module.parent == undefined) {
  var util = require('util');
  console.log(util.inspect(fileList(process.argv[2]), false, null));
}
