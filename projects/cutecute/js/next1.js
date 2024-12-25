function handleSearch() {
    // Show the modal
    document.querySelector('.modal').style.display = 'flex';
    // Start the countdown
    updateCountdown();
}

function closeModal() {
    setTimeout(() => {
        window.location.href = "next2.html"
        // alert("REDIRECT");
    }, 100);
    document.querySelector('.modal').style.display = 'none';
}

function calculateCountdown(targetDate) {
    const now = new Date();
    const diff = now - targetDate; // Calculate the difference as a positive value

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `It's been ${days} days, ${hours} hours, ${minutes} minutes and ${seconds}s since our first date🥰`;
}

function updateCountdown() {
    const targetDate = new Date('November 20, 2024 00:00:00');
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = calculateCountdown(targetDate);

    // Continuously update the countdown
    requestAnimationFrame(updateCountdown);
}

// Carousel functionality
let currentSlide = 0;
let slides = []; // Declare slides globally

function handleSearch() {
    // Show the modal
    document.querySelector('.modal').style.display = 'flex';

    // Initialize slides when the modal is opened
    slides = document.querySelectorAll('.carousel-item');

    // Start the countdown
    updateCountdown();

    // Show the first slide
    showSlide(currentSlide);
}

function showSlide(index) {
    if (slides.length === 0) return; // Check if slides are loaded
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length; // Wrap around
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Autonext slide
setInterval(nextSlide, 3000);