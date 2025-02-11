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