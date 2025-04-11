document.getElementById("view").addEventListener("submit", async function (e) {
    e.preventDefault(); 

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.href = "/mypass"; 
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
    }
});
