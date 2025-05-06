const welcomeMessage = document.getElementById('welcome-message');

function setWelcomeUserName(userName) {
    welcomeMessage.innerHTML = `Welcome to ShareIT, ${userName}! Let’s help you find your ideal roommate`;
}