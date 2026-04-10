document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("#waitlistForm");
    const messageBox = document.querySelector("#message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            first_name: document.querySelector("#first_name").value,
            last_name: document.querySelector("#last_name").value,
            email: document.querySelector("#email").value,
            phone_no: document.querySelector("#phone_no").value,
            reason: document.querySelector("#reason").value,
        };

        try {
            const res = await fetch("http://localhost:3000/api/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            // ❌ ERROR CASE
            if (!res.ok) {
                messageBox.innerText = result.message;
                messageBox.style.color = "red";
                return;
            }

            // ✅ SUCCESS CASE
            messageBox.innerText = "Waitlist created successfully 🚀";
            messageBox.style.color = "green";

            form.reset();

        } catch (err) {
            console.error(err);
            messageBox.innerText = "Something went wrong ❌";
            messageBox.style.color = "red";
        }
    });

});