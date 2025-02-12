// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    const cardBx = document.querySelector('.cardBx');

    // Initially show only first 18 cards
    const cardsPerPage = 18;
    let currentIndex = cardsPerPage;

    // Hide cards beyond initial display
    cards.forEach((card, index) => {
        if (index >= cardsPerPage) {
            card.classList.add('hidden');
        }
    });

    // Filter functionality
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(button => button.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            
            // Filter cards
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                card.classList.remove('hidden');
                
                if (filterValue === 'all') {
                    // Show only first 18 cards when filtering
                    if (Array.from(cards).indexOf(card) >= cardsPerPage) {
                        card.classList.add('hidden');
                    }
                } else if (cardCategory !== filterValue) {
                    card.classList.add('hidden');
                }
            });

            // Reset current index and show/hide load more button
            currentIndex = cardsPerPage;
            updateLoadMoreButton();
        });
    });

    // Load More functionality
    loadMoreBtn.addEventListener('click', function() {
        const hiddenCards = document.querySelectorAll('.card.hidden');
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');

        let cardsShown = 0;
        hiddenCards.forEach(card => {
            if (cardsShown < 6) { // Show 6 more cards
                if (activeFilter === 'all' || card.getAttribute('data-category') === activeFilter) {
                    card.classList.remove('hidden');
                    cardsShown++;
                }
            }
        });

        currentIndex += 6;
        updateLoadMoreButton();
    });

    // Update load more button visibility
    function updateLoadMoreButton() {
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const visibleCards = activeFilter === 'all' 
            ? cards.length 
            : document.querySelectorAll(`.card[data-category="${activeFilter}"]`).length;
        
        const hiddenCards = document.querySelectorAll('.card.hidden').length;
        
        if (hiddenCards === 0 || currentIndex >= visibleCards) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    // Wishlist functionality
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            icon.classList.toggle('fas');
            icon.classList.toggle('far');
        });
    });

    // Quick view functionality
    document.querySelectorAll('.quick-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const videoModal = document.getElementById('videoModal');
            videoModal.style.display = 'flex';
        });
    });

    // Close modal
    document.querySelector('.close-modal').addEventListener('click', function() {
        const videoModal = document.getElementById('videoModal');
        videoModal.style.display = 'none';
        const video = document.getElementById('gamePreview');
        video.pause();
    });

    // Close modal on outside click
    window.addEventListener('click', function(e) {
        const videoModal = document.getElementById('videoModal');
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            const video = document.getElementById('gamePreview');
            video.pause();
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const toggleMenu = document.querySelector('.toggleMenu');
    const nav = document.querySelector('.nav');
    
    toggleMenu.addEventListener('click', function() {
        nav.classList.toggle('active');
        
        // Optional: Change hamburger icon to times icon when menu is open
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !toggleMenu.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            const icon = toggleMenu.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = toggleMenu.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
});