'use strict'
var through = require('through-gulp');
var babel = require('babel-core');
module.exports = modify;
function modify(){
    var stream = through(function(file, encoding, callback){
        //如果文件为空，不做任何操作，转入下一个操作，即下一个pipe
        if(file.isNull()){
            console.log('file is null!');
            this.push(file);
            return callback();    
        }
        //插件不支持对stream直接操作，抛出异常
        if(file.isStream()){
            console.log('file is stream!');
            this.emit('error');
            return callback();    
        }
        //内容转换，处理好后，再转成Buffer形式
        var content = versionFun(file.contents.toString('utf-8'));
        file.contents = new Buffer(content, 'utf-8');
        this.push(file);
        callback();
    }, function(callback){
        console.log('处理完毕!');
        callback();
    });
    return stream;
}
function versionFun(data){
    var reg = /<script>[\s]+[\d\D]*<\/script>/g;
    var arr = data.match(reg);
    if(arr){
        var restart = /<script>/g
        var reend = /<\/script>/g
      var str =  arr[0].replace(restart, '');
      var endstr =   str.replace(reend, '');
        console.log(endstr)
    }
   // 使用babel的transform方法，可以将es6的代码转为es5的代码
   var code =  babel.transform(endstr, { presets: ['es2015'] }).code;

    return data.replace(/<script>[\s]+[\d\D]*<\/script>/g, '<script>'+code+"</script>");
}
