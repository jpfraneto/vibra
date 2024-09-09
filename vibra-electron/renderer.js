const { ipcRenderer } = require('electron');

const channels = {
    tech: [
        "OwS9aTE2Go4", 
    ],
    nature: [
        "29XymHesxa0", 
    ],
    music: [
        "jslF_XNIilA", 
    ],
    gaming: [
        "22oxQoEIUuk", 
    ],
    food: [
        "zHP_4KG-LTI",
    ],
    space: [
        "Y_plhk1FUQA", 
    ],
    art: [
        "sfh2xoophiY", 
    ],
    sports: [
        "J8voIyM81zY    ", 
    ]
};

const streamers = {
    "ThePrimeagen": "TEfoOlR9x6k",
    "The Coding Train": "MazpwQNdJYQ",
    "PirateSoftware": "GskGhpew_u4",
    "0xCassie": "bMDv-0ZFwCA",
};

let currentChannel = 'tech';
let currentVideoIndex = 0;

// Event listeners for channel icons
document.querySelectorAll('.channel-icon').forEach(icon => {
    icon.addEventListener('click', (event) => {
        currentChannel = event.target.dataset.channel;
        currentVideoIndex = 0;
        loadYoutubeVideo(channels[currentChannel][currentVideoIndex]);
        updateActiveChannel(event.target);
    });
});

// Event listeners for streamer icons
document.querySelectorAll('.left-circle').forEach(circle => {
    circle.addEventListener('click', (event) => {
        const streamerName = event.target.title;
        const videoId = streamers[streamerName];
        if (videoId) {
            loadYoutubeVideo(videoId);
            currentChannel = null; // Reset channel selection when a streamer is clicked
            updateActiveChannel(null);
        }
    });
});

function updateActiveChannel(clickedIcon) {
    document.querySelectorAll('.channel-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    if (clickedIcon) {
        clickedIcon.classList.add('active');
    }
}

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

// Add event listener for spacebar to cycle through videos
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && currentChannel) {
        event.preventDefault(); // Prevent default spacebar behavior
        currentVideoIndex = (currentVideoIndex + 1) % channels[currentChannel].length;
        loadYoutubeVideo(channels[currentChannel][currentVideoIndex]);
    }
});

// Initial load
document.querySelector('.channel-icon[data-channel="tech"]').classList.add('active');
loadYoutubeVideo(channels.tech[0]);