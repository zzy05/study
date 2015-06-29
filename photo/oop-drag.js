function processThis(obj,fn){
    return function (e){fn.call(obj,e)};
}
function EventEmitter(){//类：事件发射器类，就是发布订阅模式的实现

}
EventEmitter.prototype.on=function(type,fn){
    if(!this[type]){
        this[type]=[];
    }
    var a=this[type];
    for(var i=0;i<a.length;i++){
        if(a[i]==fn)return;
    }
    a.push(fn);
}
EventEmitter.prototype.run=function(type,e,context){
    var a=this[type];
    if(a){
        context=context||this;
        for(var i=0;i<a.length;i++){
            if(typeof a[i]=="function")
                a[i].call(context,e);
        }
    }
};
EventEmitter.prototype.off=function(type,fn){
    var a=this[type];
    if(a){
        for(var i=0;i<a.length;i++){
            if(a[i]==fn) a[i]=null;
        }
    }
}

function Drag(ele){//构造函数，构造器，起初始化的作用
    //把被拖拽的元素保存下来，把拖拽的准备工作做好
    this.ele=ele;
    this.x=null;
    this.y=null;
    this.mx=null;
    this.my=null;
    this.DOWN=processThis(this,this.down);//目的就是为了让原型上方法里的this，无论在什么条件下运行，都会指向这个类当前的实例（就是这里的这个this）
    this.UP=processThis(this,this.up);
    this.MOVE=processThis(this,this.move);
    on(this.ele,"mousedown",this.DOWN);
}
Drag.prototype=new EventEmitter;
Drag.prototype.down=function(e){
    this.x=this.ele.offsetLeft;
    this.y=this.ele.offsetTop;
    this.mx=e.pageX;
    this.my=e.pageY;
    if(this.ele.setCapture){
        on(this.ele,"mousemove",this.MOVE);
        on(this.ele,"mouseup",this.UP);
        this.ele.setCapture()
    }else{
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);
    }
    e.preventDefault();
    this.run("dragStart",e,this.ele);
}
Drag.prototype.move=function(e){
    if(this.range){
        if(typeof this.range.r=="number"&&this.x+e.pageX-this.mx>=this.range.r){
            this.ele.style.left=this.range.r+"px";
        }else if(typeof this.range.l=="number"&&this.x+e.pageX-this.mx<=this.range.l){
            this.ele.style.left=this.range.l+"px";
        }else{
            this.ele.style.left=this.x+e.pageX-this.mx+"px";
        }
    }else{
        this.ele.style.left=this.x+e.pageX-this.mx+"px";
        this.ele.style.top=this.y+e.pageY-this.my+"px";
    }
    this.run("dragging",e,this.ele);
}
Drag.prototype.up=function(e){
    if(this.ele.releaseCapture){
        off(this.ele,"mousemove",this.MOVE);
        off(this.ele,"mouseup",this.UP);
        this.ele.releaseCapture();
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
    this.run("dragEnd",e,this.ele);
}

Drag.prototype.limited=function(range){
    //range={l:100,r:700,t:50,b:600}
    this.range=range;
}