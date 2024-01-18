function loadRecaptcha() {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;

    script.onload = function () {
        grecaptcha.render('recaptchaContainer', {
            'sitekey': '6LfzXlQpAAAAAEoeOeG3xa4GMhKzhhf4IfHvY3La',
            callback: onRecaptchaVerify,
        });
    };

    document.body.appendChild(script);
}

function onRecaptchaVerify(token) {
    const submitButton = document.getElementById('sButton');
    submitButton.disabled = false;
    submitButton.style.opacity = 1;
}

let timerExists = false;
let savedTime = localStorage.getItem("savedTime");
let timeLeft = savedTime ? Math.max(0, (180 - (Date.now() - savedTime) / 1000)) : 0;

function startTimer(duration) {
    let timer = duration, minutes, seconds;
    let display = document.querySelector('#timer');
    display.style.display = 'block';
    
    let intervalId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(intervalId);
            display.style.display = 'none';
            localStorage.removeItem('savedTime');
        }
    }, 1000);
}

window.addEventListener("load", () => {
    if (savedTime) {
        timeLeft = Math.max(0, 180 - (Date.now() - savedTime) / 1000);
        console.log(timeLeft);
        if (timeLeft > 0) {
            timerExists = true;
            startTimer(timeLeft);
        }
    }
});

function timer(){
    let submitButton = document.querySelector("#sButton");
    
    function startTimer(duration) {
        let timer = duration, minutes, seconds;
        let display = document.querySelector('#timer');
        display.style.display = 'block';
        let intervalId = setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
    
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
    
            display.textContent = minutes + ":" + seconds;
    
            if (--timer < 0) {
            clearInterval(intervalId);
            display.style.display = 'none';
            submitButton.disabled = false;
            submitButton.style.opacity = 1;
            localStorage.removeItem('savedTime');
            } else {
            submitButton.disabled = true;
            submitButton.style.opacity = 0.5;
            }
        }, 1000);
        }
        
    if (savedTime) {
        let timeLeft = (180000 - (Date.now() - savedTime)) / 1000;
        console.log(timeLeft);
        if (timeLeft > 0) {
        submitButton.disabled = true;
        submitButton.style.opacity = 0.5;
        startTimer(timeLeft);
        } else {
        submitButton.disabled = false;
        submitButton.style.opacity = 1;
        }
    }

    submitButton.addEventListener("click", () => {
        let inputField = document.querySelector("input");
        const linkRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    
        if (!linkRegex.test(inputField.value) || inputField.value === "") {
            let error = document.createElement("p");
            error.setAttribute("id", "error");
            error.setAttribute("class", "fade");
            error.textContent = "Invalid Link";
            error.style.color = "red";
            error.style.marginBottom = "-20px";
            inputField.parentNode.insertBefore(error, inputField.nextSibling);
            setTimeout(() => {
                error.remove();
            }, 2000);
        }else{            
            let dropdownValue = document.querySelector("#tools").value;
            let link = document.querySelector("input").value;
            localStorage.setItem('savedTime', Date.now());

            let platform;
            let sButton = document.querySelector("#sButton");
            let header_title = document.querySelector("#header-title");
            let headerL = header_title.textContent.toLowerCase();           
            if (headerL.includes("tiktok")) {
                platform = "tiktok";
            } else if (headerL.includes("youtube")) {
                platform = "youtube";
                if(dropdownValue === "followers"){
                    dropdownValue = "subscribers";
                }
            } else {
                platform = "instagram";
            }

            sButton.addEventListener("click",sendReq(platform,dropdownValue,link));
        }
    });
}


function sendReq(platform, dropdownValue, link, recaptchaToken) {
    let header = document.querySelector("#header");
    const value = `/${platform}/${dropdownValue}api?link=${link}`;
    fetch(value, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
    })
    .then(response => {
        if (response.ok) {
            console.log("Request Sent Successfully.");
            header.innerHTML = `
            <i class="fa-solid fa-circle-check fade" style="font-size: 6vh; color: green;"></i>
            <h1 class="fade" style="font-size: 4vh;">Request Sent</h1>`;
            startTimer(180);
        } else {
        }
    })
    .catch(error => {
        console.error("Error Sending Request.");
        header.innerHTML = `
        <i class="fa-solid fa-circle-xmark fade" style="font-size: 6vh; color: red;"></i>
        <h1 class="fade" style="font-size: 4vh;">Bad Request</h1>
        <p>Try again. (${error})</p>
        `;
    });
}



document.addEventListener("DOMContentLoaded", () => {
    let navbar = document.querySelector("#nav");
    let menuIcon = document.querySelector(".menu-icon");
    let header = document.querySelector("#header");

    let tiktok = document.querySelector("#tiktok");
    let instagram = document.querySelector("#instagram");
    let youtube = document.querySelector("#youtube");

    menuIcon.addEventListener("click", () => {
        menuIcon.classList.toggle("active");
    });

    menuIcon.addEventListener("click", () => {
        navbar.classList.toggle("open");
        if (navbar.classList.contains("open")) {
            navbar.style.width = "25%";
            navbar.style.opacity = 1;
        } else {
            navbar.style.width = "0";
            navbar.style.opacity = 0;
        }
        function generateServiceSection(iconClass, serviceName, inputId) {
            header.innerHTML = `
                <i class="fa-brands ${iconClass} fade" style="font-size: 4vh"></i>
                <h1 id="header-title" class="fade" style="margin-top: 5px;">${serviceName} Service</h1>
                <p class="fade" style="margin-top:-18px;font-family: 'Inter';font-size:1.5vh;">Enter a link, Free Panel will provide a random value.</p>
                <br>
                <select name="tools" id="tools" class="fade">
                    <option value="followers">Followers</option>
                    <option value="views">Views</option>
                    <option value="likes">Likes</option>
                </select>
                <br><br>
                <input placeholder="Enter Link" class="fade" id="${inputId}" name="link">
                <br><br>
                <button id="sButton" class="fade" style="opacity: 0.1;" disabled>Submit</button>
                <br><br>
                <div id="recaptchaContainer" class="fade" style="margin-left:15px;"></div>
            `;
            timer()
            loadRecaptcha();
        }
        
        tiktok.addEventListener("click", () => {
            generateServiceSection("fa-tiktok", "TikTok", "tiktokInput");
        });
        
        instagram.addEventListener("click", () => {
            generateServiceSection("fa-instagram", "Instagram", "instagramInput");
        });
        
        youtube.addEventListener("click", () => {
            generateServiceSection("fa-youtube", "Youtube", "youtubeInput");
        });
        
    });
});

console.log("Script loaded!");
