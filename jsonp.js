window.JSONP=function(url,callbackName,callback){
    var cbnum='cb'+JSONP.count++; //cb1
    var cbname='JSONP.'+cbnum; //JSONP.cb1
    if(url.indexOf("?")==-1){
        url+='?'+callbackName+'='+cbname;
    }else{
        url+='&'+callbackName+'='+cbname; //url?method=JSONP.cb1
    }
    JSONP[cbnum]=function(data){
        try{
            callback(data);
        }finally{
            delete JSONP[cbnum];
            script.parentNode.removeChild(script);
        }
    };
    var script=document.createElement('script');
    script.src=url;
    document.body.appendChild(script);
};
JSONP.count=0;