//事件库：2015-4-25 珠峰培训
function on(ele,type,fn){
    type//它只是某件事的标识符，它是人为规定。比如在这里，把所有的系统事件之外的自定义事件，都以self开头
    if(/^self/.test(type)){
        if(!ele["selfEvent"+type]){
            ele["selfEvent"+type]=[];
        }
        var a= ele["selfEvent"+type];
        for(var i=0;i<a.length;i++){
            if(a[i]==fn)return;
        }
        a.push(fn);
        return ;
    }

    if(ele.attachEvent){//只是给IE的解决方案
        if(!ele["aEvent"+type]){//如果不存在这样的一个数组，则创建。这儿只运行一次。
            ele["aEvent"+type]=[];
            function tempFn(){run.call(ele)}
            ele.attachEvent("on"+type,tempFn);
        }
        var a=ele["aEvent"+type];
        for(var i=0;i<a.length;i++){
            if(a[i]==fn){//避免重复绑定
                return;
            }
        }
        a.push(fn);

    }else if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
    }
}
function run(){
    var e=window.event;
    var a=this["aEvent"+e.type];
    a=this["aTempEvent"]=a.slice(0);
    if(!e.target){
        e.target=e.srcElement;
        e.stopPropagation=function(){
            e.cancelBubble=true;
        }
        e.preventDefault=function(){
            e.returnValue=false;
        }
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+e.clientY;
    }
    if(a){
        for(var i=0;i<a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }

}
function off(ele,type,fn){
    if(/^self/.test(type)){
        var a=ele["selfEvent"+type];
        if(a){
            for(var i=0;i<a.length;i++){
                if(a[i]==fn) a[i]=null;
            }
        }
        return ;
    }
    if(ele.detachEvent){//IE
        var a=ele["aEvent"+type];
        if(a&&a.length){
            for(var i=0;i<a.length;i++){
                if(a[i]==fn){
                    a[i]=null;	//移除的时候，既要影响正本
                    ele["aTempEvent"][i]=null;//也要影响副本
                }
            }
        }
    }else if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
    }
}

function run2(type,e){
    var a=this["selfEvent"+type];
    if(a&&a.length){
        for(var i=0;i<a.length;){
            if(typeof a[i]=="function"){
                a[i].call(this,e);
                i++
            }else{
                a.splice(i,1);
            }
        }
    }
}