document.addEventListener("DOMContentLoaded", function() {
    const messageButton = document.querySelectorAll('.circle-button')[0];
    const modal = document.getElementById("messageModal");
    const closeModal = document.getElementById("closeModal");
    const audio = document.getElementById("myAudio");

    // Preload audio
    if (audio) {
        audio.load();
    }

    // Function to open modal with animation
    function openModalWithAnimation() {
        modal.style.display = "block";
        // Trigger reflow
        modal.offsetHeight;
        modal.classList.add("show");
        
        // Play audio if it exists
        if (audio) {
            audio.play().catch(function(error) {
                console.log("Audio playback failed:", error);
            });
        }
    }

    // Function to close modal with animation
    function closeModalWithAnimation() {
        modal.classList.remove("show");
        
        // Wait for animation to complete
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);

        // Stop audio if it exists
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    // Event listeners
    messageButton.addEventListener('click', openModalWithAnimation);
    closeModal.addEventListener('click', closeModalWithAnimation);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalWithAnimation();
        }
    });

    // Run session check if it exists
    if (typeof checkSession === 'function') {
        checkSession();
    }

    // Gallery Modal
    const galleryButton = document.getElementById("galleryButton");
    const galleryModal = document.getElementById("galleryModal");
    const closeGallery = document.getElementById("closeGallery");
    const fullscreenModal = document.getElementById("fullscreenModal");
    const audio2 = document.getElementById("myAudio2"); // Audio for gallery

    // Preload gallery audio
    if (audio2) {
        audio2.load();
    }

    // Open gallery modal
    galleryButton.addEventListener('click', function() {
        galleryModal.style.display = "block";
        setTimeout(() => {
            galleryModal.classList.add("show");
        }, 10);

        // Play audio for gallery
        if (audio2) {
            audio2.play().catch(function(error) {
                console.log("Audio playback failed:", error);
            });
        }

        // Dynamically create the gallery items
        const galleryContainer = galleryModal.querySelector('.gallery-grid');
        galleryContainer.innerHTML = ''; // Clear previous content

        for (let i = 1; i <= 84; i++) {
            const imgElement = document.createElement('div');
            imgElement.classList.add('gallery-item');

            const imgFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // Supported image formats
            const videoFormats = ['mp4', 'webm', 'ogg']; // Supported video formats

            // Add images to the gallery
            imgFormats.forEach((format) => {
                const imgPath = `../images/${i}.${format}`;
                const img = new Image();
                img.src = imgPath;
                img.alt = `Us ${i}`;
                img.classList.add('gallery-img');
                img.onclick = function() {
                    openFullscreen(img);
                };
                imgElement.appendChild(img);
            });

            // Add videos to the gallery
            // videoFormats.forEach((format) => {
            //     const videoPath = `../videos/${i}.${format}`;
            //     const video = document.createElement('video');
            //     video.src = videoPath;
            //     video.alt = `Us Video ${i}`;
            //     video.classList.add('gallery-video');
            //     video.controls = true; // Show controls for video
            //     video.onclick = function() {
            //         openFullscreen(video);
            //     };
            //     imgElement.appendChild(video);
            // });

            galleryContainer.appendChild(imgElement);
        }
    });

    // Close gallery modal
    closeGallery.addEventListener('click', function() {
        galleryModal.classList.remove("show");
        setTimeout(() => {
            galleryModal.style.display = "none";
        }, 300);

        // Stop audio if it exists
        if (audio2) {
            audio2.pause();
            audio2.currentTime = 0;
        }
    });

    // Close gallery when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === galleryModal) {
            galleryModal.classList.remove("show");
            setTimeout(() => {
                galleryModal.style.display = "none";
            }, 300);

            // Stop audio if it exists
            if (audio2) {
                audio2.pause();
                audio2.currentTime = 0;
            }
        }
    });
});

// Fullscreen functions
let currentIndex = 0;

// Open fullscreen and set media (image or video)
function openFullscreen(element) {
    const fullscreenModal = document.getElementById("fullscreenModal");
    const fullscreenMedia = document.getElementById("fullscreenImage");

    // Check if the element is an image or video
    if (element.tagName.toLowerCase() === 'img') {
        fullscreenMedia.src = element.src;
        fullscreenMedia.style.display = "block"; // Show image
    } else if (element.tagName.toLowerCase() === 'video') {
        fullscreenMedia.src = element.src;
        fullscreenMedia.style.display = "block"; // Show video
    }
    
    fullscreenModal.style.display = "block";
    setTimeout(() => {
        fullscreenModal.classList.add("show");
    }, 10);

    // Add swipe functionality
    addSwipeListener();
}

// Close fullscreen
function closeFullscreen() {
    const fullscreenModal = document.getElementById("fullscreenModal");
    fullscreenModal.classList.remove("show");
    setTimeout(() => {
        fullscreenModal.style.display = "none";
    }, 300);
}

// Swipe functionality to navigate images or videos
function addSwipeListener() {
    const fullscreenModal = document.getElementById("fullscreenModal");
    const fullscreenMedia = document.getElementById("fullscreenImage");

    let touchStartX = 0;
    let touchEndX = 0;

    fullscreenModal.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    fullscreenModal.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        if (touchEndX < touchStartX) {
            // Swipe Left - Show next media
            currentIndex = (currentIndex + 1) % 84; // Adjust to the number of media
        } else if (touchEndX > touchStartX) {
            // Swipe Right - Show previous media
            currentIndex = (currentIndex - 1 + 15) % 84; // Adjust to the number of media
        }

        const nextMediaSrc = `../media/${currentIndex + 1}`; // Adjust path to your media folder
        // Check if it's an image or video based on format availability
        const imgFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const videoFormats = ['mp4', 'webm', 'ogg'];

        let mediaSrc = '';
        imgFormats.forEach((format) => {
            const imgPath = `${nextMediaSrc}.${format}`;
            if (checkMediaExists(imgPath)) {
                mediaSrc = imgPath;
                fullscreenMedia.src = mediaSrc;
                fullscreenMedia.style.display = "block"; // Show image
                return;
            }
        });

        videoFormats.forEach((format) => {
            const videoPath = `${nextMediaSrc}.${format}`;
            if (checkMediaExists(videoPath)) {
                mediaSrc = videoPath;
                fullscreenMedia.src = mediaSrc;
                fullscreenMedia.style.display = "block"; // Show video
                return;
            }
        });
    }
}

// Helper function to check if media exists
function checkMediaExists(mediaPath) {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', mediaPath, false);
    xhr.send();
    return xhr.status !== 404;
}
