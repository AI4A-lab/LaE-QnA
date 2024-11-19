// URL parameters
const urlParams = new URLSearchParams(window.location.search);

const encrypt_name = urlParams.get('name');
const encrypt_id = urlParams.get('reg');
const encrypt_email = urlParams.get('email');
const encrypt_phone = urlParams.get('phone');

// Decrypt the data
const u_name = encrypt_name.split('').reverse().join('');
const u_reg = encrypt_id.split('').reverse().join('');
const u_email = encrypt_email.split('').reverse().join('');
const u_phone = encrypt_phone.split('').reverse().join('');

const name_u = document.getElementById("name");
const reg = document.getElementById("reg");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

function displayData() {
    name_u.innerHTML = u_name;
    reg.innerHTML = `(ID: ${u_reg})`;
}

displayData();