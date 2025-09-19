<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>音乐小球播放器</title>
<style>
#music-ball {
    position: fixed;
    bottom: 50px;
    left: 50px;
    width: 45px;   /* 桌面端小点 */
    height: 45px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2); /* 半透明背景 */
    backdrop-filter: blur(12px);          /* 毛玻璃 */
    -webkit-backdrop-filter: blur(12px);  /* 兼容 Safari */
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    cursor: pointer;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s, background 0.3s;
    overflow: hidden; /* 封面裁剪为圆形 */
}
#music-ball:hover {
    transform: scale(1.1);  /* 鼠标移上去稍微放大 */
}

@keyframes rotate { 
  0% { transform: rotate(0deg);} 
  100% { transform: rotate(360deg);} 
}
.rotating { animation: rotate 5s linear infinite; }

#music-controls {
    position: fixed;
    display: none;
    flex-direction: column;
    align-items: center;
    background: rgba(255,255,255,0.2);
    padding: 12px 16px;
    border-radius: 16px;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    z-index: 9999;
    max-width: 80%;
    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

#music-controls button {
    background: rgba(255,255,255,0.15);
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 20px;
    margin: 5px;
    padding: 6px 10px;
    border-radius: 10px;
    transition: background 0.2s;
}
#music-controls button:hover {
    background: rgba(255,255,255,0.3);
}

#music-info {
    color: #000; /* 改成黑色 */
    font-size: 14px;
    margin-top: 4px;
    text-align: center;
    word-break: break-word;
}

#progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.3);
    margin-top: 8px;
    border-radius: 2px;
    overflow: hidden;
}
#progress {
    width: 0%;
    height: 100%;
    background: #4caf50;
    border-radius: 2px;
}

#lyrics {
    max-height: 100px;
    overflow-y: auto;
    color: #FFA500;
    font-size: 12px;
    margin-top: 8px;
    text-align: center;
    line-height: 1.4;
}

/* 移动端保持 50px */
@media (max-width: 768px) {
    #music-ball { width: 50px; height: 50px; }
    #music-controls button { font-size: 18px; margin: 4px; }
    #music-info { font-size: 12px; }
    #lyrics { font-size: 10px; max-height: 80px; }
}
</style>
</head>
<body>

<div id="music-ball"></div>
<div id="music-controls">
    <div>
        <button id="prev">⏮️</button>
        <button id="play-pause">▶️</button>
        <button id="next">⏭️</button>
    </div>
    <div id="music-info">加载中...</div>
    <div id="progress-bar"><div id="progress"></div></div>
    <div id="lyrics">歌词加载中...</div>
</div>

