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
        this.prevImageBtn = document.getElementById('prevImageBtn');
        this.nextImageBtn = document.getElementById('nextImageBtn');
        this.zoomBtn = document.getElementById('zoomBtn');
        this.imageLoader = document.getElementById('imageLoader');
        this.progressFill = document.getElementById('progressFill');
        this.imageInfo = document.getElementById('imageInfo');
        this.thumbnailsScroll = document.getElementById('thumbnailsScroll');
        
        this.currentImageIndex = 1;
        this.totalImages = 25;
        this.imagePath = './myportfolio/assets/zero-web-guide-images/';
        this.isFullscreen = false;
        this.touchStartX = 0;
        
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
        this.prevImageBtn.addEventListener('click', () => this.prevImage());
        this.nextImageBtn.addEventListener('click', () => this.nextImage());
        
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
            if (this.isFullscreen) {
                this.toggleFullscreen();
            }
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
        this.imageInfo.textContent = `Guide Image ${this.currentImageIndex}`;
        
        // Update progress bar
        const progress = (this.currentImageIndex / this.totalImages) * 100;
        this.progressFill.style.width = progress + '%';
        
        // Update button states
        this.prevBtn.disabled = this.currentImageIndex === 1;
        this.nextBtn.disabled = this.currentImageIndex === this.totalImages;
        this.prevImageBtn.disabled = this.currentImageIndex === 1;
        this.nextImageBtn.disabled = this.currentImageIndex === this.totalImages;
        
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

