//跨域资源共享 利用XMLHttpRequest对象的withCredentials属性来实现
// 标准浏览器里用XMLHttpRequest ie8+ XDomainRequest
(function (global, undefined) {
    //看XMLHttpRequest有没有withCredentials这个属性
    var supportCORS = (function () {
        if (!('XMLHttpRequest' in global)) {
            return false;
        }
        var xhr = new XMLHttpRequest();
        return xhr.withCredentials !== undefined;
    })();
    var request = function () {
        //ie
        if ('XDomainRequest' in window)
            return new XDomainRequest();
        if (supportCORS)
            return new XMLHttpRequest();
    };
    //xhr就是支持跨域资源共享对象的实例
    var xhr = request();
    if (xhr) {
        xhr.withCredentials = true;
        //此属性设置为true之后，会把前端的用户凭据发送给服务器。默认为false
        xhr.open('post', 'http://localhost:3000/ajaxpost');
        xhr.onload = function () {
            console.log(this.responseText);
        };
        xhr.send('name=zhufengpeixun');
    }
})(window);
