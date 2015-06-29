function fn(e){
    e=e||window.event;
    //事件源
    var target= e.target|| e.srcElement;
    //阻止事件传播
    if(e.stopPropagation){
        e.stopPropagation
    }else{
        e.cancelBubble=true;
    }
    //取消默认行为
    if(e.preventDefault){
        e.preventDefault();
    }else{
        e.returnValue=false;//或者 return false;
    }
    if(e.pageX===undefined){
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
    }

    //DOM2级事件绑定的兼容性问题：方法本身
    //标准浏览器：addEventListener 增加,removeEventListener 删除
    //IE浏览器：attachEvent 增加,detachEvent 删除
    var ele=document.getElementById("div1");
    //绑定
    function bind(ele,type,fn){
        if(ele.addEventListener){
            ele.addEventListener(type,fn,false);
        }else if(ele.attachEvent){
            ele.attachEvent("on"+type,fn);
        }
    }
    //移除绑定
    function unbind(ele,type,fn){
        if(ele.removeEventListener){
            ele.removeEventListener(type,fn,false);
        }else if(ele.detachEvent){
            ele.detachEvent("on"+type,fn);
        }
    }
    //事件类型：哪些是DOM2级新增加的事件类型
    //ele.on+//基上都是DOM0级
    ele.addEventListener("DOMContentLoaded",fn,false);//IE不支持
    $(document).ready(function(e){})

    //IE的DOM2级的事件绑定方法问题：this关键字、执行的顺序问题、重复绑定的问题
    //解决this问题
    function bind(ele,type,fn){
        if(ele.addEventListener){
            ele.addEventListener(type,fn,false);
        }else if(ele.attachEvent){
            if(!ele["IE"+type+"ary"]){
                ele["IE"+type+"ary"]=[];
            }
            var a= ele["IE"+type+"ary"];
            for(var i=0;i< a.length;i++){
                if(a[i].photo==fn){
                    return;
                }
            }
            var fnTemp=function(){fn.call(ele)};
            fnTemp.photo=fn;//给经过化妆的函数加一个识别的标识
            a.push(fnTemp)
            ele.attachEvent("on"+type,fnTemp);
        }
    }
    function unbind(ele,type,fn){
        if(ele.removeEventListener){
            ele.removeEventListener(type,fn,false);
        }else if(ele.detachEvent){
            var a=ele["IE"+type+"ary"];
            //我们不但要找到这个数组，还要把这个数组中的经过化妆的方法，识别出来
            //需要识别的标识 ，在移除的时候，移除的不是fn，而是经过化妆的fn
            for(var i=0;i< a.length;i++){
                var tempFn=a[i];
                if(tempFn.photo==fn){
                    ele.detachEvent("on"+type,tempFn);
                    a[i]=null;
                    // a.splice(i,1);
                }
            }
        }
    }
}
//解决顺序问题
function on(ele,type,fn){//约定
    if(!ele["IE"+type+"ary"]){
        ele["IE"+type+"ary"]=[];
    }
    var a= ele["IE"+type+"ary"];
    for(var i=0;i< a.length;i++){
        if(a[i]==fn){//避免重复绑定
            return;
        }
    }
    a.push(fn);
    bind(ele,type,run);//run方法才是真正由系统触发的方法，而run本身负责自己组织的，那些方法按顺序执行  run方法是遍历这个方法里定义的那个数组，on里面定义数组，run里面去循环执行数组（按顺序）
}
function run(e){//负责通知  借助浏览器的事件机制来触发run方法，再由run方法统一调度保存在数组里的方法 说白了就是遍历执行事先保存在数组里的方法
    e=e||window.event;
    var type= e.type;
    var a1=this["aEvent"+ e.type];
    // var a=this["aEvent"+ e.type];
    if(!e.stopPropagation){
        e.stopPropagation= function () { e.cancelBubble=true;}
    }
    if(!e.preventDefault){
        e.preventDefault=function(){e.returnValue=false;}
    }
    if(!e.target){
        e.target= e.srcElement;
    }
    if(typeof e.pageX=="undefined"){
        e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
        e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
    }
    if(a1){
        var a=this["aEventa"]=a1.slice(0);
        for(var i=0;i< a.length;){
            var fn=a[i];
            if(typeof  fn=="function"){
                fn.call(this,e);
                i++;
            }else{
                a.splice(i,1);
                //如果把null项删除了就不必累加了
            }
        }
    }
}
function off(ele,type,fn){
    var a=ele["aEvent"+type];
    var tempA=ele["aEventa"]
    if(a){
        for(var i=0;i< a.length;i++){
            if(a[i]==fn){
                //a.splice(i,1);
                a[i]==null;
                if(tempA){
                    tempA[i]=null;
                }
            }
        }
    }
}