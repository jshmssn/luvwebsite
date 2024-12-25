function checkAndClearSession() {
    // console.log("session is removed");
    if (window.location.pathname.toLowerCase().endsWith('index.html')) {
        localStorage.removeItem('userSession');
        localStorage.removeItem('sessionTimestamp');
    }
}

// Run check on page load
checkAndClearSession();

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}
function nextSlide() {
    showSlide(currentSlide + 1);
}
function prevSlide() {
    showSlide(currentSlide - 1);
}

// Input functionality
const input = document.getElementById('codeInput');
const correctCode = '122424';

function appendNumber(number) {
    if (input.value.length < 6) {
        input.value += number;
        // Check if we've reached 6 digits
        if (input.value.length === 6) {
            checkCode();
        }
    }
}

function clearInput() {
    iziToast.destroy();
    iziToast.success({
        title: 'Success',
        message: 'Input has been cleared',
        position: 'topCenter',
        timeout: 2000
    });
    input.value = '';
}

function checkCode() {
    if (input.value === correctCode) {
        // Create session in localStorage
        localStorage.setItem('userSession', 'authenticated');
        // Set timestamp for session
        localStorage.setItem('sessionTimestamp', Date.now());
        
        iziToast.destroy();
        iziToast.success({
            title: 'Success',
            message: 'Code is correct, Redirecting',
            position: 'topCenter',
            timeout: 2000
        });
        
        setTimeout(() => {
            window.location.href = "pages/next1.html";
        }, 2000);
    } else {
        iziToast.destroy();
        iziToast.warning({
            title: 'Error',
            message: 'Incorrect code',
            position: 'topCenter',
            timeout: 2000
        });
        // Clear input after showing error
        setTimeout(() => {
            input.value = '';
        }, 500);
    }
}

// Auto-advance carousel every 5 seconds
setInterval(nextSlide, 5000);
