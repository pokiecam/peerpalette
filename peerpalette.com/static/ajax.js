var title;var newUnreadMessages=0;var hasfocus=true;var notifyTimeout;var unread_alert_disabled=false;function unread_alert(){if(!unread_alert_disabled){unread_alert_disabled=true;document.getElementById("buzzer").newChatAlert();$("#inbox").blink({maxBlinks:6,blinkPeriod:200,speed:"fast",onBlink:function(){},onMaxBlinks:function(){}});setTimeout("unread_alert_disabled = false;",4000);var a=true;if(hasfocus){a=false}jQuery.noticeAdd({text:'You have received a message in another chat session. Go to <a href="/inbox">inbox</a>',stay:a,stayTime:5000})}}function refresh_unread_text(a){if(a>0){$("#inbox").html("<b>inbox ("+a+")</b>")}else{$("#inbox").html("inbox")}}function refresh_chat_status(a){$("#status").removeClass("online offline inactive");$("#status").addClass(a)}function notify(c,a){if(typeof title=="undefined"){title=$(document).attr("title")}var b="("+c+")"+title;if(a){if(typeof notifyTimeout!="undefined"){clearTimeout(notifyTimeout)}$(document).attr("title",b)}else{if($(document).attr("title")==b){$(document).attr("title",title)}else{$(document).attr("title",b)}}notifyTimeout=setTimeout("notify('"+c+"')",1000)}function clear_notify(){clearTimeout(notifyTimeout);$(document).attr("title",title)}function update2(){$.ajax({url:"/getunread",type:"GET",data:({timestamp:timestamp}),success:function(a){if(a.status=="ok"){refresh_unread_text(a.unread_count);if(a.unread_alert){unread_alert()}if("timestamp" in a){timestamp=a.timestamp}}setTimeout("update2();",3000)},error:function(c,b,a){setTimeout("update2();",3000)}})}function update(){$.ajax({url:"/receivemessages",type:"GET",data:({timestamp:timestamp,chat_key_name:chat_key_name,cursor:cursor}),success:function(a){if(a.status=="ok"){if("messages" in a){var c=a.messages;cursor=a.cursor;for(var b=0;b<c.length;++b){$("#log").append($('<div><span class="them">s/he</span>: </div>').append($('<span style="white-space:pre-wrap"/>').text(c[b])))}$("#log").animate({scrollTop:$("#log")[0].scrollHeight});if(!hasfocus){document.getElementById("buzzer").newMessageAlert();++newUnreadMessages;notify(newUnreadMessages,true)}}if("unread_count" in a){refresh_unread_text(a.unread_count)}if(a.unread_alert){unread_alert()}if("status_class" in a){refresh_chat_status(a.status_class)}if("timestamp" in a){timestamp=a.timestamp}}setTimeout("update();",1000)},error:function(c,b,a){$("#log").append('<div class="error"><b>error</b>: Could not connect to server.</div>');$("#log").animate({scrollTop:$("#log")[0].scrollHeight});setTimeout("update();",1000)}})}$(document).ready(function(){if(typeof swfobject!="undefined"){$("body").append('<div id="buzzer" style="display:none;"/>');swfobject.embedSWF("/static/Buzzer.swf","buzzer","0","0","9.0.0")}if(typeof chat_key_name=="undefined"){if($("#inbox").length){setTimeout("update2();",3000);var b=function(){hasfocus=true};var a=function(){hasfocus=false}}}else{$("#message").keypress(function(c){if(c.keyCode=="13"){var d=$("textarea#message").val();if(c.shiftKey){return true}if(d!=""){$("textarea#message").val("");c.preventDefault();$.ajax({url:"/sendmessage",type:"POST",data:({chat_key_name:chat_key_name,msg:d}),success:function(e){$("#log").append($('<div><span class="you">you</span>: </div>').append($('<span style="white-space:pre-wrap"/>').text(d)));$("#log").animate({scrollTop:$("#log")[0].scrollHeight})},error:function(g,f,e){$("#log").append('<div class="error"><b>error</b>: Message could not be sent.</div>');$("#log").append('<div class="error">'+f+"</div>");$("#log").animate({scrollTop:$("#log")[0].scrollHeight})}})}else{return false}}});var b=function(){hasfocus=true;newUnreadMessages=0;clear_notify()};var a=function(){hasfocus=false};$("#log").scrollTop($("#log")[0].scrollHeight);setTimeout("update();",1000)}if($.browser.msie){$(document).focusin(b);$(document).focusout(a)}else{$(window).focus(b);$(window).blur(a)}});var random_chat_canceled=false;function random_chat_show_waiting(){$.blockUI({message:'<div style="font-size:18px;"><img src="/static/waiting.gif" /> Waiting for a random dude or girl... <a href="#" onclick="random_chat_stop();return false;">Cancel</a></div>',css:{padding:"10px",width:"400px",left:($(window).width()-400)/2+"px"}})}function random_chat_hide_waiting(){$.unblockUI()}function random_chat_stop(){random_chat_canceled=true}function random_chat_retry(){$.ajax({url:"/random",type:"post",success:function(b,c,a){if(a.status==201){window.location.href=b}else{if(random_chat_canceled){random_chat_hide_waiting()}else{setTimeout("random_chat_retry()",1000)}}}})}function random_chat_start(a){random_chat_canceled=false;random_chat_retry();if(a){setTimeout("random_chat_show_waiting()",300)}};