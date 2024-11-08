window.addEventListener('scroll', function () {
    const elements = document.querySelectorAll('.fade-in');
    const screenHeight = window.innerHeight;

    elements.forEach(function (element) {
        const elementPosition = element.getBoundingClientRect().top;

        if (elementPosition < screenHeight - 100) {
            element.classList.add('active');
        }
    });
});
