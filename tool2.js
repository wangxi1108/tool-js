// 根据传递的参数选择器内容，返回查找到的页面DOM元素
// 参数：
/*selector:选择器，可选以下值
	#id
	.className
	tagName
context:查找元素对象的上下文，DOM元素对象，默认为document
 */
//一般浏览器里的查找：
function $(selector,context){//前面写要查找的元素，后面为限定的查找范围
	context = context || document;
	if(selector.indexOf("#") === 0){
		return document.getElementById(selector.slice(1));
		//从第二位开始截取，就选到了除 # .的元素名称。
	}		
	if(selector.indexOf(".") === 0){
		return classJianr(selector.slice(1),context);//--把下面兼容
		//的class函数调用上来.-----	
	}
	return context.getElementsByTagName(selector);
}
//解决getElementsByClassName查找的兼容问题：---根据类名实现元素查找---
function classJianr(className,context){
	context = context || document;
	if(document.getElementsByClassName){
		return context.getElementsByClassName(className);
	}

/* 不支持使用 getElementsByClassName 
	// 保存查找到的元素的数组
	// 用遍历，挨着查找class里面的名字有无 具体要的那个名字eg:by_class_4
*/
	//----找的是具体的额名字--------！！！！
	//获得一个大元素（eg:div）里所有包含的元素
	var allTags= context.getElementsByTagName("*");
	var result = [];//是下面在一个标签里所包含的所有class名字

	for(var i=0,len = allTags.length;i<len;i++){//遍历所有元素
	
		var classXiaoName = allTags[i].className.split(" ");
		//获取所有有class=""的所有class名字
		
		for(var j=0,len0=classXiaoName.length;j<len0;j++){
			//遍历一个元素中的所有class名字，与你要查找的名字比较
			
			if(classXiaoName[j] == className){
				result.push(allTags[i]);//此为我们要找的具体元素名。
				//有多个就放在result这个数组里面。
				break;//跳出这一个标签。
			}
		}	
	}
	return result;
}

 /*函数2:返回指定element元素的CSS属性attr的属性值
		设置属性值自己未写！！！！！！！！
//这个是只查找，不含设置：
function css(element, attr) {
	return window.getComputedStyle 
			? getComputedStyle(element)[attr] 
			: element.currentStyle[attr];
			//通过css返回的值是： 100px
}
*/
/*函数2、设置和查找element的css属性attribute值(优化)*/
	/*css($("#inner"),"top","50px");//形式1--字符串
	css($("#inner"),{top:"50px",left:"100px"});//形式2--对象*/
function css(element,attr,value){
		//前2个if为位设置CSS值:
	if(typeof attr === "object"){//对象
		for(var prop in attr){
			element.style[prop] = attr[prop];//width:100px
			/*例如： element.style[top]=attr[top]
				得attr[top]里为索引值 50px*/
		}
	}else if(typeof attr === "string" && typeof value !== "undefined"){
		element.style[attr] = value;//undefined，但是有效果
	}else{//从CSS中获取值:
		return window.getComputedStyle //
			? getComputedStyle(element)[attr] //省略了window.
			: element.currentStyle[attr];//100px
	}
}
/*引用与结果：
console.log(css($("#box"),'height'));//200px
 */

/*函数3:当只有一个元素elemen的时候：获取指定元素在文档中的绝对定位，
		返回定位坐标对象。当还有coordinates坐标值时，
		表示设置element在文档中的绝对位置。
	有top 与 left 两个值*/
	function offset(element,coordinates){
		if(typeof coordinates === "undefined"){//无值为：获取element的文档坐标
			var _left = 0,_top=0;
			while(element !== null){
				_left += element.offsetLeft;
				_top += element.offsetTop;
				element = element.offsetParent;
			}
			return { //用对象的添加属性的方式来显示。
				left:_left,
				top:_top
			};
		}else if(typeof coordinates === "object"){//有值为：设置element的文档坐标
			var parent = element.offsetParent;
			var _left = 0,_top=0;
			while(parent !== null){
				_left += parent.offsetLeft;
				_top += parent.offsetTop;
				parent = parent.offsetParent;
			}

			element.style.left = coordinates.left - _left +"px"; 
			element.style.top = coordinates.top - _top + "px";
			//注意：单位 px 不能少！！
		}
	}
	/*如何引用：
		console.log(offset($("#inner"))); --获取inner在文档的位置。
		
		offset($("#inner"),{left:20，top:20}); --设置inner在文档的位置。
	*/

/*3-2、获取元素在其具有绝对定位的父级元素的位置*/
	function position(element){
		return  {
			left:element.offsetLeft,
			top:element.offsetTop
		};
	}
/*以上获得的是一个{}对象集合*/



