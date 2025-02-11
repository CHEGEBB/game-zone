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