/*$(document).ready(function(){
	alert();
	$("a:first").css({"textDecoration":"#f00 solid underline", "fontWeight", "blod"});
});
*/
$(document).ready(function(){
	$("a:first").css({"fontWeight":"bold", "text-decoration":"underline"});
	
	//上传请求到服务器的函数
	var upload = function(){
		var text = $("#search_input").val();
		var choose_a = $("a").filter(function(index){
			return $(this).css("fontWeight")=="bold";
		});
		$.getJSON("/upload", {"text":text, "choose" : choose_a.attr("href")}, function(result){
			$(".container").html("");
			$.each(result, function(i, field){
       			$(".container").append("<div class='item'><p>名字"+field.name+"</p><p>链接：<a target='_blank' href="+field.link+">"+field.link+"</a></p></div>");
     		});
		});
	};

	//当连接被点击
	$("a").click(function(){
		var text = $("#search_input").val();
		$("a").css({"fontWeight":"normal", "text-decoration":"none"});
		$(this).css({"fontWeight":"bold", "text-decoration":"underline"});
		if(text){
			$("body").css({"top": "0px", "left": "10%"});
			upload();
		}
		return false;
	});

	//当搜索按钮被点击
	$("#search_button").click(function(){
		$("body").css({"top":"0px", "left":"10%"});
		$(this).css("background-color", "#6079D5");
		upload();
	});
	$("#search_button").mouseover(function(){
		$(this).css("background-color", "#6079D5");
	});
	$("#search_button").mouseout(function(){
		$(this).css("background-color", "#647ed9");
	});

	//当按下回车
	$("#search_input").keypress(function(e){
		if(e.which == 13){
			$("body").css({"top": "0px", "left": "10%"});
			upload();
		}
	});


});