//-----------------------还有一个全版本未写------------------
/*4、注册指定元素的事件监听的函数*/
//事件冒泡
function on(element,type,callback){
	if(element.addEventListener){//支持标准的
		// if (type.slice(0, 2) === "on")
		if(type.indexOf("on") === 0)//有on就去掉
			type = type.slice(2);
			element.addEventListener(type,callback,false);
	}else{//IE9版本以下的
		if(type.indexOf("on") !== 0)//无on就加上
			type = "on" +type;
			element.attachEvent(type,callback);
			/*	type = "on" + type;
		element.attachEvent(type, callback);*/
	}
}
/*监听事件函数的引用---on(都是些三个变量，不分on，都会出来)--
	var cc = function(){
		alert("监听封装函数");
	}
	on($("#inner"),"onclick",cc);
	on($("#outer"),"click",cc);
*/



/*解除指定元素绑定的监听事件*/
function off(element,type,callback){
	if(element.removeEventListener){
	//addEventListener的用remove移除
		if(type.indexOf("on") === 0)
			type = type.slice(2);
		element.removeEventListener(type,callback,false);
	}else{//attachEvent用detach移除
		if(type.indexOf("on") !== 0)
			type = "on" + type;
		element.detachEvent(type,callback);
	}
}
//以上引用移除函数：
//off($("#inner"),"click",cc);
/*----------------------------------------*/
/*6、保存/读取cookie信息函数：
 key: cookie名称
 value: cookie值，可选，不为 undefined 则表示设置cookie
 options: 可选，保存 cookie 时的配置参数(辅助信息)
 options = {
 	expires:7, // 失效时间，如果是数字，则表示指定天数后失效，
 	可以取数字或 Date 对象。
 	path:"/", // 路径
 	domain:"", // 域名
 	secure:true // 是否安全链接
 }
 */
function cookie(key,value,options){
	if(typeof value === "undefined"){//无value表示读取cookie的内容
		/*将所有cookie保存到数组中，每个元素的格式如：key=value*/
		var cookies = document.cookie.split("; ");
			//得:username=aaa,password=123456,
		for(var i=0,len=cookies.length;i<len;i++){
			var cookie = cookies[i].split("=");
			//得:username: "aaa",password: "123456",
			/*包含特殊情况：username = aaa=wode*/
			if(key === decodeURIComponent(cookie.shift()))
			//删除第一个元素，并返回值
				return decodeURIComponent(cookie.join("="));
			//得:aaa   特殊：aaa=wode
		}
		return null;
	}
	//保存cookie：
	var cookie = encodeURIComponent(key) + "=" +
	 encodeURIComponent(value);
 /*是否有其他辅助信息：*/
	 options = options || {};
	 if(typeof options.expires !== "undefined"){//有expires时：
	 	if(typeof options.expires === "number"){
	 		var date = new Date()
	 		date.setDate(date.getDate() + options.expires);
	 		cookie += ";expires=" + date.toUTCString();//转为标准时
	 	}else if(typeof options.expires === "object"){
	 		cookie += ";expires=" + options.expires.toUTCString();
	 	}
	 }
	 //路径：
	 if (options.path)
	 	cookie += ";path=" + options.path;
	 //域名：
	 if(options.domain)
	 	cookie += ";domain=" + options.domain;
	 //安全链接：
	 if(options.secure)
	 	cookie += ";secure";
	 document.cookie = cookie;
}

/*删除cookie*/
function removeCookie(key,options){
	options = options || {};
	//删除方法:将cookie失效的时间设置为当前时间的前某时刻
	options.expires = -1;
	cookie(key,"",options);
	//再保存一次，实现覆盖保存，就实现了删除
}

/*7、查找指定value在数组array中的下标
	value可以是对象，数字，字符串等...
*/
function inArray(value,array){
	for(var i=0,len=array.length;i<len;i++){
		if(value === array[i])
			return i;
	}
	return -1;
}

/*8、删除字符开头和结尾的空格*/
function trim(str){
	if(String.prototype.trim)
		return str.trim();// 支持使用字符串对象的 trim 方法
	var reg=/^\s+|\s+$/g;
	return str.replace(reg,"");
}

/*9、设置定时/计时器运动属性*/
/*function animate(element,options,speed){
	clearInterval(element.timer);	
	var start= {};
	//遍历options里所包含的属性传给start对象保存
	for(var attr in options){
		start[attr] = parseFloat(css(element,attr));
	}
	startTime= +new Date();
	element.timer = setInterval(function(){
		var currentTime= +new Date(),
			elapse = currentTime-startTime;
			elapse = Math.min(elapse,speed);

			for(var attr in options){
			//为每个运动属性计算当前运值：		
			var position = elapse*(start[attr]-options[attr])/speed
							+start[attr];
				element.style[attr] = position+"px";
			}
			if(elapse>=speed){
				clearInterval(element.timer);
				// console.log("tttt");
			}
	},1000/60);
}*/

