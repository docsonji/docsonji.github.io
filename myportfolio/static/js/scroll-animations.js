// Scroll Animation System - Animates elements as they come into view
(function() {
	// List of selectors to animate on scroll
	const animationTargets = [
		// About section
		{ selector: '#about', class: 'fade-in-up', delay: 0 },
		{ selector: '.about-text', class: 'fade-in-up', delay: 100 },
		{ selector: '#skills', class: 'fade-in-up', delay: 200 },
		
		// Stack section
		{ selector: '#stack', class: 'fade-in-up', delay: 0 },
		{ selector: '.stack-icons', class: 'fade-in-scale', delay: 150 },
		
		// Portfolio section
		{ selector: '#portfolio', class: 'fade-in-up', delay: 0 },
		{ selector: '.carousel-3d-container', class: 'fade-in-scale', delay: 100 },
		
		// Contact section (already has entrance-observer, but adding here for consistency)
		{ selector: '#contact', class: 'fade-in-up', delay: 0 },
	];

	// Create intersection observer for scroll animations
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -100px 0px'
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting && !entry.target.classList.contains('scroll-animated')) {
				// Add the animated class after a delay
				setTimeout(() => {
					entry.target.classList.add('scroll-animated');
					entry.target.classList.add(entry.target.dataset.animClass);
				}, parseInt(entry.target.dataset.animDelay) || 0);
				
				// Stop observing once animated
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Initialize animations on all target elements
	animationTargets.forEach(target => {
		const elements = document.querySelectorAll(target.selector);
		elements.forEach(el => {
			// Add data attributes for animation
			el.dataset.animClass = target.class;
			el.dataset.animDelay = target.delay;
			
			// Set initial hidden state
			el.style.willChange = 'transform, opacity';
			
			// Start observing
			observer.observe(el);
		});
	});

	// Stagger animation for skill progress bars
	const skillProgressBars = document.querySelectorAll('.skill-progress');
	if (skillProgressBars.length > 0) {
		const skillObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry, index) => {
				if (entry.isIntersecting && !entry.target.classList.contains('bar-animated')) {
					// Stagger each bar
					const delay = index * 80; // 80ms stagger between bars
					setTimeout(() => {
						entry.target.classList.add('bar-animated');
					}, delay);
				}
			});
		}, {
			threshold: 0.3,
			rootMargin: '0px 0px -50px 0px'
		});

		skillProgressBars.forEach(bar => {
			bar.style.willChange = 'transform, opacity';
			skillObserver.observe(bar);
		});
	}

	// Stagger animation for stack icons
	const stackIcons = document.querySelector('.stack-icons');
	if (stackIcons) {
		const images = stackIcons.querySelectorAll('img');
		const iconObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting && !entry.target.classList.contains('icon-animated')) {
					// Get stagger index for each image
					const index = Array.from(images).indexOf(entry.target);
					const delay = (index % 6) * 50; // Stagger within rows
					
					setTimeout(() => {
						entry.target.classList.add('icon-animated');
					}, delay);
				}
			});
		}, {
			threshold: 0.5,
			rootMargin: '0px 0px -50px 0px'
		});

		images.forEach(img => {
			img.style.willChange = 'transform, opacity';
			iconObserver.observe(img);
		});
	}
})();
