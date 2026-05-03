// FSL Modal Functionality
class FSLModal {
    constructor() {
        this.modal = document.getElementById('fslModal');
        this.modalImage = document.getElementById('fslModalImage');
        this.imageCounter = document.getElementById('fslImageCounter');
        this.totalImagesSpan = document.getElementById('fslTotalImages');
        this.fslCard = document.getElementById('fsl-card');
        this.closeBtn = this.modal.querySelector('.modal-close');
        this.prevBtn = document.getElementById('fslPrevBtn');
        this.nextBtn = document.getElementById('fslNextBtn');
        this.zoomBtn = document.getElementById('fslZoomBtn');
        this.imageLoader = document.getElementById('fslImageLoader');
        this.progressFill = document.getElementById('fslProgressFill');
        this.thumbnailsScroll = document.getElementById('fslThumbnailsScroll');
        
        this.currentImageIndex = 1;
        this.images = ['onboard.jpg', 'landing.jpg', 'home.jpg', 'about.jpg', 'dictionary1.jpg', 'dictionary2.jpg', 'dictionary3.jpg', 'translator.jpg', 'video_upload.jpg', 'quiz.jpg', 'settings.jpg'];
        this.imageDescriptions = [
            'Initial setup guide for new users to familiarize with the app interface.',
            'The first impression of the Filipino Sign Language Translator application with navigation and key features.',
            'Main dashboard displaying available features and quick access options.',
            'Information about the Filipino Sign Language Translator project and its mission.', 
            'Browse and search Filipino Sign Language vocabulary with visual references.',
            'Extended dictionary with more sign language terms and definitions.',
            'Additional dictionary entries and common phrases in sign language.',
            'Real-time translation tool for converting Filipino Sign Language to text and speech.',
            'Upload video content for sign language translation and analysis.',
            'Interactive quiz to test understanding of Filipino Sign Language.',
            'Settings page'
        ];
        this.totalImages = this.images.length;
        this.imagePath = './myportfolio/assets/fsl-images/';
        this.isFullscreen = false;
        this.touchStartX = 0;
        
        this.init();
    }
    
    init() {
        // Open modal on card click
        this.fslCard.addEventListener('click', () => this.openModal());
        this.fslCard.addEventListener('keydown', (e) => {
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
        
        // Zoom button
        this.zoomBtn.addEventListener('click', () => this.toggleFullscreen());
        
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
                } else if (e.key === 'f' || e.key === 'F') {
                    this.toggleFullscreen();
                }
            }
        });
        
        // Thumbnail support
        this.generateThumbnails();
    }
    
    generateThumbnails() {
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < this.images.length; i++) {
            const thumb = document.createElement('button');
            thumb.className = 'thumbnail';
            if (i === 0) thumb.classList.add('active');
            thumb.setAttribute('aria-label', `Go to image ${i + 1}`);
            thumb.setAttribute('data-index', i + 1);
            
            const img = document.createElement('img');
            img.src = `${this.imagePath}${this.images[i]}`;
            img.alt = `Image ${i + 1}`;
            
            thumb.appendChild(img);
            thumb.addEventListener('click', () => {
                this.currentImageIndex = i + 1;
                this.loadImage();
                this.updateThumbnailScroll();
            });
            
            fragment.appendChild(thumb);
        }
        
        this.thumbnailsScroll.appendChild(fragment);
    }
    
    updateThumbnailScroll() {
        const thumbnails = this.thumbnailsScroll.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
        });
        
        const activeThumbnail = this.thumbnailsScroll.querySelector(`[data-index="${this.currentImageIndex}"]`);
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
            if (this.isFullscreen) {
                this.toggleFullscreen();
            }
        }, 300);
    }
    
    loadImage() {
        // Show loader
        this.imageLoader.style.display = 'flex';
        this.modalImage.style.opacity = '0';
        
        const imageSrc = `${this.imagePath}${this.images[this.currentImageIndex - 1]}`;
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
        const overlay = document.getElementById('fslImageOverlay');
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
        const modalContent = this.modal.querySelector('.modal-content');
        
        if (!this.isFullscreen) {
            modalContent.style.maxWidth = '100%';
            modalContent.style.maxHeight = '100%';
            modalContent.style.borderRadius = '0';
            this.isFullscreen = true;
        } else {
            modalContent.style.maxWidth = '';
            modalContent.style.maxHeight = '';
            modalContent.style.borderRadius = '';
            this.isFullscreen = false;
        }
    }
    
    preloadAdjacentImages() {
        const preloadIndices = [];
        
        if (this.currentImageIndex > 1) {
            preloadIndices.push(this.currentImageIndex - 2); // Previous
        }
        
        if (this.currentImageIndex < this.totalImages) {
            preloadIndices.push(this.currentImageIndex); // Next
        }
        
        preloadIndices.forEach(index => {
            const img = new Image();
            img.src = `${this.imagePath}${this.images[index]}`;
        });
    }
}

// Initialize the modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FSLModal();
});