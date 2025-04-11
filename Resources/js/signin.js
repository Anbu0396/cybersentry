document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries()); // Convert form data to JSON

    try {
        const response = await fetch("/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message); // Show success message
            window.location.href = result.redirect; // Redirect to the home page
        } else {
            alert(result.message); // Show error message
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong. Please try again.");
    }
});
