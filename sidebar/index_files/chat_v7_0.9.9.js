var G_APP_KEY = 'e0x9wycfxj83q';

if(!(window.console && console.log)) {
  console = {
    log: function(){},
    debug: function(){},
    info: function(){},
    warn: function(){},
    error: function(){}
  };
}

Chat={}
Chat.userinfo=null;
Chat.timer=null;
Chat.pre_time=0;
Chat.translatorlist=null;
Chat.adminlist=null;
Chat.allowCommit = true;//消息不能发送太频繁
Chat.commitTimer = null;
Chat.reconnect = false;
Chat.rcCallback = null;
Chat.originUser = null;


Chat.init=function(){
	RongIMClient.init(G_APP_KEY);

	Chat.tvNotify();

	/*setInterval(function(){
		Chat.tvNotify();
	},60000);*/

	Chat.loginCheck();
	
};

Chat.loginCheck = function(){
	var userid = Common_Tool.getCookie("userid");
	if(userid){
		var chat_url = "http://fan.tv.idol001.com/callback_idol.php?callback=Chat.loginCallBack&starid=" + G_starid + (G_weibo_id?("&weibo_id=" + encodeURIComponent(G_weibo_id)) : "");
		MiniSite.JsLoader.load(chat_url,'utf-8',function(){});
	}else{
		
		
	}
}

Chat.loginCallBack=function(userinfo){
	try{
		$("#password").val("");
		if(!userinfo['error']){
			$("#logOut").html('<span>'+userinfo.nickname+'</span><a class="aUnderline" href="javascript://" onclick="Chat.loginOut()">退出</a>');
			$("#logOut").show();
			$("#sendComment").removeClass("radiusBt_disabled").addClass("radiusBt");
			$('#loginWeibo').css("visibility","hidden");
			$('#textArea').removeAttr("disabled");

			$('#textArea').val("");
			if(userinfo.translator==1){
				$('#toggleContentType').show();
				$('#toggleContentType').html('<div onclick="$(\'#sendComment\').css(\'background\-color\',\'#3dc27f\');$(this).children(\'input\').attr(\'checked\',true)"><input type="radio" name="contentType" value="translate" >翻译</div><div onclick="$(\'#sendComment\').css(\'background\-color\',\'#D64B75\');$(this).children(\'input\').attr(\'checked\',true)"><input type="radio" name="contentType" value="chat" checked> 聊天</div>');
			}else{
				$('#toggleContentType').hide();
			}
			$('#sendComment').css('background-color','#D64B75');
			Chat.userinfo = userinfo || {};
			$(".warm").hide();
			$(".aside-tip").hide();

			$("#ckplayer_a1").show();
			$(".login-tip-af15").hide();
			Chat.rcCallback();
			
		}else{
			$(".warm").show();
		}
	}catch(e){
		alert("登陆失败");
	}
}

Chat.loginOut=function(isChat){
	
	$("#logOut").hide();
	$("#sendComment").removeClass("radiusBt").addClass("radiusBt_disabled");
	$('#loginWeibo').css("visibility", "visible");
	$('#textArea').attr("disabled", true);

	$('#textArea').val("登陆后来聊天吧~");
	$('#toggleContentType').hide();
	$('#sendComment').css('background-color','#D64B75');
	$(".aside-tip").show();

	// RongIMClient.getInstance().quitChatRoom(G_CHATROOM_ID, {
 //        onSuccess: function () {
 //            Chat.addDebug("退出聊天室成功");
 //            if (RongIMClient.getInstance) {
	// 	        RongIMClient.getInstance().disconnect();
	// 		}
 //        },
 //        onError: function (errorCode) {
 //            // 此处处理连接错误。
 //            // console.log(errorCode.getValue(), errorCode.getMessage());
 //        }
 //    });

    if (!isChat) {

		Common_Tool.delCookie("PHPSESSID");
		Chat.originUser =  jQuery.extend(true, {}, Chat.userinfo);
		Chat.userinfo=null;

		try{RongIMClient.getInstance().disconnect();}catch(e){}
	}

}

Chat.showChat=function(obj){
	setTimeout(function(){
		$("#commentContent")[0].scrollTop = $("#commentContent")[0].scrollHeight;
	}, 300);
	
}

