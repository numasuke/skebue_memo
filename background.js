// �A�h�I���A�C�R������
chrome.action.onClicked.addListener((tab) => {
	openOptionHtml();
});

// ContentScript����
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

	if(request == "option") {
		openOptionHtml();
	}
	
	sendResponse({}); // ����Ԃ��ׂ����̂��Ȃ���΋��Object��Ԃ�
});

// �I�v�V�������J��
function openOptionHtml() {
	chrome.tabs.create({
		"url": "index.html"
	});
}