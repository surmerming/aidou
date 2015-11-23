document.domain='idol001.com';
function $g(id){
	return document.getElementById(id);
}
//异步
var MiniSite=new Object();
MiniSite.Browser={
    ie:/msie/.test(window.navigator.userAgent.toLowerCase()),
    moz:/gecko/.test(window.navigator.userAgent.toLowerCase()),
    opera:/opera/.test(window.navigator.userAgent.toLowerCase()),
    safari:/safari/.test(window.navigator.userAgent.toLowerCase())
};
MiniSite.JsLoader={
    load:function(sUrl,charset,fCallback){
        var _script=document.createElement('script');
        _script.setAttribute('charset',charset);
        _script.setAttribute('type','text/javascript');
        _script.setAttribute('src',sUrl);
        document.getElementsByTagName('head')[0].appendChild(_script);
        if(MiniSite.Browser.ie){
            _script.onreadystatechange=function(){
                if(this.readyState=='loaded'||this.readyState=='complete'){
                    fCallback();
					//setTimeout(fCallback, 50);
					//setTimeout(function(){try{fCallback();}catch(e){}}, 50);
                }
            };
        }else if(MiniSite.Browser.moz){
            _script.onload=function(){
                //fCallback();
				setTimeout(fCallback, 50);
				//setTimeout(function(){try{fCallback();}catch(e){}}, 50);
            };
        }else{
            //fCallback();
			setTimeout(fCallback, 50);
			//setTimeout(function(){try{fCallback();}catch(e){}}, 50);
        }
    }
};
//通用工具
var Common_Tool=new Object();
Common_Tool.position=function(o){
	var p={Top:0,Left:0};
	while(!!o){
		p.Top+=o.offsetTop;
		p.Left+=o.offsetLeft;
		o=o.offsetParent;
	}
	return p;
}
Common_Tool.getParameter=function(name){
	try{
		var search = document.location.search;
		var pattern = new RegExp("[?&]"+name+"\=([^&]+)", "g");
		var matcher = pattern.exec(search);
		var items = null;
		if(null != matcher){
		   // items = decodeURIComponent(matcher[1]);
			items =matcher[1];
		}
		return items;
	}catch(e){
		return false;
	};
}
//cookie操作
Common_Tool.getCookie=function(a){
	return document.cookie.match(RegExp("(^"+a+"| "+a+")=([^;]*)"))==null?"":decodeURIComponent(RegExp.$2);
}
Common_Tool.setCookie=function(name,value,millisecond){
		if(arguments.length>2){
			var expireDate=new Date(new Date().getTime()+millisecond);
			document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; domain=idol001.com; expires=" + expireDate.toGMTString();
		}else{
			document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; domain=idol001.com";
		}
}
Common_Tool.delCookie=function(a){
	var b=new Date((new Date).getTime());
	document.cookie=a+"= ; path=/; domain=.idol001.com; expires="+b.toGMTString()
}

String.prototype.trim = function(){return this.replace(/(^\s*)|(\s*$)/g, "");}
String.prototype.Ltrim = function(){return this.replace(/(^\s*)/g, "");}
String.prototype.Rtrim = function(){return this.replace(/(\s*$)/g, "");} 


//用户信息
/*var User={}
User.mylogin=function(){
	window.open("https://api.weibo.com/oauth2/authorize?client_id=802835118&redirect_uri=http%3A%2F%2Fwww.fengwo.me%2Fweibo_callback.php%3Freturntype%3D1&response_type=code");
}
User.mylogout=function(){
	window.location.href="http://www.fengwo.me/logout.php";
}*/

var KK={};
KK.position=function (a){for(var b={Top:0,Left:0};a;){b.Top+=a.offsetTop;b.Left+=a.offsetLeft;a=a.offsetParent}return b}



