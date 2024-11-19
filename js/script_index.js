document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission

    var name = document.getElementById("name").value;
    var reg = document.getElementById("reg").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var consentCheckbox = document.getElementById("consentCheckbox").checked;

    // email id should contain 'muj' or 'manipal' or 'edu'
    if (!email.includes('muj') && !email.includes('manipal') && !email.includes('edu')) {
        alert('Please enter a valid university email address with \'.edu\' or \'.muj\' or \'.manipal\' domain.');
        return;
    }

    console.log(name, reg, email, phone, consentCheckbox);

    // Clear the counter from localStorage
    localStorage.removeItem('counter');

    if (!consentCheckbox) {
        alert('Please agree to the consent form.');
        return;
    }

    var submitButton = document.getElementById("login");
    submitButton.disabled = true; // Disable the submit button

    // change the text of the submit button to "Loading..."
    submitButton.innerHTML = "Loading...";

    // basic data encryption
    var new_name = name.split('').reverse().join('');
    var new_reg = reg.split('').reverse().join('');
    var new_email = email.split('').reverse().join('');
    var new_phone = phone.split('').reverse().join('');

    // store the data in localStorage
    localStorage.setItem('question_type_number', 1);

    // transfer to the next page
    window.location.href = `qna.html?name=${new_name}&reg=${new_reg}&email=${new_email}&phone=${new_phone}`;
});

document.getElementById("consentHighlight").addEventListener("click", function() {
    document.getElementById("consentPopup").style.display = "block";
});

document.getElementById("closeConsent").addEventListener("click", function() {
    document.getElementById("consentPopup").style.display = "none";
});