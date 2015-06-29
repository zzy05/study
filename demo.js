
//var xhr=new XMLHttpRequest;
////new ActiveXObject("ms.Excel");// -> *.dll
//var xhr=new ActiveXObject("Microsoft.XMLHTTP");
//var xhr=new ActiveXObject("MsXML2.XMLHTTP");
//var xhr=new ActiveXObject("MsXML3.XMLHTTP");

var getXHR=function(){
  var xhr=null;
    if("XMLHttpRequest" in window){
        //window.pro 直接从window里拿去这个属性
        // 'pro' in window 先看看window里有没有这个属性，有则返回true，没有false
        xhr = new XMLHttpRequest;
    }else{
        xhr=new ActiveXObject("Microsoft.XMLHTTP");
    }
    if(!xhr){
        throw new ReferenceError('this browser was not supported');//引用错误，找不到该引用
        //TypeError 类型错误  //RangeError 区间错误  //DOMError dom节点错误
    }
    return xhr;
};