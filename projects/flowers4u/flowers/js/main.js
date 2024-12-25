onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");

    const titles = ('Flowers for you <3').split('');
    const titleElement = document.getElementById('title');
    let index = 0;

    function appendTitle() {
      if (index < titles.length) {
        titleElement.innerHTML += titles[index];
        index++;
        setTimeout(appendTitle, 100); // 100ms delay
      }
    }

    appendTitle();

    clearTimeout(c);
  }, 1000);
};

function showModal() {
  document.getElementById('modalOverlay').style.display = 'block';
}

function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}

// Close modal when clicking outside
document.getElementById('modalOverlay').addEventListener('click', function (e) {
  if (e.target === this) {
    closeModal();
  }
});