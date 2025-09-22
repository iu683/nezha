// visitor.js
(function () {
    // 检测设备
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // 插入样式
    const style = document.createElement("style");
    style.textContent = `
    /* 桌面小窗 */
    .visitor-box {
        display: none;
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 320px;
        padding: 15px;
        border-radius: 12px;
        background: rgba(255,255,255,0.65);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #111;
        z-index: 900;
        transform: scale(0.8);
        opacity: 0;
        transition: all 0.3s ease;
    }
    .visitor-box.show {
        display: block;
        transform: scale(1);
        opacity: 1;
    }
    .visitor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        margin-bottom: 8px;
    }
    .visitor-close {
        cursor: pointer;
        font-size: 16px;
        color: #666;
    }
    .visitor-close:hover {
        color: #000;
    }
    /* 桌面按钮 */
    .visitor-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.65);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 22px;
        cursor: pointer;
        z-index: 950;
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        transition: transform 0.2s, background 0.3s;
    }
    .visitor-btn:hover {
        transform: scale(1.1);
        background: rgba(255, 255, 255, 0.8);
    }
    /* 移动端卡片 */
    #visitor-mobile { 
        display: none;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 12px;
        padding: 15px;
        margin: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: #111;
    }`;
    document.head.appendChild(style);

    // 桌面小窗
    const box = document.createElement("div");
    box.id = "visitor-box";
    box.className = "visitor-box";
    box.innerHTML = `
        <div class="visitor-header">
            <span>🗺️ 访客信息</span>
            <span id="visitor-close" class="visitor-close">✖</span>
        </div>
        <p><strong>Country:</strong> <span id="visitor-country">Loading...</span></p>
        <p><strong>Date:</strong> <span id="visitor-date"></span></p>
        <p><strong>System:</strong> <span id="visitor-os"></span></p>
        <p><strong>Browser:</strong> <span id="visitor-browser"></span></p>
        <p><strong>IP:</strong> <span id="visitor-ip">Loading...</span></p>
        <p><strong>ASN:</strong> <span id="visitor-asn">Loading...</span></p>
    `;
    document.body.appendChild(box);

    // 桌面按钮
    const btn = document.createElement("div");
    btn.id = "visitor-btn";
    btn.className = "visitor-btn";
    btn.textContent = "🗺️";
    document.body.appendChild(btn);

    // 移动端卡片
    const mobileBox = document.createElement("div");
    mobileBox.id = "visitor-mobile";
    mobileBox.innerHTML = `
        <p><strong>Country:</strong> <span id="mobile-country">Loading...</span></p>
        <p><strong>Date:</strong> <span id="mobile-date"></span></p>
        <p><strong>System:</strong> <span id="mobile-os"></span></p>
        <p><strong>Browser:</strong> <span id="mobile-browser"></span></p>
        <p><strong>IP:</strong> <span id="mobile-ip">Loading...</span></p>
        <p><strong>ASN:</strong> <span id="mobile-asn">Loading...</span></p>
    `;
    document.body.appendChild(mobileBox);

    // 桌面/移动端切换
    if (!isMobile) {
        btn.style.display = "flex";
        btn.addEventListener("click", () => box.classList.toggle("show"));
        document.getElementById("visitor-close").addEventListener("click", () => box.classList.remove("show"));
    } else {
        btn.style.display = "none";
        box.style.display = "none";
        mobileBox.style.display = "block";
    }

    // 日期
    function formatDate() {
        const now = new Date();
        const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        return now.toLocaleDateString("zh-CN", options);
    }

    // 系统 & 浏览器
    function getSystemInfo() {
        const ua = navigator.userAgent;
        let os = "Unknown OS";
        if (ua.indexOf("Windows NT 10.0") !== -1) os = "Windows 10/11 64-bit";
        else if (/Mac OS X/.test(ua)) os = "macOS";
        else if (/Linux/.test(ua)) os = "Linux";
        else if (/Android/.test(ua)) os = "Android";
        else if (/iPhone|iPad/.test(ua)) os = "iOS";

        let browser = "Unknown Browser";
        if (ua.indexOf("Edg/") !== -1) browser = "Edge " + ua.match(/Edg\/([\d\.]+)/)[1];
        else if (ua.indexOf("Firefox/") !== -1) browser = "Firefox " + ua.match(/Firefox\/([\d\.]+)/)[1];
        else if (ua.indexOf("Chrome/") !== -1) browser = "Chrome " + ua.match(/Chrome\/([\d\.]+)/)[1];
        else if (ua.indexOf("Safari/") !== -1) browser = "Safari";

        return { os, browser };
    }

    // 国家代码转国旗
    function getFlagEmoji(countryCode) {
        if (!countryCode) return "🏳️";
        return countryCode.toUpperCase().replace(/./g, char => 
            String.fromCodePoint(127397 + char.charCodeAt())
        );
    }

    // 填充基础数据
    const { os, browser } = getSystemInfo();
    document.getElementById("visitor-date").innerText = formatDate();
    document.getElementById("visitor-os").innerText = os;
    document.getElementById("visitor-browser").innerText = browser;
    document.getElementById("mobile-date").innerText = formatDate();
    document.getElementById("mobile-os").innerText = os;
    document.getElementById("mobile-browser").innerText = browser;

    // 获取 IP / ASN
    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(data => {
            const flag = getFlagEmoji(data.country);
            const country = `${flag} ${data.country_name} (${data.country})`;
            const ip = data.ip;
            const asn = data.org || "N/A";

            document.getElementById("visitor-country").innerText = country;
            document.getElementById("visitor-ip").innerText = ip;
            document.getElementById("visitor-asn").innerText = asn;

            document.getElementById("mobile-country").innerText = country;
            document.getElementById("mobile-ip").innerText = ip;
            document.getElementById("mobile-asn").innerText = asn;
        })
        .catch(err => console.error("IP API error:", err));
})();
