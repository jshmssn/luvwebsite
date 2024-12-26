let totalImages = 84; // Declare it globally

document.addEventListener("DOMContentLoaded", function() {
    const messageButton = document.querySelectorAll('.circle-button')[0];
    const modal = document.getElementById("messageModal");
    const closeModal = document.getElementById("closeModal");
    const audio = document.getElementById("myAudio");
    let currentLoadedImages = 0;
    const imagesPerLoad = 5;
    const totalImages = 84;
    let isLoading = false;

    // Preload audio
    if (audio) {
        audio.load();
    }

    // Original modal functions remain the same
    function openModalWithAnimation() {
        modal.style.display = "block";
        modal.offsetHeight;
        modal.classList.add("show");
        
        if (audio) {
            audio.play().catch(function(error) {
                console.log("Audio playback failed:", error);
            });
        }
    }

    function closeModalWithAnimation() {
        modal.classList.remove("show");
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);

        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    messageButton.addEventListener('click', openModalWithAnimation);
    closeModal.addEventListener('click', closeModalWithAnimation);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModalWithAnimation();
        }
    });

    if (typeof checkSession === 'function') {
        checkSession();
    }

    // Gallery Modal with Lazy Loading
    const galleryButton = document.getElementById("galleryButton");
    const galleryModal = document.getElementById("galleryModal");
    const closeGallery = document.getElementById("closeGallery");
    const fullscreenModal = document.getElementById("fullscreenModal");
    const audio2 = document.getElementById("myAudio2");

    if (audio2) {
        audio2.load();
    }

    // Function to load batch of images
    async function loadImageBatch() {
        if (isLoading || currentLoadedImages >= totalImages) return;
        
        isLoading = true;
        const galleryContainer = galleryModal.querySelector('.gallery-grid');
        const endIndex = Math.min(currentLoadedImages + imagesPerLoad, totalImages);
        
        for (let i = currentLoadedImages + 1; i <= endIndex; i++) {
            const imgElement = document.createElement('div');
            imgElement.classList.add('gallery-item');

            const imgFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            
            // Try loading each format
            for (const format of imgFormats) {
                try {
                    const imgPath = `../images/${i}.${format}`;
                    // Check if image exists
                    const exists = await checkImageExists(imgPath);
                    if (exists) {
                        const img = new Image();
                        img.src = imgPath;
                        img.alt = `Us ${i}`;
                        img.classList.add('gallery-img');
                        img.onclick = function() {
                            openFullscreen(img);
                        };
                        imgElement.appendChild(img);
                        break; // Stop trying other formats if one succeeds
                    }
                } catch (error) {
                    console.log(`Failed to load image ${i}.${format}:`, error);
                }
            }

            galleryContainer.appendChild(imgElement);
        }

        currentLoadedImages = endIndex;
        isLoading = false;
    }

    // Function to check if image exists
    window.checkImageExists = function(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };    
    
    // Modified scroll event handler for lazy loading
    function handleScroll() {
        const galleryContainer = galleryModal.querySelector('.gallery-grid');
        const modalRect = galleryModal.getBoundingClientRect();
        const isModalVisible = modalRect.top < window.innerHeight && modalRect.bottom >= 0;
        
        if (!isModalVisible) return;

        // Calculate scroll position based on both container and window
        const containerScrollPosition = galleryContainer.scrollTop + galleryContainer.clientHeight;
        const containerThreshold = galleryContainer.scrollHeight - 200;
        
        const windowScrollPosition = window.innerHeight + window.pageYOffset;
        const windowThreshold = document.documentElement.offsetHeight - 200;

        // Check if either container or window scroll position triggers loading
        if (containerScrollPosition > containerThreshold || 
            (windowScrollPosition > windowThreshold && isModalVisible)) {
            loadImageBatch();
        }
    }

    // Throttle function to limit scroll event firing
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    const throttledHandleScroll = throttle(handleScroll, 100);

    // Modified gallery button click handler
    galleryButton.addEventListener('click', function() {
        galleryModal.style.display = "block";
        setTimeout(() => {
            galleryModal.classList.add("show");
        }, 10);

        if (audio2) {
            audio2.play().catch(function(error) {
                console.log("Audio playback failed:", error);
            });
        }

        const galleryContainer = galleryModal.querySelector('.gallery-grid');
        galleryContainer.innerHTML = ''; // Clear previous content
        currentLoadedImages = 0; // Reset counter
        
        // Add scroll event listeners for both container and window
        galleryContainer.addEventListener('scroll', throttledHandleScroll);
        window.addEventListener('scroll', throttledHandleScroll);
        
        // Load initial batch
        loadImageBatch();
    });

    // Modified close gallery modal
    closeGallery.addEventListener('click', function() {
        galleryModal.classList.remove("show");
        setTimeout(() => {
            galleryModal.style.display = "none";
        }, 300);

        if (audio2) {
            audio2.pause();
            audio2.currentTime = 0;
        }

        // Remove both scroll event listeners
        const galleryContainer = galleryModal.querySelector('.gallery-grid');
        galleryContainer.removeEventListener('scroll', throttledHandleScroll);
        window.removeEventListener('scroll', throttledHandleScroll);
    });

    // Window click event handler
    window.addEventListener('click', function(event) {
        if (event.target === galleryModal) {
            galleryModal.classList.remove("show");
            setTimeout(() => {
                galleryModal.style.display = "none";
            }, 300);

            if (audio2) {
                audio2.pause();
                audio2.currentTime = 0;
            }

            // Remove scroll event listeners
            const galleryContainer = galleryModal.querySelector('.gallery-grid');
            galleryContainer.removeEventListener('scroll', throttledHandleScroll);
            window.removeEventListener('scroll', throttledHandleScroll);
        }
    });
});