function upLinkToText(text){
	if(text=="")
		return null;
	text=text.replace(/((https?|ftp|file):\/\/[-a-zA-Z0-9+&@#\/%?=~_|!:,.;]*)/g,"<a href=\"$1\" target=\"blank\">$1</a>");

	var re = new RegExp("@([\\u4E00-\\u9FA5A-Za-z0-9_\-]+)", "g");  
    var s = "<a href=\"http://weibo.com/n/$1\" target=\"_blank\" >@$1</a>";  
    text = text.replace(re, s); 
	
	var re2 = text.split("#")[1];  
    var re22 = new RegExp("\#([\\u4E00-\\u9FA5A-Za-z0-9_]+)\#", "");  
    var s2 = "<a href=\"http://huati.weibo.com/k/$1\" target=\"_blank\">#" + re2 + "#</a>";  
    text = text.replace(re22, s2);

	return text;
}

/**
* 新浪微博mid和id转换工具类
* @constructor 工具类  提供10进制和62进制转换
*/
function SinaWeiboUtility() {
    /**
    * 62进制字典
    * @property {String}
    */
    this.str62keys = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    if (typeof (SinaWeiboUtility._initalized) == 'undefined') {
        /**
        * 10进制值转换为62进制
        * @param {String} int10 10进制值
        * @return {String} 62进制值
        */
        SinaWeiboUtility.prototype.int10to62 = function (int10) {
            var s62 = '';
            var r = 0;
            while (int10 != 0) {
                r = int10 % 62;
                s62 = this.str62keys.charAt(r) + s62;
                int10 = Math.floor(int10 / 62);
            }
            return s62;
        };
        /**
        * 62进制值转换为10进制
        * @param {String} str62 62进制值
        * @return {String} 10进制值
        */
        SinaWeiboUtility.prototype.str62to10 = function (str62) {
            var i10 = 0;
            for (var i = 0; i < str62.length; i++) {
                var n = str62.length - i - 1;
                var s = str62.substr(i, 1);  // str62[i]; 字符串用数组方式获取，IE下不支持为“undefined”
                i10 += parseInt(this.str62keys.indexOf(s)) * Math.pow(62, n);
            }
            return i10;
        };
        /**
        * id转换为mid
        * @param {String} id 微博id，如 "201110410216293360"
        * @return {String} 微博mid，如 "wr4mOFqpbO"
        */
        SinaWeiboUtility.prototype.id2mid = function (id) {
            if (typeof (id) != 'string') {
                return false; // id数值较大，必须为字符串！
            }
            var mid = '';

            for (var i = id.length - 7; i > -7; i = i - 7) //从最后往前以7字节为一组读取mid
            {
                var offset1 = i < 0 ? 0 : i;
                var offset2 = i + 7;
                var num = id.substring(offset1, offset2);

                num = this.int10to62(num);
				if (offset1 > 0){
					while (num.length < 4) {
						num = '0' + num;
					}
				}
                mid = num + mid;
            }

            return mid;
        };
        /**
        * mid转换为id
        * @param {String} mid 微博mid，如 "wr4mOFqpbO"
        * @return {String} 微博id，如 "201110410216293360"
        */
        SinaWeiboUtility.prototype.mid2id = function (mid) {
            var id = '';

            for (var i = mid.length - 4; i > -4; i = i - 4) //从最后往前以4字节为一组读取mid字符
            {
                var offset1 = i < 0 ? 0 : i;
                var len = i < 0 ? parseInt(mid.length % 4) : 4;
                var str = mid.substr(offset1, len);

                str = this.str62to10(str).toString();
                if (offset1 > 0) //若不是第一组，则不足7位补0
                {
                    while (str.length < 7) {
                        str = '0' + str;
                    }
                }

                id = str + id;
            }
            return id;
        };

        /**
        * 标识对象是否初始化过（将方法挂在prototype上只需执行一次即可，不必要的重复的运算。）
        * @property {boolean}
        */
        SinaWeiboUtility._initalized = true;
    }
}
var SWU = new SinaWeiboUtility();

function formatWeibo($m){
	var $message={};
	$m['mmid']=SWU.id2mid($m['mid']);
	if(($m['retweeted_status'])){
		$m['retweeted_status']['mmid']=SWU.id2mid($m['retweeted_status']['mid']);
	}
	$message['mid']=$m['idstr'];
	$message['created_at']=$m['created_at'];
	$message['web']="sina";
	$message['web_cn']="新浪微博";
	//$message['month_ch']=$this->getMonth($m['created_at']);
	//$message['day']=date("d",strtotime($m['created_at']));
	$message['ori_text']=$m['text'];
	$message['text']=upLinkToText($m['text']);
	$message['time']=returnDate($m['created_at']);
	//$message['date']=date("Y-m-d",strtotime($m['created_at']));
	$message['times']=returnDate($m['created_at'],"time");
	$message['img']=$m['thumbnail_pic'];
	$message['link']="http://weibo.com/"+$m['user']['id']+"/"+$m['mmid'];
	$message['reposts_count']=$m['reposts_count'];
	$message['comments_count']=$m['comments_count'];
	$message['userinfo']={};
	$message['userinfo']['id']=$m['user']['id'];
	$message['userinfo']['screen_name']=$m['user']['screen_name'];
	$message['userinfo']['weblink']="http://weibo.com/"+$m['user']['id'];
	$message['userinfo']['profile_image_url']=$m['user']['profile_image_url'];
	if($m['retweeted_status']){
		$message['repost']={}
		$message['repost']['mid']=$m['retweeted_status']['idstr'];
		$message['repost']['created_at']=$m['retweeted_status']['created_at'];
		$message['repost']['ori_text']=$m['retweeted_status']['text'];
		$message['repost']['text']=upLinkToText($m['retweeted_status']['text']);
		$message['repost']['img']=$m['retweeted_status']['thumbnail_pic'];
		if($m['retweeted_status']['user']){
			$message['repost']['link']="http://weibo.com/"+$m['retweeted_status']['user']['id']+"/"+$m['retweeted_status']['mmid'];
			$message['repost']['time']=returnDate($m['retweeted_status']['created_at']);
			//$message['repost']['date']=date("Y-m-d",strtotime($m['retweeted_status']['created_at']));
			$message['repost']['times']=returnDate($m['retweeted_status']['created_at'],"times");
			$message['repost']['reposts_count']=$m['retweeted_status']['reposts_count'];
			$message['repost']['comments_count']=$m['retweeted_status']['comments_count'];
		}else{
			$message['repost']['link']="";
			$message['repost']['reposts_count']=-1;
			$message['repost']['comments_count']=-1;
		}
		if($m['retweeted_status']['user']){
			$message['repost']['userinfo']={};
			$message['repost']['userinfo']['id']=$m['retweeted_status']['user']['id'];
			$message['repost']['userinfo']['screen_name']=$m['retweeted_status']['user']['screen_name'];
			$message['repost']['userinfo']['weblink']="http://weibo.com/"+$m['retweeted_status']['user']['id'];
			$message['repost']['userinfo']['profile_image_url']=$m['retweeted_status']['user']['profile_image_url'];
		}
	}
	return $message;
}
//生成日期
var returnDate=function(date,type){
	if(typeof(date)=="string"){
		date=date.replace("+0800","UTC+0800");
		date=new Date(date);
	}
	
	var time="";
	if(type=="time"){
		time=(date.getHours()<10?("0"+date.getHours()):date.getHours())+":"+(date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes());
	}else if(type=="date"){
		time=((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"月"+((date.getDate())<10?("0"+(date.getDate())):(date.getDate()))+"日";
	}else{
		time=((date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"月"+((date.getDate())<10?("0"+(date.getDate())):(date.getDate()))+"日 "+(date.getHours()<10?("0"+date.getHours()):date.getHours())+":"+(date.getMinutes()<10?("0"+date.getMinutes()):date.getMinutes());
	}

	return time;
}