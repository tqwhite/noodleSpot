"use strict";

var fs = require("fs");
var fileName = "tmp.txt";

var program = require('commander');

program
  .version('tqTEst')
  .option('-p, --program', 'show commander object program')
  .option('-a, --argv', 'show argv')
  .parse(process.argv);

var operateOnFile=function(exists) {
  if (exists) {
    fs.stat(fileName, function(error, stats) {
      fs.open(fileName, "r", function(error, fd) {
        var buffer = new Buffer(stats.size);
 
        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
          var data = buffer.toString("utf8", 0, buffer.length);
 
          console.log('=========\n'+data+'\n=========');
          fs.close(fd);
        });
      });
    });
  }
}

if (program.program){
console.log("program=========");
console.dir(program);
}
if (program.argv){
console.log("argv=========");
console.dir(process.argv);
}

fs.exists(fileName, operateOnFile);