Chat.usercard=function(e){
	var html='';
	$("#userInfoDialog").find(".userItem").html(html);
	$("#userInfoDialog").show();
}

Chat.getTranslatorList=function(){
	var chat_url = "http://fan.tv.idol001.com/chat_v2.php?action=role_list&type=1&callback=Chat.translatorlist";
	MiniSite.JsLoader.load(chat_url,'utf-8',function(){
		if(Chat.translatorlist!=null){
			Chat.showTranslatorList();
		}
	});
}

Chat.showTranslatorList=function(){
	$("#dialogList_translator").html("");
	for(var i=0;i<Chat.translatorlist.list.length;i++){
		var obj = Chat.translatorlist.list[i];
		var text = '<li class="userItem"><div class="weiboAvatar"><a target="_blank" href="http://weibo.com/u/'+obj['sina_uid']+'"><img src="'+obj['img']+'"></a></div><div class="userItemTitle">'+obj['nickname']+'</div><a class="radiusBt" href="http://weibo.com/u/'+obj['sina_uid']+'" target="_blank">Ta的微博</a><p>翻译条数：<span>'+obj['trans_num']+'</span></p><div class="cBoth"></div></li>';
		$("#dialogList_translator").append(text);
	}
}

Chat.getAdminList=function(){
	var chat_url="http://fan.tv.idol001.com/chat_v2.php?action=role_list&type=0&callback=Chat.adminlist&starid="+G_starid;
	MiniSite.JsLoader.load(chat_url,'utf-8',function(){
		if(Chat.adminlist!=null){
			Chat.showAdminList();
		}
	});
}

Chat.showAdminList=function(){
	$("#dialogList_admin").html("");
	for(var i=0;i<Chat.adminlist.list.length;i++){
		var obj = Chat.adminlist.list[i];
		var text = '<li class="userItem"><div class="weiboAvatar"><a target="_blank" href="http://weibo.com/u/'+obj['sina_uid']+'"><img src="'+obj['img']+'"></a></div><div class="userItemTitle">'+obj['nickname']+'</div><a class="radiusBt" href="http://weibo.com/u/'+obj['sina_uid']+'" target="_blank">Ta的微博</a><div class="cBoth"></div></li>';
		$("#dialogList_admin").append(text);
	}
}

Chat.btChat=function(){
	$('#sendComment').css('background-color','#D64B75');
	$(this).children('input').attr('checked',true)
}

Chat.btTranslate=function(){
	$('#sendComment').css('background-color','#3dc27f');
	$(this).children('input').attr('checked',true)
}

Chat.forbidUser=function(sina_uid){
	var forbid_flag = arguments[1];
	if (forbid_flag == 'forever') {
		var chat_url="http://fan.tv.idol001.com/chat_v2.php?action=rc_forbid_user_forever&callback=Chat.forbidUserResult&starid="+G_starid+"&sina_uid="+sina_uid;
	} else {
		var chat_url="http://fan.tv.idol001.com/chat_v2.php?action=rc_forbid_user&callback=Chat.forbidUserResult&starid="+G_starid+"&sina_uid="+sina_uid;
	}
	
	MiniSite.JsLoader.load(chat_url,'utf-8',function(){});
}

Chat.forbidUserResult=function(result){
	if(result.error){
		alert(result.error_description);
	}else{
		if (result.status == 200) {
			alert("禁言成功！");
		} else {
			alert("禁言失败！");
		}
	}
}

Chat.tvNotify=function(){
	var chat_url="http://t.tv.idol001.com/tvnotify/"+G_starid+".json";
	MiniSite.JsLoader.load(chat_url,'utf-8',function(){
		if(typeof("tvnotify")!="undefind" && tvnotify['text']!=""){
			$(".announce").html("<span>"+tvnotify['text']+"</span>");
			$(".announce")[0].href=tvnotify['url'];
			$("#commentContent").css({"top":"70px"});
			//$(".announce").css({"height":"18px"});
			$(".announce").show();
		}else{
			$(".announce").hide();
			$("#commentContent").css({"top":"45px"});
		}
	});
}

