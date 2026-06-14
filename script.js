/*==================== SHOW MENU ====================*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*==================== CHANGE BACKGROUND HEADER ====================*/
function scrollHeader(){
    const nav = document.getElementById('header')
    if(this.scrollY >= 80) nav.classList.add('scroll-header'); else nav.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*==================== SHOW SCROLL UP ====================*/
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    if(this.scrollY >= 560) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'ri-sun-line'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () => document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line'

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*==================== BGM CONTROL ====================*/
const bgmBtn = document.getElementById('bgm-button')
const bgmAudio = document.getElementById('site-bgm')

if(bgmBtn && bgmAudio) {
    const updateBgmIcon = () => {
        bgmBtn.classList.toggle('ri-music-fill', !bgmAudio.paused)
        bgmBtn.classList.toggle('ri-music-2-line', bgmAudio.paused)
    }

    bgmBtn.onclick = () => {
        if(bgmAudio.paused) {
            bgmAudio.play().catch(e => console.log("BGM Play Error: ", e))
        } else {
            bgmAudio.pause()
        }
    }

    // 오디오의 실제 재생 상태를 항상 아이콘에 반영 (재생 실패 시에도 아이콘이 어긋나지 않도록)
    bgmAudio.addEventListener('play', updateBgmIcon)
    bgmAudio.addEventListener('pause', updateBgmIcon)
    updateBgmIcon()
}

/*==================== CHATBOT ====================*/
const chatbotToggle = document.getElementById('chatbot-toggle')
const chatbotContainer = document.getElementById('chatbot-container')
const chatClose = document.getElementById('chat-close')
const sendBtn = document.getElementById('send-btn')
const chatInput = document.getElementById('chat-input-field')
const chatBody = document.getElementById('chat-body')

if(chatbotToggle) {
    chatbotToggle.onclick = () => {
        chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
    };
}

if(chatClose) {
    chatClose.onclick = () => {
        chatbotContainer.style.display = 'none';
    };
}

function sendChatMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    const userMsg = document.createElement('div');
    userMsg.className = 'user-message';
    userMsg.innerText = text;
    chatBody.appendChild(userMsg);

    chatInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    getBotResponse(text);
}

