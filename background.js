// アドオンアイコンから
chrome.action.onClicked.addListener((tab) => {
	openOptionHtml();
});

// ContentScriptから
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	if(request == "option") {
		openOptionHtml();
	}
	
	sendResponse({}); // 送り返すべきものがなければ空のObjectを返す
});

// オプションを開く
function openOptionHtml() {
	chrome.tabs.create({
		"url": "index.html"
	});
}