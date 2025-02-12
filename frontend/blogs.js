// Function to dynamically add a new blog
function addBlog(event) {
    event.preventDefault();

    // Get form values
    const title = document.getElementById('blog-title').value;
    const date = document.getElementById('blog-date').value;
    const content = document.getElementById('blog-content').value;
    const image = document.getElementById('blog-image').files[0];

    // Validate inputs
    if (!title || !date || !content || !image) {
        alert('Please fill out all fields and upload an image.');
        return;
    }

    // Create a new blog card
    const blogCard = document.createElement('div');
    blogCard.classList.add('blog-card');

    // Create blog image
    const blogImage = document.createElement('div');
    blogImage.classList.add('blog-image');
    const img = document.createElement('img');
    img.src = URL.createObjectURL(image);
    img.alt = title;
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    blogImage.appendChild(img);
    blogImage.appendChild(overlay);

    // Create blog content
    const blogContent = document.createElement('div');
    blogContent.classList.add('blog-content');
    const blogTitle = document.createElement('a');
    blogTitle.href = '#';
    blogTitle.classList.add('title');
    blogTitle.textContent = title;
    const blogDate = document.createElement('span');
    blogDate.classList.add('date');
    blogDate.textContent = `Posted on ${date}`;
    const blogText = document.createElement('p');
    blogText.textContent = content;
    const readMore = document.createElement('a');
    readMore.href = '#';
    readMore.classList.add('read-more');
    readMore.innerHTML = 'Read More <i class="fas fa-arrow-right"></i>';

    // Append content to blog card
    blogContent.appendChild(blogTitle);
    blogContent.appendChild(blogDate);
    blogContent.appendChild(blogText);
    blogContent.appendChild(readMore);
    blogCard.appendChild(blogImage);
    blogCard.appendChild(blogContent);

    // Add the new blog card to the grid
    const blogsGrid = document.querySelector('.blogs-grid');
    blogsGrid.prepend(blogCard);

    // Clear the form
    document.getElementById('create-blog-form').reset();
}

// Attach event listener to the form
document.getElementById('create-blog-form').addEventListener('submit', addBlog);
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