function getBotResponse(text) {
    const botMsg = document.createElement('div');
    botMsg.className = 'bot-message';

    if (text.includes("안녕") || text.includes("하이") || text.includes("반가워")) {
        botMsg.innerText = "안녕하세요! (주) 비에이텍입니다. 무엇을 도와드릴까요?";
    } else if (text.includes("펌프") || text.includes("제품") || text.includes("장비")) {
        botMsg.innerText = "저희 비에이텍은 다단볼루트펌프, 편흡입볼루트펌프, 원심펌프 등 산업용 핵심 펌프를 전문 제조합니다. 상세 사양은 '장비소개' 메뉴를 확인해 주세요.";
    } else if (text.includes("견적") || text.includes("가격") || text.includes("주문")) {
        botMsg.innerText = "제품 견적 및 주문 문의는 033-264-9243으로 전화 주시거나, '고객문의' 메뉴를 통해 메시지를 남겨주시면 신속히 답변 드리겠습니다.";
    } else if (text.includes("AS") || text.includes("수리") || text.includes("유지보수") || text.includes("관리")) {
        botMsg.innerText = "비에이텍은 철저한 사후관리를 보장합니다. 수리 및 점검이 필요하시면 고객센터(033-264-9243)로 연락 부탁드립니다.";
    } else if (text.includes("위치") || text.includes("어디") || text.includes("주소") || text.includes("공장")) {
        botMsg.innerText = "본사 및 공장은 [강원 춘천시 퇴계공단2길 64]에 위치하고 있습니다. '오시는 길' 메뉴에서 지도를 확인하실 수 있습니다.";
    } else if (text.includes("기술") || text.includes("특징") || text.includes("인증")) {
        botMsg.innerText = "비에이텍은 20년 이상의 노하우와 ISO9001, KC인증, MAIN-BIZ 인증 등을 보유한 검증된 기술력을 자랑합니다.";
    } else if (text.includes("연락처") || text.includes("전화") || text.includes("메일")) {
        botMsg.innerText = "대표전화: 033-264-9243 / 이메일: info@batech.co.kr 입니다. 상담 시간은 평일 오전 9시부터 오후 6시까지입니다.";
    } else {
        botMsg.innerText = "죄송합니다. 질문하신 내용을 정확히 이해하지 못했습니다. 자세한 문의는 고객센터(033-264-9243)로 연락 주시면 상세히 안내해 드리겠습니다.";
    }

    setTimeout(() => {
        chatBody.appendChild(botMsg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
}

if(sendBtn) sendBtn.onclick = sendChatMessage;
if(chatInput) {
    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter') sendChatMessage();
    };
}

/*==================== AD MODAL ====================*/
function closeAdModal() {
    const adModal = document.getElementById('ad-modal');
    const adVideo = document.getElementById('ad-video');
    if (adModal) adModal.style.display = 'none';
    if (adVideo) {
        adVideo.pause();
        adVideo.currentTime = 0;
    }
}

window.onload = () => {
    const dontShow = localStorage.getItem('dontShowAdToday');
    const today = new Date().toDateString();
    
    if (dontShow !== today) {
        setTimeout(() => {
            const adModal = document.getElementById('ad-modal');
            const adVideo = document.getElementById('ad-video');
            if(adModal) adModal.style.display = 'flex';
            if(adVideo) {
                // 음소거 해제 상태로 자동재생 시도
                adVideo.muted = false;
                adVideo.play().catch(() => {
                    // 브라우저 정책상 소리 있는 자동재생이 차단되면, 음소거 상태로라도 자동재생되도록 함
                    adVideo.muted = true;
                    adVideo.play().catch(e => console.log("Ad Video Play Error: ", e));
                });
            }
        }, 1500);
    }
};

document.getElementById('ad-dont-show-today')?.addEventListener('change', (e) => {
    if(e.target.checked) {
        localStorage.setItem('dontShowAdToday', new Date().toDateString());
    }
});

/*==================== LIGHTBOX ====================*/
function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if(lightbox && lightboxImg) {
        lightbox.style.display = 'flex';
        lightboxImg.src = src;
    }
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
}

/*==================== PDF MODAL ====================*/
function openPDF(src) {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-iframe');
    if(modal && iframe) {
        modal.style.display = 'flex';
        iframe.src = src;
    }
}

function closePDF() {
    document.getElementById('pdf-modal').style.display = 'none';
}

/*==================== BROCHURE FLIPBOOK ====================*/
let pageFlip = null;

function openBrochure() {
    const modal = document.getElementById('brochure-modal');
    if (!modal) return;

    modal.style.display = 'flex';

    // Initialize PageFlip ONLY if it hasn't been initialized yet
    if (!pageFlip) {
        const flipbookEl = document.getElementById("brochure-flipbook");
        if (flipbookEl) {
            try {
                // Dynamically calculate the optimal size based on screen size
                // Try to use about 75% of viewport height to leave room for UI, maintaining approx A4 aspect ratio
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                let bookHeight = Math.min(800, windowHeight * 0.75); 
                let bookWidth = bookHeight / 1.414; // Standard A4 aspect ratio

                // For double page spread, width is 2 * bookWidth.
                // If the spread exceeds 90% of screen width, scale down based on width instead
                if (bookWidth * 2 > windowWidth * 0.9) {
                    bookWidth = (windowWidth * 0.9) / 2;
                    bookHeight = bookWidth * 1.414;
                }

                // Enforce reasonable minimum size
                if (bookWidth < 280) {
                    bookWidth = 280;
                    bookHeight = 396;
                }

                // Round variables to integers for the library
                bookWidth = Math.round(bookWidth);
                bookHeight = Math.round(bookHeight);

                pageFlip = new St.PageFlip(flipbookEl, {
                    width: bookWidth,
                    height: bookHeight,
                    size: "fixed", // Use "fixed" to strictly enforce our dynamically computed maximum dimensions without squishing
                    minWidth: 200,
                    maxWidth: 800,
                    minHeight: 300,
                    maxHeight: 1130,
                    drawShadow: true,
                    showCover: true,
                    usePortrait: true,
                    mobileScrollSupport: false // To avoid conflict with flip gestures on touch
                });

                const pageElements = flipbookEl.querySelectorAll('.page');
                pageFlip.loadFromHTML(pageElements);

                const pageInfo = document.getElementById('brochure-page-info');
                
                // Update initial state
                if(pageInfo) {
                     pageInfo.innerText = `1 / ${pageElements.length}`;
                }

                // Handle page flip event to update counter
                pageFlip.on('flip', (e) => {
                    if (pageInfo) {
                        const currentPage = e.data + 1;
                        const totalPages = pageFlip.getPageCount();
                        pageInfo.innerText = `${currentPage} / ${totalPages}`;
                    }
                });

                // Prev/Next Handlers
                const prevBtn = document.getElementById('brochure-prev');
                const nextBtn = document.getElementById('brochure-next');

                if (prevBtn) {
                    prevBtn.onclick = () => {
                        pageFlip.flipPrev();
                    };
                }
                if (nextBtn) {
                    nextBtn.onclick = () => {
                        pageFlip.flipNext();
                    };
                }
            } catch (error) {
                console.error("Error initializing St.PageFlip: ", error);
            }
        }
    }
}

function closeBrochure() {
    const modal = document.getElementById('brochure-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/*==================== CARD NEWS SLIDER ====================*/
const track = document.getElementById('card-news-track');
const prevBtn = document.getElementById('card-prev');
const nextBtn = document.getElementById('card-next');
const dotsContainer = document.getElementById('slider-dots');

if (track) {
    const items = Array.from(track.children);
    let currentIndex = 0;
    let autoPlayInterval;

    // 1. Generate dots dynamically
    if (dotsContainer) {
        items.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i);
                resetAutoPlay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

    // 2. Functions to update slide
    function updateSlider() {
        // Apply transform based on current index
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active dot class
        if (dots.length > 0) {
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateSlider();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateSlider();
    }

    // 3. Bind Button Events
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // 4. Auto Play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 4000); // Slide every 4 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Initialize Auto Play
    startAutoPlay();

    // Pause autoplay on mouse over for better reading experience
    const sliderWrapper = track.parentElement;
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoPlay);
        sliderWrapper.addEventListener('mouseleave', startAutoPlay);
    }
}

/*==================== QUOTE ESTIMATOR (equipment.html) ====================*/
const QUOTE_BASE_PRICES = {
    multi_volute: { name: '다단볼루트펌프', price: 4500000 },
    single_volute: { name: '편흡입볼루트펌프', price: 3200000 },
    centrifugal: { name: '원심펌프', price: 2800000 },
    booster: { name: '부스터펌프', price: 2200000 },
    submersible: { name: '수중펌프', price: 1800000 },
    sludge: { name: '슬러지펌프', price: 4800000 },
    mono: { name: '일축나사식 모노펌프', price: 3800000 },
    dosing: { name: '정량펌프', price: 1500000 }
};

const QUOTE_MATERIAL_MULTIPLIERS = {
    cast_iron: { name: '주철 (FC)', multiplier: 1.0 },
    sus304: { name: 'SUS304', multiplier: 1.15 },
    sus316: { name: 'SUS316', multiplier: 1.35 }
};

(function setupQuoteEstimator() {
    const calcBtn = document.getElementById('qe-calc-btn');
    const resultBox = document.getElementById('qe-result');
    if (!calcBtn || !resultBox) return;

    calcBtn.addEventListener('click', () => {
        const productKey = document.getElementById('qe-product').value;
        const capacity = parseFloat(document.getElementById('qe-capacity').value);
        const head = parseFloat(document.getElementById('qe-head').value);
        const materialKey = document.getElementById('qe-material').value;
        const qty = parseInt(document.getElementById('qe-qty').value, 10);

        const product = QUOTE_BASE_PRICES[productKey];
        const material = QUOTE_MATERIAL_MULTIPLIERS[materialKey];

        if (!product || !material || !(capacity > 0) || !(head > 0) || !(qty > 0)) {
            resultBox.classList.remove('active');
            alert('토출량, 전양정, 수량을 올바르게 입력해 주세요.');
            return;
        }

        const capacityFactor = Math.pow(capacity / 1, 0.65);
        const headFactor = Math.pow(head / 20, 0.5);

        let qtyDiscount = 1.0;
        if (qty >= 10) qtyDiscount = 0.88;
        else if (qty >= 5) qtyDiscount = 0.93;
        else if (qty >= 2) qtyDiscount = 0.97;

        const unitPrice = product.price * capacityFactor * headFactor * material.multiplier;
        const totalPrice = unitPrice * qty * qtyDiscount;

        // 1만원 단위로 반올림 후 ±10% 예상 범위 표시
        const rounded = Math.round(totalPrice / 10000) * 10000;
        const lowEnd = Math.round(rounded * 0.9 / 10000) * 10000;
        const highEnd = Math.round(rounded * 1.1 / 10000) * 10000;

        resultBox.innerHTML = `
            <div class="quote-estimator__result-label">
                ${product.name} · 토출량 ${capacity} m³/min · 전양정 ${head} m · ${material.name} · ${qty}대
            </div>
            <div class="quote-estimator__result-price">
                ${lowEnd.toLocaleString('ko-KR')}원 ~ ${highEnd.toLocaleString('ko-KR')}원
            </div>
            <div class="quote-estimator__result-note">
                * 위 금액은 입력하신 사양을 기준으로 한 예상 견적이며, 부가세 및 설치비는 별도입니다.<br>
                정확한 견적서는 영업팀과의 상담을 통해 확인하실 수 있습니다.
            </div>
            <a href="contact.html" class="quote-estimator__result-cta">
                <i class="ri-mail-send-line"></i> 정식 견적 문의하기
            </a>
        `;
        resultBox.classList.add('active');
    });
})();

/*==================== QUICK NAVIGATION (TOC) ====================*/
(function setupQuickNav() {
    const quickNavLinks = document.querySelectorAll('.quick-nav__link');
    if (quickNavLinks.length === 0) return;

    const targetSections = [];
    quickNavLinks.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        const section = document.getElementById(id);
        if (section) targetSections.push({ id, section, link });
    });

    function setActiveQuickNavLink() {
        const scrollY = window.pageYOffset;
        let currentId = null;

        targetSections.forEach(({ id, section }) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentId = id;
            }
        });

        targetSections.forEach(({ id, link }) => {
            link.classList.toggle('active-link', id === currentId);
        });
    }

    window.addEventListener('scroll', setActiveQuickNavLink);
    setActiveQuickNavLink();
})();

