const form = document.getElementById("form");
const name = document.getElementById("name");
const user = document.getElementById("username");
const mail = document.getElementById("email");
const pass = document.getElementById("pass");
const vpass = document.getElementById("vpass");
const pc1 = document.getElementById("pc1");
const pc2 = document.getElementById("pc2");
const pc3 = document.getElementById("pc3");
const pc4 = document.getElementById("pc4");
const pc5 = document.getElementById("pc5");


function checkName() {
    let userVal = name.value.trim();
    if(userVal === '') {
        updateStatus(name,"Name cannot be Empty", false);
    } else if(!userVal.match(/^[a-zA-Z\." "]*$/)) {
        updateStatus(name,"Name only contains characters,space and dot only don't accept others", false);
    } else {
        updateStatus(name,"Name accepted", true);
    }
}

function checkUser() {
    let userVal = user.value.trim();
    if(userVal === '') {
        updateStatus(user,"UserName cannot be Empty", false);
    } else {
        updateStatus(user,"Username accepted", true);
    }
}

function checkEmail(){
    let mailVal = mail.value.trim();
    if (mailVal === '') {
        updateStatus(mail, 'Email Cannot be Empty', false);
    } else if (!isEmail(mailVal)) {
        updateStatus(mail, 'Enter a Valid Email', false);
    } else {
        updateStatus(mail,'Email is verified', true);
    }
}

function checkPassword(){
    let passVal = pass.value.trim();
    
    if (passVal === '') {
        updateStatus(pass, 'Password Cannot be Empty', false);
    } else {
        updateStatus(pass,'', true);
        pass.style.border="1px solid black";
    }

    updateCriteria(pc1, passVal.length >= 8);
    updateCriteria(pc2, /^(?=.*[0-9])/.test(passVal));
    updateCriteria(pc3, /^(?=.*[a-z])/.test(passVal));
    updateCriteria(pc4, /^(?=.*[A-Z])/.test(passVal));
    updateCriteria(pc5, /[\\@#$-/:-?{-~!"^_`\[\]]/.test(passVal));
}

function checkConfirmPassword(){
    let passVal = pass.value.trim();
    let vpassVal = vpass.value.trim();
    if(vpassVal ==='') {
        updateStatus(vpass,"confirm password cannot be Empty", false);
    } else if(passVal === vpassVal) {
        updateStatus(vpass,"Password verifed", true);
    } else {
        updateStatus(vpass,"password and confirm password are mismatch", false);
    }
}

function updateStatus(input, message, isSuccess) {
    const inputGroup = input.parentElement;
    const small = inputGroup.querySelector("small");
    inputGroup.className = isSuccess ? "input success" : "input error";
    small.innerText = message;
}

function isEmail(mailVal) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(mailVal).toLowerCase());
}

function updateCriteria(element, isValid) {
    element.style.color = isValid ? "green" : "red";
    element.style.visibility = "visible";
    element.style.position = "relative";
}

function UserExists(userExists){
    if(userExists)
    {
        updateStatus(user, 'Username is already taken try another', false);
    }
}

function UserExists(emailExists){
    if(emailExists)
    {
        updateStatus(mail, 'Email is already taken try another', false);
    }
}

document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById("name").value,
        username: document.getElementById("username").value,
        gender: document.querySelector("input[name='gender']:checked").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        password: document.getElementById("pass").value,
    };

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        alert(data.message);

        if (response.ok) {
            window.location.href = "/signin";
        }
    } catch (err) {
        console.error("Error:", err);
    }
});

document.getElementById("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
        window.location.href = result.redirect; // Redirect to index page
    } else {
        alert(result.message);
    }
});

