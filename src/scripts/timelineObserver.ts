const observerOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.timeline-item').forEach((item) => {
                if (item.getAttribute('data-section') === id) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });
}, observerOptions);
document.querySelectorAll('section[id]').forEach((section) => {
    observer.observe(section);
});