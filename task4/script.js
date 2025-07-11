const canvas = document.getElementById('videoCanvas');
const ctx = canvas.getContext('2d');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const timeDisplay = document.getElementById('timeDisplay');
const timeline = document.getElementById('timeline');
const progress = document.getElementById('progress');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeIcon = document.getElementById('volumeIcon');
const mutedIcon = document.getElementById('mutedIcon');
const speedBtn = document.getElementById('speedBtn');
const speedMenu = document.getElementById('speedMenu');
const speedLabel = document.getElementById('speedLabel');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const settingsSpeed = document.getElementById('settingsSpeed');

const DURATION = 7; // seconds
let playing = false;
let currentTime = 0;
let animationFrame = null;
let speed = 1;
let muted = false;
let volume = 1;

// Each frame is a function that draws the corresponding screenshot layout
function drawFrame(sec) {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#6c4ee6";
    ctx.lineWidth = 1;
    const GRID_SIZE = 15;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * canvas.width / GRID_SIZE, 0);
        ctx.lineTo(i * canvas.width / GRID_SIZE, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * canvas.height / GRID_SIZE);
        ctx.lineTo(canvas.width, i * canvas.height / GRID_SIZE);
        ctx.stroke();
    }
    ctx.restore();

    // Draw purple squares for each second (simulate your screenshots)
    const SQUARES_BY_SECOND = [
        // t=0
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13}
        ],
        // t=1
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13},
            {x: 6, y: 5}, {x: 8, y: 6}
        ],
        // t=2
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13},
            {x: 6, y: 5}, {x: 8, y: 6}, {x: 11, y: 7}, {x: 13, y: 11}
        ],
        // t=3
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13},
            {x: 6, y: 5}, {x: 8, y: 6}, {x: 11, y: 7}, {x: 13, y: 11},
            {x: 4, y: 10}, {x: 1, y: 13}
        ],
        // t=4
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13},
            {x: 6, y: 5}, {x: 8, y: 6}, {x: 11, y: 7}, {x: 13, y: 11},
            {x: 4, y: 10}, {x: 1, y: 13}, {x: 14, y: 7}
        ],
        // t=5
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13},
            {x: 6, y: 5}, {x: 8, y: 6}, {x: 11, y: 7}, {x: 13, y: 11},
            {x: 4, y: 10}, {x: 1, y: 13}, {x: 14, y: 7}, {x: 7, y: 3}
        ],
        // t=6
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13},
            {x: 6, y: 5}, {x: 8, y: 6}, {x: 11, y: 7}, {x: 13, y: 11},
            {x: 4, y: 10}, {x: 1, y: 13}, {x: 14, y: 7}, {x: 7, y: 3},
            {x: 0, y: 14}
        ],
        // t=7
        [
            {x: 2, y: 2}, {x: 5, y: 1}, {x: 10, y: 0}, {x: 13, y: 2},
            {x: 3, y: 8}, {x: 7, y: 10}, {x: 12, y: 9}, {x: 9, y: 13},
            {x: 6, y: 5}, {x: 8, y: 6}, {x: 11, y: 7}, {x: 13, y: 11},
            {x: 4, y: 10}, {x: 1, y: 13}, {x: 14, y: 7}, {x: 7, y: 3},
            {x: 0, y: 14}, {x: 14, y: 14}
        ]
    ];
    const SQUARE_SIZE = 48;
    const squares = SQUARES_BY_SECOND[Math.min(sec, SQUARES_BY_SECOND.length - 1)];
    ctx.save();
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#6c4ee6";
    for (let sq of squares) {
        ctx.fillRect(
            sq.x * canvas.width / GRID_SIZE,
            sq.y * canvas.height / GRID_SIZE,
            SQUARE_SIZE, SQUARE_SIZE
        );
    }
    ctx.restore();
}

function updateUI() {
    // Time display
    const min = Math.floor(currentTime / 60);
    const sec = Math.floor(currentTime % 60);
    timeDisplay.textContent = `${min}:${sec.toString().padStart(2, '0')} / 0:07`;
    // Progress bar
    progress.style.width = `${(currentTime / DURATION) * 100}%`;
}

function render() {
    drawFrame(Math.floor(currentTime));
    updateUI();
}

function animate() {
    if (playing) {
        currentTime += (1 / 60) * speed;
        if (currentTime > DURATION) {
            currentTime = DURATION;
            playing = false;
            playIcon.style.display = '';
            pauseIcon.style.display = 'none';
        }
        render();
        animationFrame = requestAnimationFrame(animate);
    }
}

playBtn.onclick = function() {
    if (playing) {
        playing = false;
        cancelAnimationFrame(animationFrame);
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
    } else {
        playing = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = '';
        animationFrame = requestAnimationFrame(animate);
    }
};

rewindBtn.onclick = function() {
    currentTime = Math.max(0, currentTime - 10);
    render();
};
forwardBtn.onclick = function() {
    currentTime = Math.min(DURATION, currentTime + 10);
    render();
};

timeline.onclick = function(e) {
    const rect = timeline.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    currentTime = pct * DURATION;
    render();
};

muteBtn.onclick = function() {
    muted = !muted;
    volumeIcon.style.display = muted ? "none" : "";
    mutedIcon.style.display = muted ? "" : "none";
};

speedBtn.onclick = function(e) {
    e.stopPropagation();
    speedMenu.classList.toggle('open');
    settingsMenu.classList.remove('open');
};
speedMenu.querySelectorAll('div').forEach(div => {
    div.onclick = function(e) {
        speedMenu.querySelectorAll('div').forEach(d => d.classList.remove('selected'));
        this.classList.add('selected');
        speed = parseFloat(this.dataset.speed);
        speedLabel.textContent = this.dataset.speed + "x";
        speedMenu.classList.remove('open');
    };
});

settingsBtn.onclick = function(e) {
    e.stopPropagation();
    settingsMenu.classList.toggle('open');
    speedMenu.classList.remove('open');
};
settingsSpeed.onclick = function(e) {
    e.stopPropagation();
    settingsMenu.classList.remove('open');
    speedMenu.classList.add('open');
};

fullscreenBtn.onclick = function() {
    const area = document.getElementById('videoArea');
    if (!document.fullscreenElement) {
        area.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

document.body.onclick = function(e) {
    speedMenu.classList.remove('open');
    settingsMenu.classList.remove('open');
};

speedMenu.onclick = function(e) { e.stopPropagation(); };
settingsMenu.onclick = function(e) { e.stopPropagation(); };

window.onload = function() {
    render();
    updateUI();
};