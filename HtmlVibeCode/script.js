// Get DOM elements
const nameInput = document.getElementById('nameInput');
const greetButton = document.getElementById('greetButton');
const greetingMessage = document.getElementById('greetingMessage');

// Array of fun greeting messages for variety
const greetingTemplates = [
    "Hello there, {name}! 🎉 Welcome to the vibe coding zone!",
    "Hey {name}! 🌟 Ready to code with some awesome vibes?",
    "What's up, {name}? 🚀 Let's make some coding magic happen!",
    "Greetings, {name}! ✨ The coding vibes are strong with you!",
    "Hi {name}! 🎨 Time to paint the world with code!"
];

// Function to show greeting message
function showGreeting() {
    const name = nameInput.value.trim();
    
    // Check if name is entered
    if (name === '') {
        alert('Please enter your name first! 😊');
        nameInput.focus();
        return;
    }
    
    // Get random greeting template
    const randomTemplate = greetingTemplates[Math.floor(Math.random() * greetingTemplates.length)];
    const personalizedGreeting = randomTemplate.replace('{name}', name);
    
    // Display the greeting message
    greetingMessage.textContent = personalizedGreeting;
    greetingMessage.classList.remove('hidden');
    
    // Add a little celebration effect
    celebrateGreeting();
}

// Function to add celebration effect
function celebrateGreeting() {
    // Temporarily change button text
    const originalText = greetButton.textContent;
    greetButton.textContent = '🎉 Awesome!';
    
    // Reset button text after 2 seconds
    setTimeout(() => {
        greetButton.textContent = originalText;
    }, 2000);
    
    // Add shake animation to container
    const container = document.querySelector('.container');
    container.style.animation = 'none';
    setTimeout(() => {
        container.style.animation = 'slideIn 0.6s ease-out';
    }, 10);
}

// Event listeners
greetButton.addEventListener('click', showGreeting);

// Allow Enter key to trigger greeting
nameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        showGreeting();
    }
});

// Focus on name input when page loads
window.addEventListener('load', function() {
    nameInput.focus();
});

// Clear greeting when input changes
nameInput.addEventListener('input', function() {
    if (greetingMessage.classList.contains('hidden') === false) {
        greetingMessage.classList.add('hidden');
        greetButton.textContent = 'Show Greeting';
    }
});
