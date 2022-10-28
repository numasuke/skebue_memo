'use strict';

let imTimer = null;
function insertMemoTimer() {
	clearTimeout(imTimer);
	imTimer = setTimeout(insertMemoTag, 100);
}

function insertMemoTag() {

	const target = $(".is-3");	// 左カラムの情報
	if(!target.length) {
		// ユーザーページではない or 読み込み中
		return;
	}

	if($("#ueMemo").length) {
		// 追加済み
		return;
	}

	// URLからユーザーID取得
	const curUrl = location.href;
	const patUserId = /@[^/]+/;
	let userId =  "";

	if(patUserId.test(curUrl)) {
		userId =  curUrl.match(patUserId)[0];
	} else {
		return;
	}

	// 画面にメモを追加
	let c = '';
	c += '<div class="is-box">';
	c += '  <div class="">';
	c += '    <small><span class="has-text-primary has-text-weight-bold">SkebUe Memo</span></small>';
	c += '  </div>';
	c += '<textarea id="ueMemo" rows="10" style="width:100%;" class="textarea is-underline is-p-8" maxlength="10000"></textarea>';	// メモエリア
	c += '<input type="hidden" id="ueUserId" value="' + userId + '">';												// ユーザーID @つき
	c += '<small><span id="ueMsg" class="aa-font msg_area"></span></small>';
	c += '  <div class="link-icon" style="width:100%; text-align:right;" >';
	c += '    <a id="linkOption">';
	c += '      <img src="' + chrome.runtime.getURL("images/icon48.png") + '" loading="lazy" >'; 
	c += '    </a>';
	c += '  </div>';
	c += '</div>';

	target.append(c);
	loadMemo();

	// プレースホルダー
	setMemoPlaceholder();
	placeholderTimer();

	// メモ変更イベント
	$("#ueMemo").change(function() {
		saveMemoTimer(0);
	});
	$("#ueMemo").keypress(function() {
		saveMemoTimer(1000);
	});
	$("#ueMemo").keyup(function() {
		saveMemoTimer(1000);
	});
	$("#ueMemo").keydown(function() {
		saveMemoTimer(5000);
	});
	
	// オプションボタン
	$("#linkOption").click(function() {
		chrome.runtime.sendMessage('option');
	});

}

// メモのロード
function loadMemo() {

	let userId = getUserId();

	getUserMemo(userId, function (data) {

		if(data && data.memo.length) {
			$("#ueMemo").val(data.memo);
			setMsg("(｀・ω・´)＜LOADｼﾀﾖ!");

			// プロフ更新保存
			data.userName = getUserName();
			data.imgUrl = getUserImgUrl();
			saveUserMemo(data);

		} else {
			setMsg("(´・ω・｀)＜ｴﾝﾌﾟﾃｨ");
		}
	});
	
}

// メモのセーブタイマー
let saveTimer = null;
let oldMemo = null;
function saveMemoTimer(time) {

	let memo =  $("#ueMemo").val();
	if(oldMemo == memo) {
		return;
	}

	if(!saveTimer) {
		setMsg("(´・ω・｀)＜…");
	}
	clearTimeout(saveTimer);
	saveTimer = setTimeout(saveMemo, time);
}

// メモのセーブ
function saveMemo() {

	saveTimer = null;
	let memo =  $("#ueMemo").val();
	let userId = getUserId();

	if(oldMemo == memo) {
		setMsg("(´・ω・｀)＜？");
		return;
	}
	oldMemo = memo;

	if(memo.length) {
		// 保存
		let data = {
			userId : userId
			, userName : getUserName()
			, imgUrl : getUserImgUrl()
			, memo : memo
		};

		saveUserMemo(data, function() {
			setMsg("(｀・ω・´)＜SAVEｼﾀﾖ!");
		});

	} else {
		// 削除
		deleteUserMemo(userId, function() {
			setMsg("(´・ω・｀)＜ｸﾘｱｰ");
		});
	}
}

// ユーザーID取得
function getUserId() {
	return $("#ueUserId").val();
}

// ユーザー名取得
function getUserName() {
	// アバター画像から取得
	return $("a.avatar").find("img").attr('alt');
}
// アバター画像URL
function getUserImgUrl() {
	// アバター画像から取得
	return $("a.avatar").find("img").attr('src');
}

// メッセージ表示
function setMsg(text) {
	$("#ueMsg").text(text);
}

// メモ欄のプレースホルダー
let phTimer = null;

function placeholderTimer() {

	if(phTimer != null) {
		clearInterval(phTimer);
	}
	phTimer = setInterval(setMemoPlaceholder, 30000);
}

function setMemoPlaceholder() {

	let memo = $("#ueMemo");
	if(!memo.length) {
		clearInterval(phTimer);
		return;
	}

	if(memo.val().length > 0) return;

	memo.attr("placeholder", getSkebTips());
}


//------------------------------------------------------------------------
const observer = new MutationObserver(insertMemoTimer);
observer.observe(document.body, {childList: true, subtree: true});