/*==================== CONTACT FORM (문의 접수) ====================*/
// gas_script.js를 Google Apps Script에 웹 앱으로 배포한 후 발급받은 URL로 교체하세요.
const GAS_CONTACT_URL = 'https://script.google.com/macros/s/AKfycbxAZCEegKu3xGGdr03Jay6WzUeRzIU-RwiHDuUMRvWTuYmtKbbGOriQGwlWXMpQQho17w/exec';

const CONTACT_TYPE_LABELS = {
    '견적문의': '견적 문의',
    'AS접수': 'A/S 접수 및 기술 상담',
    '카탈로그요청': '제품 카탈로그 요청',
    '기타': '기타 문의'
};

(function setupContactForm() {
    const form = document.getElementById('contact-form');
    const statusBox = document.getElementById('contact-status');
    const submitBtn = document.getElementById('contact-submit');
    if (!form || !statusBox) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const inquiryType = document.getElementById('inquiry_type').value;
        const userName = document.getElementById('user_name').value.trim();
        const userPhone = document.getElementById('user_phone').value.trim();
        const userEmail = document.getElementById('user_email').value.trim();
        const userMessage = document.getElementById('user_message').value.trim();

        // 1) 문의 내용을 employee.html 포털에서 확인할 수 있도록 localStorage에 저장
        const now = new Date();
        const pad = (n) => String(n).padStart(2, '0');
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

        const newInquiry = {
            id: 'inq_' + Date.now(),
            type: inquiryType,
            name: userName,
            phone: userPhone,
            email: userEmail,
            message: userMessage,
            date: dateStr,
            status: '대기중',
            reply: ''
        };

        let inquiries = [];
        try {
            inquiries = JSON.parse(localStorage.getItem('batech_inquiries')) || [];
        } catch (err) {
            inquiries = [];
        }
        inquiries.unshift(newInquiry);
        localStorage.setItem('batech_inquiries', JSON.stringify(inquiries));

        // 2) 화면에 접수 완료 메시지 표시
        statusBox.textContent = '문의가 정상적으로 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.';
        statusBox.classList.remove('error');
        statusBox.classList.add('success');

        if (submitBtn) submitBtn.disabled = true;

        // 3) 입력한 이메일로 접수 확인 메일 발송 (Google Apps Script)
        const typeLabel = CONTACT_TYPE_LABELS[inquiryType] || inquiryType;
        const htmlBody = `
            <p>${userName}님, 안녕하십니까. (주)비에이텍입니다.</p>
            <p>아래와 같이 문의가 정상적으로 접수되었습니다. 담당자 확인 후 빠른 시일 내에 답변 드리겠습니다.</p>
            <hr>
            <p><strong>문의 유형:</strong> ${typeLabel}</p>
            <p><strong>접수 일시:</strong> ${dateStr}</p>
            <p><strong>연락처:</strong> ${userPhone}</p>
            <p><strong>문의 내용:</strong><br>${userMessage.replace(/\n/g, '<br>')}</p>
            <hr>
            <p>감사합니다.<br>(주)비에이텍 고객지원팀 드림</p>
        `;

        if (GAS_CONTACT_URL && GAS_CONTACT_URL.indexOf('YOUR_') === -1) {
            fetch(GAS_CONTACT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    to_email: userEmail,
                    subject: '[(주)비에이텍] 문의가 접수되었습니다.',
                    html_body: htmlBody
                })
            }).catch((err) => {
                console.error('Contact confirmation email error:', err);
            });
        }

        // 4) 폼 초기화
        form.reset();
        if (submitBtn) {
            setTimeout(() => { submitBtn.disabled = false; }, 1500);
        }
    });
})();

