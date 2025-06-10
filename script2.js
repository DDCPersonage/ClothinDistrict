document.addEventListener('DOMContentLoaded', () => {

    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const age = document.getElementById('age').value;
            const gender = document.getElementById('gender').value;
            const message = document.getElementById('message').value;

            console.log('Form Submitted!');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Age:', age);
            console.log('Gender:', gender); 
            console.log('Message:', message);

            gtag('event' , 'contact_event' , {
                user_name : name,
                user_email : email,
                message_char_count: message.length,
                submission_count:1,
                user_age: age,
                user_gender: gender,
                user_message: message
            })

            formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            formMessage.style.color = '#28a745';
            formMessage.style.display = 'block'; 

            contactForm.reset();

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    }
});