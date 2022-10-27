'use strict';
const SKEB_URL_PRE = "https://skeb.jp/";	// 末尾のスラッシュ含むURL

$(document).ready(function () {

	// リロードボタン
	$(".reload-button").each(function(i, element){
		$(element).click(function(){
			// フィルタクリア
			$(".search-box input[type='search']").each(function(i, element){
				$(element).val("");
			});

			// ロード
			loadList();
		});
	});

	// 削除ボタン
	$(".delete-button").each(function(i, element){
		$(element).click(function(){
			deleteData();
		});
	});

	// フィルタ
	$(".search-box input[type='search']").each(function(i, element){
		$(element).keypress(function(e) {
			if (e.which == 13) {
				loadList();
				return false;
			}
		});
	});

	// 初期表示
	loadList();
});

// テーブルロード
function loadList() {

	let tbl = $('#tblUser');
	tbl.find('tr').slice(1).remove()

	getUserMemoAll(function(mstObj) {

		let list = [];
		Object.values(mstObj).forEach(
			data => list.push(data)
		);

		// フィルタ
		let filUser = $("#txtUser").val().replace(SKEB_URL_PRE, "").toLowerCase();
		let filMemo = $("#txtMemo").val().toLowerCase();

		list = $.grep(list, function(data, i) {

			if(filUser && (data.userId.toLowerCase().indexOf(filUser) === -1 && data.userName.toLowerCase().indexOf(filUser) === -1)) {
				return false;
			}

			if(filMemo && data.memo.toLowerCase().indexOf(filMemo) === -1) {
				return false;
			}

			return true;
		});

		// ソート
		//list.sort((a,b) => a.userId.localeCompare(b.userId));
		list.sort((a,b) => a.userName.localeCompare(b.userName));

		// 出力
		if(list.length > 0) {
			list.forEach(data =>{
				let t = ''
					+ '<tr>'
					+ '  <td>'
					+ '    <div class="avatar-box">'
					+ '      <a target="_blank" href="https://skeb.jp/' + data.userId + '" tabindex="-1">'
					+ '        <img alt="' + data.userName + '" loading="lazy" src="' + data.imgUrl + '">'
					+ '      </a>'
					+ '    </div>'
					+ '  </td>'
					+ '  <td>'
					+ '     <small><strong>' + data.userId + '</strong></small>'
					+ '     <br>'
					+ '     <big>' + data.userName + '</big>'
					+ '  </td>'
					+ '  <td>' + data.memo.replaceAll("\n", "<br>") + '</td>'
					+ '  <td><input type="checkbox" class="big-check del-check" value="' + data.userId + '"></td>'
					+ '</tr>'
					;
				tbl.append(t);
			});
		} else {
			let t = ''
				+ '<tr>'
				+ '  <td colspan="4">NO DATA</td>'
				+ '</tr>'
				;
			tbl.append(t);
		}
	});

}

// 削除処理
function deleteData() {

	// チェック
	let checkedList = $("input[type='checkbox'].del-check").filter(":checked");

	if(checkedList.length == 0) {
		alert("削除対象にチェックを入れてください。");
		return;
	}

	let idList = [];
	checkedList.each(function(i, element) {
		idList.push(element.value);
	});

	if(!window.confirm(idList.length + "件削除します。")) {
		return;
	}

	deleteUserMemoList(idList, function() {
		loadList();
	});
}