var demo=require('demoModule2');

console.dir(demo);

var one=new demo();

console.log(one.get1());

one.set1('xxx');





var two=new demo();

console.log(two.get1());

two.set1('yyy');

console.log(two.get1());
console.log(one.get1());