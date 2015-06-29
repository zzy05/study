(function (global, undefined) {
    if (global.$http) {
        return;
    }
    global.$http = {};
    var http = global.$http;
    var isType = function (type) {
        return function (obj) {
            return Object.prototype.toString.call(obj) == '[object ' + type + ']';
        }
    };
    var isFunction = isType("Function");
    var isString = isType("String");
    var isNumber = isType("Number");
    var isObject = isType("Object");
    var each = (function () {
        if ([].forEach) {
            return function (arr, callback) {
                [].forEach.call(arr, callback);
            }
        } else {
            return function (arr, callback) {
                for (var i = 0; i < arr.length; i++) {
                    callback.call(arr, arr[i], i, arr);
                }
            }
        }
    })();
    var getXHR = function () {
        var list = [function () {
            return new XMLHttpRequest();
        }, function () {
            return new ActiveXObject('Microsoft.XMLHTTP');
        }, function () {
            return new ActiveXObject('MsXML2.XMLHTTP');
        }, function () {
            return new ActiveXObject('MsXML3.XMLHTTP');
        }], val = null, i = 0;
        for (; i < list.length; i++) {
            try {
                val = list[i]();
            } catch (e) {
                continue;
            }
            break;
        }
        if (!val) {
            throw new ReferenceError('not supported');
        }
        getXHR = list[i];
        return val;
    };
    var hasSearch = function (str) {
        if (!isString(str)) throw new TypeError("str must be a string");
        return /^.+?\?[^?]*$/.test(str);
    };
    http.ajax = function (options) {
        if (!isObject(options))
            return;
        var _defaultOptions = {
            url: "",//服务器地址
            type: "",//http method
            isAsync: true,//是不是异步
            beforeSend: function () {
            },//在发送之前执行
            cache: false,//是否缓存
            complete: function () {
            },//在完成之后执行
            contentType: "application/x-www-form-urlencoded",//ajax MIME类型
            context: null,//上下文对象
            data: null,//发送给服务器的数据
            dataType: "text",//服务器返回的数据类型
            error: function () {
            },//错误函数
            headers: {},//自定义头信息
            mimeType: "",//重写的mime类型
            username: undefined,//服务器认证账号
            password: undefined,//服务器认证密码
            statusCode: {},//对应状态码执行的函数
            success: function () {
            },//成功时执行的函数
            timeout: undefined,//超时毫秒数
            setXhrFields: function () {
            }//设置xhr对象
        }, tempVal;

        for (tempVal in _defaultOptions) {
            //window.isPrototypeOf()
            if (options.hasOwnProperty(tempVal) && options[tempVal]) {
                _defaultOptions[tempVal] = options[tempVal];
            }
        }

        var xhr = getXHR();//1、第一步，得到ajax对象实例
        if (!/^(get|post|delete|head|put)$/img.test(_defaultOptions.type)) {
            throw new TypeError('类型错了');
        }
        if (!/^(text|json|xml|script|html|arraybuffer|blob)$/img.test(_defaultOptions.dataType)) {
            throw new TypeError('接收类型错了');
        }
        if (!isString(_defaultOptions.url)) {
            throw new TypeError("url必须是个string类型");
        }
        if (!_defaultOptions.cache) {
            //baidu.com?v=123&_=12341234
            _defaultOptions.url += (hasSearch(_defaultOptions.url) ? "_=" : "?_=") + (Math.random() * (1 << 24) | 0);
        }
//string {a:1,b:2} a=1&b=2
        if (_defaultOptions.data) {
            if (isObject(_defaultOptions.data)) {
                var arr = [];
                for (tempVal in _defaultOptions.data) {
                    if (_defaultOptions.data.hasOwnProperty(tempVal)) {
                        arr.push(encodeURIComponent(tempVal) + "=" + encodeURIComponent(_defaultOptions.data[tempVal]));
                    }
                }
                _defaultOptions.data = arr.join("&");
            }
        }
        //判断是不是和get方法一样，把传送给服务器的数据拼接到url后面
        if (/^(get|head|delete)$/img.test(_defaultOptions.type)) {
            _defaultOptions.url += (hasSearch(_defaultOptions.url) ? "" : "?") + _defaultOptions.data;
            delete _defaultOptions.data;
        }

        xhr.open(_defaultOptions.type, _defaultOptions.url, _defaultOptions.isAsync, _defaultOptions.username, _defaultOptions.password);//2、调用open方法
        //自定义头信息
        for (tempVal in _defaultOptions.headers) {
            if (_defaultOptions.headers.hasOwnProperty(tempVal)) {
                //ajax对象的方法，必须在open方法调用之后调用
                xhr.setRequestHeader(tempVal, _defaultOptions.headers[tempVal]);
            }
        }

        xhr.setRequestHeader("Content-Type", _defaultOptions.contentType);
//绑定上下文对象
        if (_defaultOptions.context) {
            _defaultOptions.success = _defaultOptions.success.bind(_defaultOptions.context);
            _defaultOptions.complete = _defaultOptions.complete.bind(_defaultOptions.context);
            _defaultOptions.error = _defaultOptions.error.bind(_defaultOptions.context);
        }

        //response有兼容性，返回响应主体
        ("response" in xhr) && (xhr.responseType = _defaultOptions.dataType);

        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (_defaultOptions.mimeType) {
                    //javascript/json -> text/plain
                    xhr.overrideMimeType(_defaultOptions.mimeType);
                }
                if (/^2\d{2}$/.test(this.status)) {
                    var returnVal;
                    if (this.responseType) {
                        returnVal = this.response;
                    } else {
                        switch (_defaultOptions.dataType.toLowerCase()){
                            case 'xml':
                                returnVal = xhr.responseXML;
                                break;
                            case 'html':
                                var frag = document.createDocumentFragment();
                                frag.innerHTML = xhr.responseText;
                                returnVal = frag;
                                break;
                            case 'script':
                                var scr = document.createElement('script');
                                scr.innerHTML = xhr.responseText;
                                returnVal = scr;
                                break;
                            case 'json':
                                if (global.JSON.parse) {
                                    try {
                                        returnVal = JSON.parse(xhr.responseText);
                                    } catch (e) {
                                        _defaultOptions.error(e);
                                    }
                                } else {
                                    returnVal = eval('(' + xhr.responseText + ')');
                                }
                                break;
                            default :
                                returnVal = xhr.responseText;
                        }
                    }
                    _defaultOptions.success(returnVal);
                }
                if (/^(4|5)\d{2}$/.test(this.status)) {
                    _defaultOptions.error();
                }
            }
        };//3、处理逻辑
        xhr.send(_defaultOptions.data);
        xhr.onerror = _defaultOptions.error;
        if(isNumber(_defaultOptions.timeout)&&_defaultOptions.timeout>500){
            if('ontimeout' in xhr){
                xhr.timeout=_defaultOptions.timeout;
                xhr.ontimeout=_defaultOptions.error;
            }else{
                setTimeout(function(){
                    if(xhr.readyState!=4){
                        xhr.abort();
                        _defaultOptions.error();
                    }
                },_defaultOptions.timeout)
            }
        }
    }
})(window);