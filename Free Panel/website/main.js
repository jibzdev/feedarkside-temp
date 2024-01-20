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

function timer(){
    const submitButton = document.querySelector("#sButton");
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
}

function submit() {
    let submitButton = document.querySelector("#sButton");

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
        } else {
            let dropdownValue = document.querySelector("#tools").value;
            let link = document.querySelector("input").value;
            let platform;
            let header_title = document.querySelector("#header-title");
            let headerL = header_title.textContent.toLowerCase();
            if (headerL.includes("tiktok")) {
                platform = "tiktok";
            } else if (headerL.includes("youtube")) {
                platform = "youtube";
                if (dropdownValue === "followers") {
                    dropdownValue = "subscribers";
                }
            } else {
                platform = "instagram";
            }

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
                    header.innerHTML = `
                    <i class="fa-solid fa-circle-check fade" style="font-size: 6vh; color: green;"></i>
                    <h1 class="fade" style="font-size: 4vh;">Request Sent</h1>`;
                    localStorage.setItem('savedTime', Date.now());
                    startTimer(180);
                } else {
                    header.innerHTML = `
                    <i class="fa-solid fa-circle-xmark fade" style="font-size: 6vh; color: red;"></i>
                    <h1 class="fade" style="font-size: 4vh;">Bad Request</h1>
                    <p>Try again. (${response.status} - ${response.statusText})</p>
                    `;
                }
            })
            .catch(error => {
                header.innerHTML = `
                <i class="fa-solid fa-circle-xmark fade" style="font-size: 6vh; color: red;"></i>
                <h1 class="fade" style="font-size: 4vh;">Bad Request</h1>
                <p>Try again. (${error})</p>
                `;
            });
        }
    });
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
        function generateServiceSection(iconClass, serviceName, inputId, serviceOptions) {
            let optionsHTML = serviceOptions.map(option => `<option value="${option.toLowerCase()}">${option}</option>`).join('');
    
            header.innerHTML = `
                <i class="fa-brands ${iconClass} fade" style="font-size: 4vh"></i>
                <h1 id="header-title" class="fade" style="margin-top: 5px;">${serviceName} Service</h1>
                <p class="fade" style="margin-top:-18px;font-family: 'Inter';font-size:1.5vh;">Enter a link, Free Panel will provide a random value.</p>
                <br>
                <select name="tools" id="tools" class="fade">
                    ${optionsHTML}
                </select>
                <br><br>
                <input placeholder="Enter Link" class="fade" id="${inputId}" name="link">
                <br><br>
                <button id="sButton" class="fade">Submit</button>
            `;
            timer();
            submit();
        }
    
        tiktok.addEventListener("click", () => {
            const tiktokOptions = ["Views", "Likes"];
            generateServiceSection("fa-tiktok", "TikTok", "tiktokInput", tiktokOptions);
        });
    
        instagram.addEventListener("click", () => {
            const instagramOptions = ["Followers", "Likes", "Comments"];
            generateServiceSection("fa-instagram", "Instagram", "instagramInput", instagramOptions);
        });
    
        youtube.addEventListener("click", () => {
            const youtubeOptions = ["Subscribers", "Views", "Likes"];
            generateServiceSection("fa-youtube", "Youtube", "youtubeInput", youtubeOptions);
        });
    });
});

console.log("Script loaded!");
