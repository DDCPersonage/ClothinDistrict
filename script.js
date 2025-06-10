document.addEventListener('DOMContentLoaded', () => {
    // === Dark Mode Theme Switcher ===
    const switcher = document.getElementById('themeSwitcher');
    const body = document.body;

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        if (switcher) switcher.checked = true;
        body.classList.add('dark-mode');
    }

    // Toggle theme on switch change
    switcher?.addEventListener('change', () => {
        if (switcher.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // === Existing Cart & Other Logic ===
    let cart = JSON.parse(localStorage.getItem('clothinDistrictCart')) || [];

    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalAmountSpan = document.getElementById('cart-total-amount');

    function showNotification(message) {
        let notification = document.getElementById('notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'notification';
            notification.classList.add('notification');
            document.body.appendChild(notification);
        }
        notification.textContent = message;
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    function saveCart() {
        localStorage.setItem('clothinDistrictCart', JSON.stringify(cart));
    }

    function updateCartDisplay() {
        if (cartItemsDiv && cartTotalAmountSpan) {
            cartItemsDiv.innerHTML = '';
            let total = 0;

            if (cart.length === 0) {
                cartItemsDiv.innerHTML = '<p>Your cart is looking a little empty. Time to shop!</p>';
            } else {
                cart.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('cart-item-display');
                    itemDiv.innerHTML = `
                        <span>${item.name} x ${item.quantity}</span>
                        <span>₹ ${(item.price * item.quantity).toFixed(2)}</span>
                    `;
                    cartItemsDiv.appendChild(itemDiv);
                    total += item.price * item.quantity;
                });
            }
            cartTotalAmountSpan.textContent = '₹ ' + total.toFixed(2);
        }

        if (cartCountSpan) {
            cartCountSpan.textContent = cart.length;
        }
    }

    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;
            const productPrice = parseFloat(event.target.dataset.productPrice);

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            saveCart();
            updateCartDisplay();
            showNotification(`${productName} added to cart!`);
        });
    });

    const clearCartButton = document.querySelector('.clear-cart-button');
    if (clearCartButton) {
        clearCartButton.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is already empty!');
                return;
            }
            cart = [];
            saveCart();
            updateCartDisplay();
            showNotification('Cart has been cleared!');
        });
    }

    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Your cart is empty. Please add items before checking out.');
            } else {
                showNotification('Proceeding to simulated checkout! (No actual payment or order processing)');
                cart = [];
                saveCart();
                updateCartDisplay();
            }
        });
    }

    // Contact Form submission logic
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            console.log('Form Submitted!');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Message:', message);

            formMessage.textContent = 'Thank you for your message! We will get back to you shortly.';
            formMessage.style.display = 'block';
            formMessage.style.color = '#28a745';

            contactForm.reset();

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#products' || targetId === '#about') {
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (targetId === '#footer-contact-form') {
                document.querySelector('.footer-section.contact-info').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lazy Loading for Images and Videos
    const lazyImages = document.querySelectorAll('img.lazyload');
    const lazyVideos = document.querySelectorAll('video.lazyload-video');

    const lazyLoad = target => {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.dataset.src;
                    img.setAttribute('src', src);
                    img.classList.remove('lazyload');
                    observer.disconnect();
                }
            });
        }, { rootMargin: '0px 0px -50px 0px' });
        io.observe(target);
    };

    const lazyLoadVideo = target => {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    for (const source of video.querySelectorAll('source')) {
                        source.src = source.dataset.src;
                    }
                    video.load();
                    video.classList.remove('lazyload-video');
                    observer.disconnect();
                }
            });
        }, { rootMargin: '0px 0px -100px 0px' });
        io.observe(target);
    };

    lazyImages.forEach(lazyLoad);
    lazyVideos.forEach(lazyLoadVideo);

    // Initial cart display when the page loads
    updateCartDisplay();
});