// Fullscreen and navigation functions
let currentIndex = 0;

function createNavigationArrows() {
    const arrowsContainer = document.createElement('div');
    arrowsContainer.className = 'nav-arrows';
    arrowsContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        transform: translateY(-50%);
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        pointer-events: none;
        z-index: 1000;
    `;

    const createArrow = (direction) => {
        const arrow = document.createElement('button');
        arrow.className = `nav-arrow ${direction}`;
        arrow.style.cssText = `
            background-color: rgba(255, 255, 255, 0.3);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.3s;
            pointer-events: auto;
        `;
        arrow.innerHTML = direction === 'prev' ? '←' : '→';
        
        arrow.onmouseover = () => {
            arrow.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        };
        
        arrow.onmouseout = () => {
            arrow.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        };
        
        return arrow;
    };

    const prevArrow = createArrow('prev');
    const nextArrow = createArrow('next');

    prevArrow.onclick = () => navigateImage('prev');
    nextArrow.onclick = () => navigateImage('next');

    arrowsContainer.appendChild(prevArrow);
    arrowsContainer.appendChild(nextArrow);

    return arrowsContainer;
}

async function navigateImage(direction) {
    const fullscreenMedia = document.getElementById("fullscreenImage");
    const totalImages = 84; // Ensure this matches your gallery's total image count

    // Validate currentIndex and handle navigation
    if (isNaN(currentIndex)) {
        console.error("Invalid currentIndex, resetting to 0");
        currentIndex = 0;
    }

    if (direction === 'next') {
        currentIndex = (currentIndex + 1) % totalImages; // Loop back to the first image
    } else if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Loop back to the last image
    }

    console.log("Navigating to image index:", currentIndex); // Debug log

    // Try different formats until an image is found
    const imgFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    for (const format of imgFormats) {
        const imgPath = `../images/${currentIndex + 1}.${format}`;
        console.log("Checking image path:", imgPath); // Debug log

        try {
            const exists = await checkImageExists(imgPath);
            if (exists) {
                fullscreenMedia.src = imgPath;
                return; // Exit once a valid image is found
            }
        } catch (error) {
            console.error(`Failed to load image format ${format}:`, error);
        }
    }

    console.error("No valid image found for index:", currentIndex);
}

function handleKeyPress(e) {
    if (e.key === 'ArrowLeft') {
        navigateImage('prev');
    } else if (e.key === 'ArrowRight') {
        navigateImage('next');
    } else if (e.key === 'Escape') {
        closeFullscreen();
    }
}

function addKeyboardListener() {
    document.addEventListener('keydown', handleKeyPress);
}

function removeKeyboardListener() {
    document.removeEventListener('keydown', handleKeyPress);
}

function openFullscreen(element) {
    const fullscreenModal = document.getElementById("fullscreenModal");
    const fullscreenMedia = document.getElementById("fullscreenImage");

    // Extract the image number from the clicked element's src
    const match = element.src.match(/(\d+)\.[^.]+$/);
    if (match && match[1]) {
        const imgNumber = parseInt(match[1]);
        currentIndex = imgNumber - 1; // Adjust to 0-based index
    } else {
        console.error("Failed to extract image number from src:", element.src);
        currentIndex = 0; // Default to the first image
    }

    console.log("Opening fullscreen for image index:", currentIndex); // Debug log

    // Set the source of the fullscreen media
    fullscreenMedia.src = element.src;
    fullscreenMedia.style.display = "block";

    // Display the modal
    fullscreenModal.style.display = "block";
    setTimeout(() => {
        fullscreenModal.classList.add("show");
    }, 10);

    // Add navigation arrows to modal if not already added
    if (!fullscreenModal.querySelector('.nav-arrows')) {
        const navigationArrows = createNavigationArrows();
        fullscreenModal.appendChild(navigationArrows);
    }

    // Add event listeners for navigation and keyboard input
    addSwipeListener();
    addKeyboardListener();
}

function closeFullscreen() {
    const fullscreenModal = document.getElementById("fullscreenModal");
    fullscreenModal.classList.remove("show");
    removeKeyboardListener();
    setTimeout(() => {
        fullscreenModal.style.display = "none";
    }, 300);
}

function addSwipeListener() {
    const fullscreenModal = document.getElementById("fullscreenModal");
    const fullscreenMedia = document.getElementById("fullscreenImage");

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    fullscreenModal.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    fullscreenModal.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    async function handleSwipe() {
        const horizontalDistance = touchEndX - touchStartX;
        const verticalDistance = touchEndY - touchStartY;

        if (Math.abs(horizontalDistance) > Math.abs(verticalDistance) && 
            Math.abs(horizontalDistance) > 50) {
            if (horizontalDistance < 0) {
                navigateImage('next');
            } else {
                navigateImage('prev');
            }
        }
    }
}