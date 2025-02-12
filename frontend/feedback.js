// Form Submission Handling
document.getElementById('feedback-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Validate inputs
    if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
    }

    // Simulate form submission
    alert('Thank you for your feedback!');
    document.getElementById('feedback-form').reset();
});
document.addEventListener('DOMContentLoaded', function() {
    const toggleMenu = document.querySelector('.toggleMenu');
    const nav = document.querySelector('.nav');
    
    // Toggle menu function
    function toggleNav() {
        nav.classList.toggle('active');
        const icon = toggleMenu.querySelector('i');
        
        // Toggle between hamburger and close icons
        if (nav.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
            // Add blur effect to background
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
            document.body.style.overflow = '';
        }
    }
    
    // Event listeners
    toggleMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleNav();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !toggleMenu.contains(e.target)) {
            toggleNav();
        }
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                toggleNav();
            }
        });
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 991 && nav.classList.contains('active')) {
                toggleNav();
            }
        }, 250);
    });

    // Handle scroll for header shadow
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            header.style.background = 'rgba(5, 14, 45, 0.95)';
        } else {
            header.style.boxShadow = 'none';
            header.style.background = 'var(--background-dark)';
        }
    });
});