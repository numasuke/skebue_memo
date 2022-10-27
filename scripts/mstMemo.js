'use strict';

// Const
const KEY_MST_MEMO = "mst_memo";	// 永続化キー

// メモを取得：ALL
function getUserMemoAll(callback) {

	if(!callback) {
		callback = function(){};
	}

	chrome.storage.local.get([KEY_MST_MEMO], function(items) {

		let mstObj;

		if(items && items[KEY_MST_MEMO]) {
			mstObj = items[KEY_MST_MEMO];
		} else {
			mstObj = {};
		}

		callback(mstObj);
	});
}

// メモを取得：ユーザー指定
function getUserMemo(userId, callback) {

	if(!callback) {
		callback = function(){};
	}

	getUserMemoAll(function(mstObj) {
		let data = null;

		for(const key of Object.keys(mstObj)) {
			if(mstObj[key].userId == userId) {
				data = mstObj[key];
				break;
			}
		};

		callback(data);
	});
}

// メモを保存
function saveUserMemo(data, callback) {

	if(!callback) {
		callback = function(){};
	}

	getUserMemoAll(function(mstObj) {
		mstObj[data.userId] = data;

		chrome.storage.local.set({[KEY_MST_MEMO] : mstObj}, callback);
	});

}

// メモを削除
function deleteUserMemo(userId, callback) {

	let userIdList = [userId];
	deleteUserMemoList(userIdList, callback)
}

// メモを削除:リスト
function deleteUserMemoList(userIdList, callback) {

	if(!callback) {
		callback = function(){};
	}

	getUserMemoAll(function(mstObj) {

		for (const userId of userIdList) {
			delete mstObj[userId];
		}

		chrome.storage.local.set({[KEY_MST_MEMO] : mstObj}, callback);
	});
}
