// Web Guide Modal Functionality
class WebGuideModal {
    constructor() {
        this.modal = document.getElementById('webGuideModal');
        this.modalImage = document.getElementById('modalImage');
        this.imageCounter = document.getElementById('imageCounter');
        this.totalImagesSpan = document.getElementById('totalImages');
        this.webGuideCard = document.getElementById('web-guide-card');
        this.closeBtn = document.querySelector('.modal-close');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.imageLoader = document.getElementById('imageLoader');
        this.progressFill = document.getElementById('progressFill');
        this.thumbnailsScroll = document.getElementById('thumbnailsScroll');
        
        this.currentImageIndex = 1;
        this.totalImages = 25;
        this.imagePath = './myportfolio/assets/zero-web-guide-images/';
        this.isFullscreen = false;
        this.touchStartX = 0;
        this.imageDescriptions = [
            'Introduction to Web Development - Learn the fundamentals of creating websites and web applications.',
            'HTML Basics - Understanding the structure of web pages using HyperText Markup Language.',
            'CSS Styling - Master cascading style sheets to design beautiful and responsive layouts.',
            'JavaScript Fundamentals - Introduction to programming logic and interactivity on the web.',
            'Responsive Design - Creating websites that work seamlessly across all device sizes.',
            'Flexbox Layout - Modern CSS flexbox technique for building flexible layouts.',
            'CSS Grid - Advanced grid system for creating complex page layouts.',
            'JavaScript DOM Manipulation - Modifying and interacting with HTML elements using JavaScript.',
            'Event Handling - Capturing and responding to user interactions on web pages.',
            'AJAX and Fetch API - Asynchronous data fetching and dynamic content loading.',
            'Form Handling - Creating and validating interactive forms for user input.',
            'Local Storage - Storing data on the client side using browser storage APIs.',
            'APIs and Integration - Connecting to external services and data sources.',
            'Python Introduction - Getting started with Python programming language basics.',
            'Python Data Types - Working with strings, numbers, lists, and dictionaries.',
            'Python Functions - Creating reusable code blocks with functions.',
            'Python Control Flow - Using loops and conditional statements effectively.',
            'Django Framework Intro - Introduction to the popular Django web framework.',
            'Django Models - Database design and management with Django ORM.',
            'Django Views - Creating dynamic content handlers for HTTP requests.',
            'Django Templates - Building HTML templates with dynamic content.',
            'Database Basics - Fundamentals of SQL and database design.',
            'Security Best Practices - Protecting web applications from common vulnerabilities.',
            'Performance Optimization - Improving website speed and user experience.',
            'Deployment and Hosting - Publishing your web applications to the internet.'
        ];
        
        this.init();
    }
    
    init() {
        // Open modal on card click
        this.webGuideCard.addEventListener('click', () => this.openModal());
        this.webGuideCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openModal();
            }
        });
        
        // Close modal
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());
        
        // Touch swipe support
        this.modal.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });
        
        this.modal.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = this.touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextImage();
                } else {
                    this.prevImage();
                }
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevImage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextImage();
                } else if (e.key === 'Escape') {
                    this.closeModal();
                }
            }
        });
        
        // Thumbnail support
        this.generateThumbnails();
    }
    
    generateThumbnails() {
        const fragment = document.createDocumentFragment();
        
        for (let i = 1; i <= this.totalImages; i++) {
            const thumb = document.createElement('button');
            thumb.className = 'thumbnail';
            if (i === 1) thumb.classList.add('active');
            thumb.setAttribute('aria-label', `Go to image ${i}`);
            thumb.setAttribute('data-index', i);
            
            const img = document.createElement('img');
            img.src = `${this.imagePath}${i}.jpg`;
            img.alt = `Image ${i}`;
            
            thumb.appendChild(img);
            thumb.addEventListener('click', () => {
                this.currentImageIndex = i;
                this.loadImage();
                this.updateThumbnailScroll();
            });
            
            fragment.appendChild(thumb);
        }
        
        this.thumbnailsScroll.appendChild(fragment);
    }
    
    updateThumbnailScroll() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        const activeThumbnail = document.querySelector(`[data-index="${this.currentImageIndex}"]`);
        if (activeThumbnail) {
            activeThumbnail.classList.add('active');
            // Scroll to active thumbnail
            activeThumbnail.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }
    
    openModal() {
        this.currentImageIndex = 1;
        this.loadImage();
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add animation class
        setTimeout(() => this.modal.classList.add('active'), 10);
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        setTimeout(() => {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }
    
    loadImage() {
        // Show loader
        this.imageLoader.style.display = 'flex';
        this.modalImage.style.opacity = '0';
        
        const imageSrc = `${this.imagePath}${this.currentImageIndex}.jpg`;
        const img = new Image();
        
        img.onload = () => {
            this.modalImage.src = imageSrc;
            this.modalImage.style.opacity = '1';
            this.imageLoader.style.display = 'none';
        };
        
        img.onerror = () => {
            this.imageLoader.style.display = 'none';
            console.error(`Failed to load image: ${imageSrc}`);
        };
        
        img.src = imageSrc;
        
        // Update counter and info
        this.imageCounter.textContent = this.currentImageIndex;
        
        // Update overlay description
        const overlay = document.getElementById('imageOverlay');
        if (overlay) {
            overlay.textContent = this.imageDescriptions[this.currentImageIndex - 1];
        }
        
        // Update progress bar
        const progress = (this.currentImageIndex / this.totalImages) * 100;
        this.progressFill.style.width = progress + '%';
        
        // Update button states
        this.prevBtn.disabled = this.currentImageIndex === 1;
        this.nextBtn.disabled = this.currentImageIndex === this.totalImages;
        
        // Update thumbnails
        this.updateThumbnailScroll();
        
        // Preload adjacent images
        this.preloadAdjacentImages();
    }
    
    preloadAdjacentImages() {
        if (this.currentImageIndex > 1) {
            const prevImg = new Image();
            prevImg.src = `${this.imagePath}${this.currentImageIndex - 1}.jpg`;
        }
        
        if (this.currentImageIndex < this.totalImages) {
            const nextImg = new Image();
            nextImg.src = `${this.imagePath}${this.currentImageIndex + 1}.jpg`;
        }
    }
    
    prevImage() {
        if (this.currentImageIndex > 1) {
            this.currentImageIndex--;
            this.loadImage();
        }
    }
    
    nextImage() {
        if (this.currentImageIndex < this.totalImages) {
            this.currentImageIndex++;
            this.loadImage();
        }
    }
    
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        const modalContent = document.querySelector('.modal-content');
        const modalBody = document.querySelector('.modal-body');
        
        if (this.isFullscreen) {
            modalContent.classList.add('fullscreen');
            this.zoomBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v4a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-4a2 2 0 0 1 2-2h3M3 16h4a2 2 0 0 1 2 2v4"></path>
                </svg>
            `;
        } else {
            modalContent.classList.remove('fullscreen');
            this.zoomBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
            `;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new WebGuideModal();
    });
} else {
    new WebGuideModal();
}