Chat.arrowDownInertval = null;
Chat.direction = "";
Chat.isScrolling = false;

Chat.setArrowDownInertval = function(direction){
	Chat.forcastScrollPart(direction);
}

Chat.clearArrowDownInertval = function(){
	try{
		clearInterval(Chat.arrowDownInertval);
	}catch(e){

	}
}

Chat.forcastScrollPart=function(direction){
	
	if(!Chat.isScrolling){

		var speed = 240;
		var left = $(".forecast-container").css("margin-left");
		left = parseInt(left,10);
		var box_length = 220*$(".forecast-container").children().length+20*($(".forecast-container").children().length-1);
		var scroll_span=0;

		if(box_length<$(".forecast-scroller").width()){
			$(".forecast-container").css("margin-left",0);
			return;
		}

		var option = {
			speed:1000,
			callback:function(){
				Chat.isScrolling=false;
			}
		}

		if(direction=="left"){
			if(left+speed>0){
				scroll_span = 0;
			}else{
				scroll_span = left+speed;
			}
		}else if(direction=="right"){
			if(left-speed<-(box_length-$(".forecast-scroller").width())){
				scroll_span = -(box_length-$(".forecast-scroller").width());
			}else{
				scroll_span=left-speed;
			}	
		}
		
		Chat.isScrolling=true;
		$(".forecast-container").animate({"margin-left":scroll_span+"px"},function(){
			Chat.isScrolling=false;
		});
	
	}
}

Chat.forecastScroll=function(direction){
	var speed = 40;
	var left = $(".forecast-container").css("margin-left");
	left = parseInt(left,10);
	var box_length = 220*$(".forecast-container").children().length+20*($(".forecast-container").children().length-1);
	if(box_length<$(".forecast-scroller").width()){
		$(".forecast-container").css("margin-left",0);
		Chat.clearArrowDownInertval();
		return;
	}
	if(direction=="left"){
		if(left+speed>0){
			$(".forecast-container").css("margin-left",0);
			Chat.clearArrowDownInertval();
		}else{
			$(".forecast-container").css("margin-left",left+speed);
		}
	}else if(direction=="right"){
		if(left-speed<-(box_length-$(".forecast-scroller").width())){
			$(".forecast-container").css("margin-left",-(box_length-$(".forecast-scroller").width()));
			Chat.clearArrowDownInertval();
		}else{
			$(".forecast-container").css("margin-left",left-speed);
		}
	}
}

Chat.addBookmark=function(){
	try {
        window.external.addFavorite(url, title);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用"+(navigator.userAgent.toLowerCase().indexOf('mac') != - 1 ? 'Command/Cmd' : 'CTRL')+"+D进行添加");
        }
    }
}

Chat.switchLoginTab=function(n){
	$('#login_tab_0').removeClass('on');
	$('#login_list_0').removeClass('on');
	$('#login_tab_1').removeClass('on');
	$('#login_list_1').removeClass('on');

	$('#login_tab_'+n).addClass('on');
	$('#login_list_'+n).addClass('on');
}

Chat.tvLimit=function(noadd){
	if(!Chat.userinfo || typeof(Chat.userinfo._id)=="undefined"){
		var limit_time=Common_Tool.getCookie("tlt");
		if(!limit_time){
			Common_Tool.setCookie("tlt",1,10000000000);
		}else{
			if(parseInt(limit_time,10)>=15){
				$("#ckplayer_a1").hide();
				$(".login-tip-af15").show();
				$(".login-tip-if").html("请登录后继续 观看呦");
			}else if(!noadd){
				Common_Tool.setCookie("tlt",parseInt(limit_time,10)+1,10000000000);
			}
		}
	}
}

Chat.addDebug = function (msg) {
	console.log(msg);
}

Chat.getToken = function (callback) {
    $.getJSON('http://fan.tv.idol001.com/rongcloud_token.php?callback=?', {"action":"get_usertoken"}, function( msg ) {
        if (msg.status == 200) {
            callback.call(undefined, msg.data);
        } else {
            alert(msg.data);
        }
    });
}

Chat.getMessage = function (content) {
	return new RongIMClient.TextMessage.obtain(content);
}

