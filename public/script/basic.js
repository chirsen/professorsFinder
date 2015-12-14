/*$(document).ready(function(){
	alert();
	$("a:first").css({"textDecoration":"#f00 solid underline", "fontWeight", "blod"});
});
*/
$(document).ready(function() {
	$("a:first").css({
		"fontWeight": "bold",
		"text-decoration": "underline"
	});


	//当连接被点击
	$(".tab").click(function() {
		$(".tab").css({
			"fontWeight": "normal",
			"text-decoration": "none"
		});
		$(this).css({
			"fontWeight": "bold",
			"text-decoration": "underline"
		});
		var text = $("#search_input").val();
		var choose_a = $("a").filter(function(index) {
			return $(this).css("fontWeight") == "bold";
		});
		if (text) {
			$("body").css({
				"top": "0px",
				"left": "10%"
			});
			//发送请求
			upload(text, choose_a.attr("href"), 1);
		}
		return false;
	});

	//当搜索按钮被点击
	$("#search_button").click(function() {
		//整个body到顶上
		$("body").css({
			"top": "0px",
			"left": "10%"
		});
		//按钮被点击时，北京变化，起到点击效果
		$(this).css("background-color", "#6079D5");
		//获取input输入框里面的文本值和选择的那一个选项
		var text = $("#search_input").val();
		var choose_a = $("a").filter(function(index) {
			return $(this).css("fontWeight") == "bold";
		});
		//上传请求
		upload(text, choose_a.attr("href"), 1);
	});
	//当鼠标悬停在按钮上的时候，有颜色变化的动画效果
	$("#search_button").mouseover(function() {
		$(this).css("background-color", "#6079D5");
	});
	//当鼠标离开按钮时的效果
	$("#search_button").mouseout(function() {
		$(this).css("background-color", "#647ed9");
	});

	//当按下回车
	$("#search_input").keypress(function(e) {
		if (e.which == 13) {
			$("body").css({
				"top": "0px",
				"left": "10%"
			});
			var text = $("#search_input").val();
			var choose_a = $("a").filter(function(index) {
				return $(this).css("fontWeight") == "bold";
			});
			upload(text, choose_a.attr("href"), 1);
		}
	});


});

//上传请求到服务器的函数
var upload = function(text, choose_a, currentPage) {
	$.getJSON("/upload", {
		//要上传的请求包含的参数
		"text": text,
		"choose": choose_a,
		"currentPage": currentPage
	}, function(result) {
		//对服务器返回来的result的处理
		$(".container").html("");
		$.each(result.professors, function(i, field) {
			//设置内容块儿的显示数据
			$(".container").append("<div class='item'><p>名字: " + field.name + "<p>所在院校：" + field.school + "</p><p>职称：" + field.position + "</p></p><p>链接：<a onclick='uploadid(" + field.id + ")' target='_blank' href=" + field.link + ">" + field.link + "</a></p></div>");
		});

		$(".container").append("<div class='pages'></div>");
		//如果总的页数大于1小于10
		if (result.totalPages > 1 && result.totalPages <= 10) {
			//如果当前页不是第一页，构建“上一页”按钮
			if (result.currentPage != '1') {
				$(".pages").append("<a class='page_item1' href='#' onclick=\"upload(\'" + text + "\',\'" + choose_a + "\',\'" + (Number(result.currentPage) - 1) + "\'); return false;\" left='0px'>上一页</a>");
			}
			//循环往复的添加页码
			for (var i = 0; i < result.totalPages; i++) {
				$(".pages").append("<a class = 'page_item2' href='#' href ='#' onclick=\"upload(\'" + text + "\',\'" + choose_a + "\',\'" + (i + 1) + "\'); return false;\" left='0px'>" + (i + 1) + "</a>");
			}
			//添加下一页按钮
			$(".pages").append("<a class='page_item1' href='#'  onclick=\"upload(\'" + text + "\',\'" + choose_a + "\',\'" + (Number(result.currentPage) + 1) + "\'); return false;\">下一页</a>");
		} else if (result.totalPages > 10) {
		//如果总的页面数大于10
			if (result.currentPage != '1') {
				$(".pages").append("<a class='page_item1' href='#'  onclick=\"upload(\'" + text + "\',\'" + choose_a + "\',\'" + (Number(result.currentPage) - 1) + "\'); return false;\" left='0px'>上一页</a>");
			}
			if (result.currentPage <= 5) {
				for (var i = 0; i < 10; i++) {
					$(".pages").append("<a class = 'page_item2' href='#'  onclick=\"upload(\'" + text + "\',\'" + choose_a + "\',\'" + (i + 1) + "\'); return false;\" left='0px'>" + (i + 1) + "</a>");
				}
			} else {
				for (var i = 0; i < 10; i++) {
					$(".pages").append("<a class='page_item2' href='#'  onclick=\"upload(\'" + text + "\',\'" + choose_a + "\',\'" + (result.currentPage - 4 + i) + "\'); return false;\" left='0px'>" + (result.currentPage - 4 + i) + "</a>");
				}
			}
			$(".pages").append("<a class='page_item1' href='#' onclick=\"upload(\'"+text+"\',\'"+choose_a+"\',\'"+(Number(result.currentPage)+1)+"\'); return false;\"	>下一页</a>");
		} else {
			$(".pages").append("<p>没有更多的数据</p>");
		}
		//给当前页码加上下划线
		$(".page_item2").filter(function(){
			return $(this).text() == result.currentPage;
		}).css("text-decoration", "underline");
	});
};
//点击某个链接，并且为该教授加上1个点的搜索吗热度
function uploadid(id) {
	$.get("/uploadid", {
		"id": id
	});
}

