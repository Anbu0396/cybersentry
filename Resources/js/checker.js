document.querySelector('#check').addEventListener('submit', function(event) {
    event.preventDefault();
    let password = document.querySelector('input[name="password"]').value;
    let conditionCount = 0;

    const passwordConditions = [
        { regex: /[0-9]/, element: password },
        { regex: /[a-z]/, element: password },
        { regex: /[A-Z]/, element: password },
        { regex: /[\\@#$-/:-?{-~!"^_`\[\]]/, element: password },
    ];

    let val = document.querySelector("#valid");
    if(password.trim() === "") {
        val.innerText = "Enter the password first";
        val.style.color = "red";
    } else {
        val.innerText = "";
        passwordConditions.forEach((condition) => {
            if (condition.element.match(condition.regex)) {
                conditionCount++;
            }
        });

        if(password.length > 8) {
            conditionCount++;
        }

        let qualityElement = document.querySelector('#quality');
        let info = document.querySelector('#info');
        switch(conditionCount) {
            case 0:
            case 1:
                qualityElement.style.color = "red";
                qualityElement.innerText = "Poor";
                info.style.visibility = "visible";
                break;
            case 2:
                qualityElement.style.color = "orange";
                qualityElement.innerText = "Average";
                info.style.visibility = "visible";
                break;
            case 3:
                qualityElement.style.color = "#ffc300";
                qualityElement.innerText = "Good";
                info.style.visibility = "visible";
                break;
            default:
                qualityElement.style.color = "green";
                qualityElement.innerText = "Excellent";
                info.style.visibility = "visible";
        }
        checkPassword();
    }
});

function checkPassword() {
    let passVal = document.querySelector('input[name="password"]').value;
    
    updateCriteria(document.querySelector("#pc1"), passVal.length >= 8);
    updateCriteria(document.querySelector("#pc2"), /[0-9]/.test(passVal));
    updateCriteria(document.querySelector("#pc3"), /[a-z]/.test(passVal));
    updateCriteria(document.querySelector("#pc4"), /[A-Z]/.test(passVal));
    updateCriteria(document.querySelector("#pc5"), /[`~!@#$%^&*()_\-+=\[\]{}\\|:;<>?,./]/.test(passVal));
}

function updateCriteria(element, isValid) {
    if (element) {
        element.style.color = isValid ? "green" : "red";
        element.style.visibility = "visible";
        element.style.position = "relative";
    }
}
