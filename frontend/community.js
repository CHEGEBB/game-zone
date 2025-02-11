// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize vote counters
    initializeVoting();
    
    // Initialize filters
    initializeFilters();
    
    // Initialize search functionality
    initializeSearch();
    
    // Initialize community join buttons
    initializeCommunityButtons();
    
    // Initialize post creation
    initializePostCreation();
    
    // Initialize notifications
    initializeNotifications();
});

// Voting System
function initializeVoting() {
    const voteButtons = document.querySelectorAll('.vote-up, .vote-down');
    
    voteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const voteContainer = this.parentElement;
            const voteCount = voteContainer.querySelector('span');
            const currentCount = parseInt(voteCount.textContent);
            
            if (this.classList.contains('vote-up')) {
                if (!this.classList.contains('active')) {
                    voteCount.textContent = currentCount + 1;
                    this.classList.add('active');
                    voteContainer.querySelector('.vote-down')?.classList.remove('active');
                } else {
                    voteCount.textContent = currentCount - 1;
                    this.classList.remove('active');
                }
            } else {
                if (!this.classList.contains('active')) {
                    voteCount.textContent = currentCount - 1;
                    this.classList.add('active');
                    voteContainer.querySelector('.vote-up')?.classList.remove('active');
                } else {
                    voteCount.textContent = currentCount + 1;
                    this.classList.remove('active');
                }
            }

            // Add animation effect
            voteCount.style.animation = 'popScale 0.3s ease';
            setTimeout(() => {
                voteCount.style.animation = '';
            }, 300);
        });
    });
}

// Filter System
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.discussion-filters button, .highlight-filters button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings
            const siblings = this.parentElement.children;
            Array.from(siblings).forEach(sibling => {
                sibling.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter content based on button type
            const filterType = this.textContent.toLowerCase();
            filterContent(filterType);
        });
    });
}

function filterContent(type) {
    const discussionCards = document.querySelectorAll('.discussion-card');
    
    discussionCards.forEach(card => {
        const cardType = card.querySelector('.tag')?.textContent.toLowerCase();
        
        if (type === 'all' || cardType === type) {
            card.style.display = 'flex';
            // Add fade in animation
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.nav-search input');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase();
            searchContent(searchTerm);
        }, 300));
    }
}

function searchContent(term) {
    const searchableElements = document.querySelectorAll('.discussion-card, .community-card');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(term)) {
            element.style.display = 'flex';
            element.style.animation = 'fadeIn 0.5s ease';
        } else {
            element.style.display = 'none';
        }
    });
}

// Community Join Buttons
function initializeCommunityButtons() {
    const joinButtons = document.querySelectorAll('.btn-join, .btn-join-community');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isJoined = this.classList.contains('joined');
            
            if (isJoined) {
                this.textContent = 'Join Community';
                this.classList.remove('joined');
            } else {
                this.textContent = 'Joined ✓';
                this.classList.add('joined');
                
                // Show notification
                showNotification('Successfully joined the community!');
            }
        });
    });
}

// Post Creation
function initializePostCreation() {
    const createPostBtn = document.querySelector('.btn-create-post');
    
    if (createPostBtn) {
        createPostBtn.addEventListener('click', function() {
            showPostModal();
        });
    }
}

function showPostModal() {
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'post-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Create New Post</h2>
            <input type="text" placeholder="Post Title" class="post-title">
            <textarea placeholder="Write your post content..." class="post-content"></textarea>
            <div class="modal-actions">
                <button class="btn-cancel">Cancel</button>
                <button class="btn-submit">Post</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    modal.querySelector('.btn-cancel').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.querySelector('.btn-submit').addEventListener('click', () => {
        const title = modal.querySelector('.post-title').value;
        const content = modal.querySelector('.post-content').value;
        
        if (title && content) {
            // Here you would typically send this to a server
            showNotification('Post created successfully!');
            modal.remove();
        } else {
            showNotification('Please fill in all fields!', 'error');
        }
    });
}

// Notifications System
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notifications');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            toggleNotificationPanel();
        });
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add necessary styles for animations and notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes popScale {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        background-color: var(--success-color);
        color: white;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .notification.error {
        background-color: var(--danger-color);
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .post-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .modal-content {
        background-color: var(--background-light);
        padding: 2rem;
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
    }
    
    .modal-content input,
    .modal-content textarea {
        width: 100%;
        margin: 1rem 0;
        padding: 0.75rem;
        border: 1px solid var(--gray-medium);
        border-radius: 6px;
        background-color: var(--background-dark);
        color: var(--text-light);
    }
    
    .modal-content textarea {
        height: 200px;
        resize: vertical;
    }
    
    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .btn-cancel,
    .btn-submit {
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
        border: none;
    }
    
    .btn-cancel {
        background-color: var(--gray-medium);
        color: var(--text-light);
    }
    
    .btn-submit {
        background-color: var(--primary-color);
        color: var(--text-light);
    }
`;

document.head.appendChild(style);