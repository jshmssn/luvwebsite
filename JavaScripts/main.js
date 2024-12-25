document.addEventListener("DOMContentLoaded", function () {
    function loadContent(selector, url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                document.querySelector(selector).innerHTML = data;
            })
            .catch(error => console.error(error));
    }

    // Load the header, footer, and default body content
    loadContent('#footer-placeholder', 'layout/footer.html');

    // Load body content based on a query parameter (e.g., ?page=about)
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page') || 'dashboard'; // Default to 'home' if no page is specified
    loadContent('#body-placeholder', `pages/${page}.html`);

    // Remove 'websites.html' from the URL without reloading the page
    // if (window.location.pathname.endsWith('websites.html')) {
    //     // Use history.pushState to remove 'websites.html' from the URL
    //     const newUrl = window.location.href.replace('websites.html', '');
    //     history.pushState(null, '', newUrl);
    // }
});