<script>
const songs = [
  { "name": "青花瓷", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.4/青花瓷/青花瓷.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000002eFUFm2XYZ7z_2.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.4/青花瓷/青花瓷.lrc" },
  { "name": "稻香", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.1/周杰伦/稻香/稻香.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000002Neh8l0uciQZ_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.1/周杰伦/稻香/稻香.lrc" },
  { "name": "晴天", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/晴天/晴天.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000000MkMni19ClKG_3.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/晴天/晴天.lrc" },
  { "name": "七里香", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/七里香/七里香.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000003DFRzD192KKD_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/七里香/七里香.lrc" },
  { "name": "花海", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/花海/花海.flac", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000002Neh8l0uciQZ_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/花海/花海.lrc" },
  { "name": "反方向的钟", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/反方向的钟/反方向的钟.flac", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000000f01724fd7TH_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/反方向的钟/反方向的钟.lrc" },
  { "name": "兰亭序", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.1/周杰伦/兰亭序/兰亭序.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000002Neh8l0uciQZ_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.1/周杰伦/兰亭序/兰亭序.lrc" },
  { "name": "说好的辛福呢", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/说好的辛福呢/说好的辛福呢.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000002Neh8l0uciQZ_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/说好的辛福呢/说好的幸福呢.lrc" },
  { "name": "等你下课 (with 杨瑞代)", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.1/周杰伦/等你下课/等你下课.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000003bSL0v4bpKAx_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.1/周杰伦/等你下课/等你下课.lrc" },
  { "name": "我落泪情绪零碎", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/我落泪情绪零碎/我落泪情绪零碎.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000000bviBl4FjTpO_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/我落泪情绪零碎/我落泪情绪零碎.lrc" },
  { "name": "听妈妈的话", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/听妈妈的话/听妈妈的话.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000002jLGWe16Tf1H_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.2/听妈妈的话/听妈妈的话.lrc" },
  { "name": "明明就", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/明明就/明明就.flac", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000003Ow85E3pnoqi_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/明明就/明明就.lrc" },
  { "name": "我是如此相信", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/我是如此相信/我是如此相信.flac", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000001hGx1Z0so1YX_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music-jay@1.0.1/我是如此相信/我是如此相信.lrc" },
  { "name": "发如雪", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.3/发如雪/发如雪.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M0000024bjiL2aocxT_3.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.3/发如雪/发如雪.lrc" },
  { "name": "以父之名", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.3/以父之名/以父之名.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000000MkMni19ClKG_3.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.3/以父之名/以父之名.lrc" },
  { "name": "园游会", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.3/园游会/园游会.flac", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000003DFRzD192KKD_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.3/园游会/园游会.lrc" },
  { "name": "本草纲目", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.4/本草纲目/本草纲目.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000002jLGWe16Tf1H_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.4/本草纲目/本草纲目.lrc" },
  { "name": "龙卷风", "artist": "周杰伦", "url": "https://npm.elemecdn.com/anzhiyu-music@1.0.4/龙卷风/龙卷风.mp3", "cover": "https://y.qq.com/music/photo_new/T002R300x300M000000f01724fd7TH_1.jpg?max_age=2592000", "lrc": "https://npm.elemecdn.com/anzhiyu-music@1.0.4/龙卷风/龙卷风.lrc" }
];

let currentSongIndex = Math.floor(Math.random() * songs.length);
let audio = new Audio();
let isPlaying = false;
let hasInteracted = false;
let lyricsArr = [];

const ball = document.getElementById('music-ball');
const controls = document.getElementById('music-controls');
const info = document.getElementById('music-info');
const playBtn = document.getElementById('play-pause');
const progress = document.getElementById('progress');
const lyricsDiv = document.getElementById('lyrics');

// 加载歌词
async function loadLyrics(url) {
    try {
        const res = await fetch(url);
        const text = await res.text();
        lyricsArr = text.split('\n').map(line => {
            const match = line.match(/\[(\d+):(\d+)(?:\.(\d+))?\](.*)/);
            if(match) {
                return { time: parseInt(match[1])*60 + parseInt(match[2]) + (match[3]?parseInt(match[3])/1000:0), text: match[4] };
            } else return null;
        }).filter(Boolean);
    } catch(e) { lyricsArr=[]; console.log("歌词加载失败:", e); }
}

// 更新歌词显示
function updateLyrics() {
    if(!lyricsArr.length) { lyricsDiv.textContent="暂无歌词"; return; }
    const currentTime = audio.currentTime;
    let displayText = '';
    for(let i=0;i<lyricsArr.length;i++){
        if(currentTime>=lyricsArr[i].time) displayText = lyricsArr[i].text;
        else break;
    }
    lyricsDiv.textContent = displayText;
}

// 更新歌曲信息
function updateSong() {
    const defaultCover = "https://picsum.photos/200/200?random=99";
    const song = songs[currentSongIndex];
    info.textContent = song.name + " - " + song.artist;
    ball.style.background = `url('${song.cover || defaultCover}') center/cover no-repeat`;
    loadLyrics(song.lrc);
}

// 播放/暂停
async function playSong() {
    try { 
        audio.src = songs[currentSongIndex].url; 
        await audio.play(); 
        isPlaying=true; 
        playBtn.textContent="⏸️"; 
        ball.classList.add('rotating'); 
    } catch(e){ console.log(e); isPlaying=false; ball.classList.remove('rotating'); }
}
function pauseSong() { audio.pause(); isPlaying=false; playBtn.textContent="▶️"; ball.classList.remove('rotating'); }
function togglePlay(){ isPlaying ? pauseSong() : playSong(); }

// 上/下一首
async function nextSong(){ currentSongIndex=(currentSongIndex+1)%songs.length; updateSong(); await playSong(); }
async function prevSong(){ currentSongIndex=(currentSongIndex-1+songs.length)%songs.length; updateSong(); await playSong(); }

// 首次互动自动播放（移动端必须）
function firstInteraction(){ if(hasInteracted) return; hasInteracted=true; window.removeEventListener('click',firstInteraction); window.removeEventListener('keydown',firstInteraction); playSong(); }
window.addEventListener('click',firstInteraction,{once:true});
window.addEventListener('keydown',firstInteraction,{once:true});

// 控制面板显示
ball.addEventListener('click', () => {
    controls.style.display = controls.style.display==='flex'?'none':'flex';
    const rect = ball.getBoundingClientRect();
    controls.style.left = Math.min(rect.left, window.innerWidth-controls.offsetWidth)+'px';
    controls.style.top = Math.max(rect.top-controls.offsetHeight-10,10)+'px';
});

// 按钮事件
playBtn.addEventListener('click', togglePlay);
document.getElementById('next').addEventListener('click', nextSong);
document.getElementById('prev').addEventListener('click', prevSong);
audio.addEventListener('ended', nextSong);

// 拖动支持鼠标和触摸
let offsetX=0, offsetY=0, isDragging=false;
function startDrag(e){ isDragging=true; const clientX=e.touches?e.touches[0].clientX:e.clientX; const clientY=e.touches?e.touches[0].clientY:e.clientY; offsetX=clientX-ball.offsetLeft; offsetY=clientY-ball.offsetTop; }
function moveDrag(e){ if(!isDragging) return; const clientX=e.touches?e.touches[0].clientX:e.clientX; const clientY=e.touches?e.touches[0].clientY:e.clientY; let left=clientX-offsetX; let top=clientY-offsetY; left=Math.max(0,Math.min(window.innerWidth-ball.offsetWidth,left)); top=Math.max(0,Math.min(window.innerHeight-ball.offsetHeight,top)); ball.style.left=left+'px'; ball.style.top=top+'px'; ball.style.bottom='auto'; ball.style.right='auto'; if(controls.style.display==='flex'){ controls.style.left=Math.min(left,window.innerWidth-controls.offsetWidth)+'px'; controls.style.top=Math.max(top-controls.offsetHeight-10,10)+'px'; } }
function endDrag(){ isDragging=false; }
ball.addEventListener('mousedown', startDrag); ball.addEventListener('touchstart', startDrag,{passive:true});
document.addEventListener('mousemove', moveDrag); document.addEventListener('touchmove', moveDrag,{passive:false});
document.addEventListener('mouseup', endDrag); document.addEventListener('touchend', endDrag);

// 更新进度条和歌词
audio.addEventListener('timeupdate', () => {
    if(audio.duration) progress.style.width=(audio.currentTime/audio.duration*100)+'%';
    updateLyrics();
});

// 初始化并自动播放
updateSong();
playSong();
</script>
</body>
</html>