Chat.sendPrivateMessage = function (targetId, msg, callback) {
    var content = new RongIMClient.MessageContent(msg);
    var conversationtype = RongIMClient.ConversationType.PRIVATE; // 私聊
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, content, null, callback);
}

Chat.sendChatRoomMessage = function (targetId, msg, callback) {
    var content = new RongIMClient.MessageContent(msg);
    var conversationtype = RongIMClient.ConversationType.CHATROOM; // 私聊
    RongIMClient.getInstance().sendMessage(conversationtype, targetId, content, null, callback);
}

//Angular JS Definition
var IdolChat = angular.module("IdolChat", ["IdolChat.ctrl", "IdolChat.directive", "IdolChat.filter"], function () {

});
var IdolChatCtrl = angular.module("IdolChat.ctrl", []);
var IdolChatDirective = angular.module("IdolChat.directive", []);
var IdolChatFilter = angular.module("IdolChat.filter", []);

IdolChatDirective.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown", function (event) {
            if(event.which === 13) {
				if (scope.isFocus) {
					scope.$apply(function(){
            			scope.sendMessage();
            		});
            		event.preventDefault();
				}
            }
        });
    };
});

IdolChatCtrl.controller("ChatInfo", function ($scope, $http) {
    var currentConversationTargetId = G_CHATROOM_ID;//聊天室ID
	var tranTimer = null;//播放器下侧翻译浮层消失定时器

    $scope.owner = null;//当前登录用户
    $scope.isFocus = false;//聊天输入框是否focus
    $scope.historyMessages = [];//历史聊天记录
    $scope.translates = null;//播放器下侧翻译信息控制
    $scope.cardUser = null;//点击用户头像弹出复层
    
    $scope.logout = function () {
    	$scope.historyMessages = [];
    	// $('#commentList').html('');
    	Chat.loginOut();
    };
	
	Chat.rcCallback = function(){
		if (Chat.userinfo) {
	    	$scope.owner = Chat.userinfo;
	    }

	    $scope.historyMessages = [];

	    //如果新登入的用户还是同一个帐号，那么判定为重连，不调用getToken
		if (Chat.originUser && Chat.originUser._id == Chat.userinfo._id) {
			Chat.reconnect = true;
		} else {
			Chat.reconnect = false;
		}

	    RongIMClient.setConnectionStatusListener({
	        onChanged: function (status) {
	            Chat.addDebug("登录状态变更："+status.value+'|登录状态变更信息：'+status.toString());
	            if (status.value == 0) {
	            	//聊天室服务器登录成功
	            } else if (status.value == 4 ) {
	            	// Chat.loginOut(true);
	            }       
	        }
	    }); 

	    RongIMClient.getInstance().setOnReceiveMessageListener({
	        onReceived: function (data) {
	        	// Chat.addDebug(data);
	            if (true/* || currentConversationTargetId == data.getTargetId()*/) {
	            	if (data.getSentTime() < Chat.userinfo.sys_time || data.getSenderUserId() != Chat.userinfo._id) {
	            		$scope.$apply(function(){
	            			$scope.parseMessage(data);
	            		});
		        	}
	            } 
	        }
	    });

		if (Chat.reconnect) {
			RongIMClient.getInstance().reconnect({                   
		        onSuccess: function (userId) {
		            // 此处处理连接成功。
		            Chat.addDebug("重新登录成功:" + userId);

		            // RongIMClient.getInstance().initChatRoom(G_CHATROOM_ID);
		            RongIMClient.getInstance().joinChatRoom(G_CHATROOM_ID, 10, {
		                onSuccess: function () {
		                    Chat.addDebug("重新加入聊天室成功");
		                },
		                onError: function (errorCode) {
		                    // 此处处理连接错误。
		                    Chat.addDebug("重新加入聊天室失败");
		                }
		            });
		        },
		        onError: function (errorCode) {
		            // 此处处理连接错误。
		            Chat.addDebug("重新登录失败.错误码：" + errorCode.value,"||错误信息: "+errorCode.name);
		        }
		    });
		} else {
			//开始连接服务器，登录聊天室
			Chat.getToken(function (token) {

			    // 连接融云服务器。
			    RongIMClient.connect(token,{                   
			        onSuccess: function (userId) {
			            // 此处处理连接成功。
			            Chat.addDebug("登录成功:" + userId);

			            RongIMClient.getInstance().initChatRoom(G_CHATROOM_ID);
			            RongIMClient.getInstance().joinChatRoom(G_CHATROOM_ID, 10, {
			                onSuccess: function () {
			                    Chat.addDebug("加入聊天室成功");
			                },
			                onError: function (errorCode) {
			                    // 此处处理连接错误。
			                    Chat.addDebug("加入聊天室失败");
			                }
			            });
			        },
			        onError: function (errorCode) {
			            // 此处处理连接错误。
			            Chat.addDebug("登录失败.错误码：" + errorCode.value,"||错误信息: "+errorCode.name);
			        }
			    });
			});
		}

		//结束连接服务器，登录聊天室初始化完成
		
	}

	Chat.init();
    
    //加载表情

    function clearTranslates() {
    	if (tranTimer) {
    		clearTimeout(tranTimer);
    	}
    	tranTimer = setTimeout(function(){
    		$scope.$apply(function(){
    			$scope.translates = null;
    		});	
    	}, 3000);
    }

    $scope.setFocus = function () {
    	$scope.isFocus = true;
    }

    $scope.setBlur = function () {
    	$scope.isFocus = false;
    }

    $scope.parseMessage = function (content) {

    	var extraInfo = angular.fromJson(content.getExtra());
    	if (extraInfo) {
	        content.idolUser = extraInfo.user;
	        content.isTranslate = extraInfo.translate;
		} else {
			content.idolUser = {};
	        content.isTranslate = false;
	        return;
		}

    	$scope.historyMessages.push(content);
    	if (content.isTranslate && content.getSentTime() < Chat.userinfo.sys_time ) {
    		return;
    	}
    	setTimeout(function(){
    		Chat.showChat();	
    	});
    };

    $scope.hideCardUser = function () {
    	$scope.cardUser = null;
    }

    $scope.showCardUser = function (user) {
    	$scope.cardUser = user;
    }


    $scope.sendMessage = function () {
    	if(!Chat.userinfo){
			alert("请先登陆");
			return false;
		}

		if($('#textArea').val().trim() == ""){
			alert("请输入聊天内容");
			return false;
		}

		var isTranslate = $('input:radio[name="contentType"]:checked').val()=="translate";

		var msg = {}, content = '';
		if (!Chat.allowCommit) {//如果发送太频繁，报警
			content = '消息发送太频繁，请稍候重试';
			msg = Chat.getMessage(content);	
			$scope.historyMessages.push(msg);
			Chat.showChat();
		} else {
		    content = $('#textArea').val();
			msg = Chat.getMessage(content);	
			msg.idolUser = Chat.userinfo;
			msg.isTranslate = isTranslate;
			msg.setExtra(angular.toJson({user:Chat.userinfo, translate:isTranslate}));
			Chat.sendChatRoomMessage(G_CHATROOM_ID, msg,{
		        onSuccess: function () {
		        	$scope.$apply(function(){
	            		$scope.historyMessages.push(msg);
				    	if (msg.isTranslate) {
				    		$scope.translates = msg;
				    		clearTranslates();
				    	}
			    		Chat.showChat();
	            	});
		        }, 
		        onError: function (errorCode) {
					$scope.historyMessages.push(Chat.getMessage('消息发送失败'));
		            Chat.addDebug("聊天室消息发送失败|"+errorCode.value+'|'+errorCode.name);
		        }
		    });

		    if (isTranslate) {
				MiniSite.JsLoader.load("http://fan.tv.idol001.com/chat_v2.php?action=increase_trans_num",'utf-8',function(){});
		    }
		}

	    Chat.allowCommit = false;//发送之后设置暂时无法发送状态，1秒后重置
		clearTimeout(Chat.commitTimer);
	    Chat.commitTimer = setTimeout(function(){
	    	Chat.allowCommit = true;
	    }, 1000);

	    $('#textArea').val('');
    };

    $scope.forbidUser = function (sid) {
    	Chat.forbidUser(sid);
    }

    $scope.forbidUserForever = function (sid) {
    	Chat.forbidUser(sid, 'forever');
    }
});

