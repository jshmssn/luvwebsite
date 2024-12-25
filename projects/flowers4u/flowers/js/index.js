
// Session check function (add this to profile.html)
function checkSession() {
  const userSession = localStorage.getItem('userSession');
  const sessionTimestamp = localStorage.getItem('sessionTimestamp');
  
  // Check if session exists and is not expired (24 hours expiration)
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (!userSession || !sessionTimestamp || 
      Date.now() - parseInt(sessionTimestamp) > SESSION_DURATION) {
      // Session doesn't exist or has expired
      localStorage.removeItem('userSession');
      localStorage.removeItem('sessionTimestamp');
      window.location.href = "../index.html";
  }
}

const title = document.querySelector('.title')
const text = 'I have something for you'.split('')
for (let index = 0; index < text.length; index++) {
  if (text[index] !== ' ') {
    title.innerHTML += `<span>${text[index]}<span/>`;
  } else {
    title.innerHTML += `<span style='margin-right: 20px;'><span/>`;
  }
}

const textElements = document.querySelectorAll('.title span');
textElements.forEach((element) => {
  const randomDelay = Math.random() * 3; // Menghasilkan delay acak antara 0 hingga 3 detik
  element.style.animationDelay = `${randomDelay}s`;
});