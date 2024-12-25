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
