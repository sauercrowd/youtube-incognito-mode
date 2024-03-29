const URL_PREFIXES = [
    'https://www.youtube.com/api/stats/watchtime',
    'https://www.youtube.com/youtubei/v1/log_event',
    'https://www.youtube.com/youtubei/v1/player/heartbeat',
]

const RULES = URL_PREFIXES.map((url, i) => ({
    id: i + 1,
    priority: 1,
    action: { type: 'block' },
    condition: { urlFilter: url, resourceTypes: ['xmlhttprequest'] }
}));

chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === 'yt-private-mode' && newValue === true) {
            chrome.declarativeNetRequest.updateDynamicRules({
                addRules: RULES,
                removeRuleIds: RULES.map(rule => rule.id)
            });
        } else if (key === 'yt-private-mode' && newValue === false) {
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: RULES.map(rule => rule.id)
            });
        }
    }
});

