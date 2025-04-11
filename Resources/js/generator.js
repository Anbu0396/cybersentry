const charSets = {
    "num": '0123456789',
    "small": 'abcdefghijklmnopqrstuvwxyz',
    "cap": 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    "spe": '`~!@#$%^&*()_-+=[]{}\\|:;<>?,./'
};

function generate(n, selectedSets) {
    let characters = selectedSets.join('');
    if (!characters) return ''; 
    
    let randomString = '';
    for (let i = 0; i < n; i++) {
        let index = Math.floor(Math.random() * characters.length);
        randomString += characters[index];
    }
    return randomString;
}

document.querySelector('#keyForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    let selectedSets = [];
    if (document.getElementById('num').checked) selectedSets.push(charSets["num"]);
    if (document.getElementById('small').checked) selectedSets.push(charSets["small"]);
    if (document.getElementById('cap').checked) selectedSets.push(charSets["cap"]);
    if (document.getElementById('spe').checked) selectedSets.push(charSets["spe"]);

    let n = parseInt(document.getElementById('len').value);
    let passField = document.getElementById("output");

    let generatedPassword = generate(n, selectedSets);
    passField.value = generatedPassword;
    passField.style.borderColor = "#134770";
    passField.style.visibility="visible";
    
    updatePasswordStrength(generatedPassword);
});

function updatePasswordStrength(password) {
    let conditionCount = 0;
    
    if (password.length >= 8) conditionCount++;
    if (/[0-9]/.test(password)) conditionCount++;
    if (/[a-z]/.test(password)) conditionCount++;
    if (/[A-Z]/.test(password)) conditionCount++;
    if (/[`~!@#$%^&*()_\-+=\[\]{}\\|:;<>?,./]/.test(password)) conditionCount++;

    let qualityElement = document.querySelector('#quality');

    switch (conditionCount) {
        case 0:
        case 1:
            qualityElement.style.color = "red";
            qualityElement.innerText = "Poor";
            break;
        case 2:
            qualityElement.style.color = "orange";
            qualityElement.innerText = "Average";
            break;
        case 3:
            qualityElement.style.color = "#ffc300";
            qualityElement.innerText = "Good";
            break;
        default:
            qualityElement.style.color = "green";
            qualityElement.innerText = "Excellent";
    }
}