/*9、-------包含透明度和链式函数的封装-------*/
	function animate(element,options,speed,fn){
		clearInterval(element.timer);
		var start={},orgion={};
		//遍历element里写了的属性：
		for(var attr in options){
			start[attr]=parseFloat(css(element,attr));
			orgion[attr]=options[attr] - start[attr];
		}
		//计时器函数：
		var startTime= +new Date();
		// +为转化为正的数字类型
		element.timer = setInterval(function(){
			var currentTime= +new Date(),
			elapse = currentTime - startTime;
			elapse = Math.min(elapse,speed);
			//遍历每个属性在运动中的值
			for(var attr in options){
				var position = elapse*orgion[attr]/speed+start[attr];
				//判断是否有透明属性，有则不要单位"px",无则要+"px"
				element.style[attr] = position+( attr === "opacity" ? "" :"px");
				if(attr === "opacity"){//兼容IE
					element.style.filter='alpha(opacity="+(position*100)+")';
				}			
			}
			if(elapse>=speed){
				clearInterval(element.timer);
				fn && fn();
				/*等同:			
				 if (fn)
					fn()*/
			}
		},1000/60);
	}
/*以上引用:
animate($("#bb"),{top:300},3000,function(){
	$("#bb").style.background="red";
		animate($("#bb"),{left:-100},3000,function(){
			});
	});*/


/*10、淡入淡出函数封装;*/
//淡入：
function fadeIn(element,speed,fn){
	element.style.display="block";
	element.style.opacity="0";
	animate(element,{opacity:1},speed,fn);
}
//淡出:
function fadeOut(element,speed,fn){
	animate(element,{opacity:0},speed,function(){
		element.style.display="none";
		fn && fn();
	});
}

/*以上引用:
fadeIn($("#img"),5000,function(){
	setTimeout(function(){
		fadeOut($("#img"),5000);
			},3000);
	});
*/


/*---11、*/
// 封装ajax操作函数
// 参数 options 为可配置项内容
// options = {
// 	type : "get|post", // 请求方式，默认为 get
// 	url : "http://xxx", // URL
// 	async : true, // 是否异步，默认为异步
// 	data : {username:""}, // 需要向服务器提交的数据
// 	dataType : "text|json", // 预期从服务器返回的数据格式
// 	headers : {"name":"value"}, // 额外设置的请求头
// 	success : function(respData){}, // 请求成功时执行的函数
// 	error : function(errMsg){}, // 请求失败时执行的函数
// 	complete : function(xhr){} // 不论成功/失败都会执行的函数
// }
function ajax(options) {
	options = options || {};
	// 判断是否有连接的URL
	var url = options.url;
	if (!url) // 如果没有连接的URL，则结束函数执行
		return;

	// 创建核心对象
	var xhr;
	if (window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	else
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	// 设置请求方式
	var method = options.type || "get";
	// 设置是否异步
	var async = (typeof options.async === "boolean") ? options.async : true;
	// 判断是否有向服务器传递参数
	var param = null; // 保存查询字符串的变量
	if (options.data) { // 有传递参数
		var array = []; // 保存键值对结构的数组
		for (var attr in options.data) {
			array.push(attr + "=" + options.data[attr]); // ["key=value", "key=value"]
		}
		param = array.join("&"); // key=value&key=value&key=value
	}
	// 如果是 get 请求，则将查询字符串连接在 URL 后
	if (method === "get" && param){
		url += "?" + param;
		param = null;
	}
	// 建立连接
	xhr.open(method, url, async);
	// post传递参数时，设置请求头 Content-Type
	if (method === "post"){
		// 设置请求头信息
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	// 其它额外设置的请求头
	if (options.headers) {
		for (var attr in options.headers) {
			xhr.setRequestHeader(attr, options.headers[attr]);
		}
	}
	// 发送请求
	xhr.send(param);
	// 处理响应
	xhr.onreadystatechange = function(){
		if (xhr.readyState === 4) {
			// 无论成功或失败都会执行的函数
			options.complete && options.complete(xhr);

			if (xhr.status === 200) { // 成功
				var data = xhr.responseText;
				// 判断配置中预期从服务器返回的数据类型
				// 如果是 json，则调用 JSON.parse() 解析
				if (options.dataType === "json")
					data = JSON.parse(data);
				// 处理响应数据逻辑
				options.success && options.success(data);
			} else { // 失败
				options.error && options.error(xhr.statusText);
			}
		}
	}
}

// 使用 Promise 对象实现ajax异步操作
function get(_url) {
	return new Promise(function(resolve, reject){
		ajax({
			url : _url,
			type : "get",
			dataType : "json",
			success : function(data){
				resolve(data);
			},
			error : function(errorMsg){
				reject(errorMsg);
			}
		});
	});
}