document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('nav ul li a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            const headerOffset = document.querySelector('header').offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    const images = document.querySelectorAll('.project-card img, .tool-card img');
    const modal = document.createElement('div');
    const modalImg = document.createElement('img');

    modal.classList.add('modal');
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    images.forEach(image => {
        image.addEventListener('click', function () {
            modalImg.src = this.src;
            modal.classList.add('show');
        });
    });

    modal.addEventListener('click', function () {
        modal.classList.remove('show');
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('nav ul');

    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });
});

// CSS for modal in the same file for quick reference
const style = document.createElement('style');
style.innerHTML = `
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        justify-content: center;
        align-items: center;
    }
    .modal.show {
        display: flex;
    }
    .modal img {
        max-width: 80%;
        max-height: 80%;
    }
`;
document.head.appendChild(style);
