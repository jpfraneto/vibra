const { ipcRenderer } = require('electron');

document.querySelector('.paste-btn').addEventListener('click', async () => {
    try {
        const text = await navigator.clipboard.readText();
        const videoId = getYoutubeVideoId(text);
        if (videoId) {
            loadYoutubeVideo(videoId);
            ipcRenderer.send('send-ws-message', { type: 'youtube', content: videoId });
        } else {
            shakeScreen();
            alert('Please paste a valid YouTube URL');
        }
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
});

function getYoutubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function loadYoutubeVideo(videoId) {
    const container = document.getElementById('youtube-container');
    container.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    container.style.display = 'block';
    document.querySelector('.paste-btn').style.display = 'none';
}

function shakeScreen() {
    document.body.style.animation = 'shake 0.5s';
    document.body.style.animationIterationCount = '1';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
}

ipcRenderer.on('ws-message', (event, data) => {
    const message = JSON.parse(data);
    if (message.type === 'youtube') {
        loadYoutubeVideo(message.content);
    }
});