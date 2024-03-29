const BUTTON_ID = 'youtube-private-mode-button'

function setToggledStyle(button, isPrivateModeEnabled) {
    const div = button.querySelector('div');
    if (isPrivateModeEnabled) {
        div.style.left = '20px';
        div.innerText = 'P';
        div.style.backgroundColor = '#ef4444';
    } else {
        div.style.left = '-4px';
        div.innerText = '';
        div.style.backgroundColor = '#34d399';
    }
}

function onToggle() {
    chrome.storage.local.get(['yt-private-mode'], function(result) {

        let newSetting = !(result['yt-private-mode'] ?? false)

        const button = document.getElementById(BUTTON_ID);

        setToggledStyle(button, newSetting);

        chrome.storage.local.set({ 'yt-private-mode': newSetting }, () => {
        });
    });
}

function createButton() {
    const button = document.createElement('button');
    button.id = BUTTON_ID

    button.style.outline = 'none';
    button.style.border = 'white 1px solid';
    button.style.cursor = "pointer";
    button.style.width = '40px';
    button.style.background = 'transparent';
    button.style.height = '16px';
    button.style.borderRadius = '16px';
    button.style.position = 'relative';
    button.style.marginRight = '8px';

    const div = document.createElement('div');

    div.style.background = '#ef4444';

    div.style.transitionProperty = "all";
    div.style.transitionTimingFunction = "cubic-bezier(0.4, 0, 0.2, 1)";
    div.style.transitionDuration = "150ms";

    div.style.width = '20px';
    div.style.height = '20px';
    div.style.borderRadius = '20px';
    div.style.position = 'absolute';
    div.style.left = '-4px';
    div.style.top = '-3.5px';
    div.style.zIndex = '1';
    div.style.display = 'flex';
    div.style.color = 'white';
    div.style.justifyContent = 'center';
    div.style.alignItems = 'center';

    button.appendChild(div);

    button.addEventListener('click', onToggle);

    return button;
}


const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.id === 'end') {
                try {
                    const button = createButton();
                    document.querySelector("div#end.style-scope.ytd-masthead").prepend(button);

                    chrome.storage.local.get(['yt-private-mode'], function(result) {
                        setToggledStyle(button, result['yt-private-mode'] ?? false);
                    });
                    mutationObserver.disconnect();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    });
});

mutationObserver.observe(document, { childList: true, subtree: true });

console.log("youtube private mode extension loaded");
