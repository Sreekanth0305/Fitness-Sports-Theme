document.addEventListener("DOMContentLoaded", function () {

    // Page loading animation
    const loader = document.getElementById("page-loader");

    if (loader) {
        window.addEventListener("load", function () {
            setTimeout(function () {
                loader.classList.add("hide");
            }, 400);
        });

        // Fallback in case the load event has already happened
        if (document.readyState === "complete") {
            setTimeout(() => loader.classList.add("hide"), 400);
        }
    }

    // Mobile navigation
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("show");
            menuToggle.textContent =
                navLinks.classList.contains("show") ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("show");
                menuToggle.textContent = "☰";
            });
        });
    }

    // Scroll reveal animation
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    // FAQ accordion
    document.querySelectorAll(".faq-question").forEach(button => {
        button.addEventListener("click", function () {
            const item = button.closest(".faq-item");
            item.classList.toggle("open");
        });
    });

    // Signup form
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim().toLowerCase();
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const terms = document.getElementById("terms").checked;
            const message = document.getElementById("signupMessage");

            if (password.length < 6) {
                showMessage(message, "Password must contain at least 6 characters.", "error");
                return;
            }

            if (password !== confirmPassword) {
                showMessage(message, "Passwords do not match.", "error");
                return;
            }

            if (!terms) {
                showMessage(message, "Please accept the terms and conditions.", "error");
                return;
            }

            const users = JSON.parse(localStorage.getItem("fitnessUsers") || "[]");

            if (users.some(user => user.email === email)) {
                showMessage(message, "This email is already registered. Please log in.", "error");
                return;
            }

            users.push({
                name: name,
                email: email,
                password: password
            });

            localStorage.setItem("fitnessUsers", JSON.stringify(users));

            showMessage(message, "Account created successfully! Redirecting to login...", "success");

            signupForm.reset();

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        });
    }

    // Login form
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const password = document.getElementById("loginPassword").value;
            const message = document.getElementById("loginMessage");

            const users = JSON.parse(localStorage.getItem("fitnessUsers") || "[]");

            const matchedUser = users.find(user =>
                user.email === email && user.password === password
            );

            if (!matchedUser) {
                showMessage(message, "Invalid email or password. Please check your details or sign up.", "error");
                return;
            }

            localStorage.setItem("fitnessLoggedInUser", JSON.stringify({
                name: matchedUser.name,
                email: matchedUser.email
            }));

            showMessage(message, "Login successful! Welcome, " + matchedUser.name + ".", "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1200);
        });
    }

    // Demo membership button
    document.querySelectorAll(".membership-button").forEach(button => {
        button.addEventListener("click", function () {
            const plan = button.dataset.plan || "selected";
            const user = localStorage.getItem("fitnessLoggedInUser");

            if (!user) {
                alert("Please log in or create an account before selecting a membership plan.");
                window.location.href = "login.html";
                return;
            }

            alert("You selected the " + plan + " plan. This is a demo website; no payment has been made.");
        });
    });

});

function showMessage(element, message, type) {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message " + type;
}