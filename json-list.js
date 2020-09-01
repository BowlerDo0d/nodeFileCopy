/**
 * Run with `node json-list <path>` or
 * send to file with `node json-list <path> > output.json`
 */
var fs = require('fs'),
  path = require('path');

/**
 * Creates a JSON structure like the following:
 * {
 *   path: '.',
 *   name: '.',
 *   type: 'folder',
 *   children: [{
 *     path: './json-list.js',
 *     name: 'json-list.js',
 *     type: 'file'
 *   }]
 * }
 */
function dirTree(filename) {
  var stats = fs.lstatSync(filename),
    info = {
      path: filename,
      name: path.basename(filename)
    };

  if (stats.isDirectory()) {
    info.type = "folder";
    info.children = fs.readdirSync(filename).map(function(child) {
      return dirTree(filename + '/' + child);
    });
  } else {
    // Assuming it's a file. In real life it could be a symlink or something else!
    info.type = "file";
  }

  return info;
}

/**
 * Creates a JSON structure like the following:
 * {
 *  allFiles: {
 *    _fileCount: 3,
 *    txt: {
 *      _fileCount: 2,
 *      files: [{
 *        path: './txtFile.txt',
 *        name: 'txtFile.txt'
 *      }, {
 *        path: './sub/file.txt',
 *        name: 'file.txt'
 *      }]
 *    },
 *    jpg: {
 *      _fileCount: 1,
 *      files: [{
 *        path: './image.jpg',
 *        name: 'image.jpg'
 *      }]
 *    }
 * }
 */
function fileList(filename, ext) {
  function captureFiles(filename) {
    var stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {
      fs.readdirSync(filename).map(function(child) {
        return captureFiles(filename + '/' + child);
      });
    } else {
      // Assuming it's a file. In real life it could be a symlink or something else!
      var fileExt = path.extname(filename).replace('.', '').toLowerCase();

      if (!ext || (ext && fileExt === ext)) {
        if (!allFiles[fileExt]) {
          allFiles[fileExt] = {
            _fileCount: 0,
            files: []
          };
        }

        allFiles[fileExt].files.push({
          path: filename,
          name: path.basename(filename)
        });
        allFiles[fileExt]._fileCount += 1;

        allFiles._fileCount += 1;
      }
    }
  }

  var allFiles = {
    _fileCount: 0
  };

  captureFiles(filename);

  return allFiles;
}

function fileLocationByType(filename, ext) {
  function captureFiles(filename) {
    var stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {
      fs.readdirSync(filename).map(function(child) {
        return captureFiles(filename + '/' + child);
      });
    } else {
      // Assuming it's a file. In real life it could be a symlink or something else!
      var fileExt = path.extname(filename).replace('.', '').toLowerCase(),
        filePath = path.dirname(filename);

      if (ext && fileExt === ext) {
        if (!allFiles[filePath]) {
          allFiles[filePath] = true;
        }

        allFiles._fileCount += 1;
      }
    }
  }

  var allFiles = {
    _fileCount: 0
  };

  captureFiles(filename);

  return allFiles;
}

function distinctFileTypes(filename) {
  function captureFiles(filename) {
    var stats = fs.lstatSync(filename);

    if (stats.isDirectory()) {
      fs.readdirSync(filename).map(function(child) {
        return captureFiles(filename + '/' + child);
      });
    } else {
      // Assuming it's a file. In real life it could be a symlink or something else!
      var fileExt = path.extname(filename).replace('.', '').toLowerCase();

      if (!allFiles[fileExt]) {
        allFiles[fileExt] = {
          _fileCount: 0
        };
      }

      allFiles[fileExt]._fileCount += 1;
    }
  }

  var allFiles = {};

  captureFiles(filename);

  return allFiles;
}

if (module.parent == undefined) {
  var util = require('util');
  console.log(util.inspect(fileLocationByType(process.argv[2], process.argv[3]), false, null));
}
