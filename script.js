const quiz = document.getElementById("skin-quiz");
const recommendation = document.getElementById("recommendation");
const recommendationTitle = document.getElementById("recommendation-title");
const recommendationText = document.getElementById("recommendation-text");
const recommendedProducts = document.getElementById("recommended-products");


// =========================
// PRODUCT INFORMATION
// =========================

const products = {
    cleanser: {
        name: "Nova Balance Cleanser",
        price: "₦7,500",
        description:
            "Gently cleanses away excess oil and helps keep clogged pores under control."
    },

    serum: {
        name: "Nova Clear Serum",
        price: "₦9,500",
        description:
            "Targets breakouts and the appearance of blemishes for clearer-looking skin."
    },

    moisturizer: {
        name: "Nova Restore Moisturizer",
        price: "₦8,500",
        description:
            "Replenishes moisture and helps support a healthy-looking skin barrier."
    },

    sunscreen: {
        name: "Nova Shield SPF 50",
        price: "₦10,000",
        description:
            "Broad-spectrum SPF 50 protection for your everyday skincare routine."
    }
};


// =========================
// QUESTIONNAIRE
// =========================

quiz.addEventListener("submit", function (event) {

    event.preventDefault();

    const customerName = document.getElementById("customer-name").value;
const customerEmail = document.getElementById("customer-email").value;


    const concern = document.querySelector(
        'input[name="concern"]:checked'
    ).value;

    const skinType = document.querySelector(
        'input[name="skinType"]:checked'
    ).value;

    const outdoor = document.querySelector(
        'input[name="outdoor"]:checked'
    ).value;

    const goal = document.querySelector(
        'input[name="goal"]:checked'
    ).value;


    // =========================
    // PRIMARY RECOMMENDATION
    // =========================

    let primaryProduct;

    if (concern === "breakouts") {
        primaryProduct = "serum";
    }

    else if (concern === "oil") {
        primaryProduct = "cleanser";
    }

    else if (concern === "dryness") {
        primaryProduct = "moisturizer";
    }

    else if (concern === "uneven") {
        primaryProduct = "serum";
    }

    else {
        primaryProduct = "sunscreen";
    }


    // =========================
    // SUPPORTING PRODUCTS
    // =========================

    let supportingProducts = [];

    // Oily skin → Cleanser
    if (
        skinType === "oily" &&
        primaryProduct !== "cleanser"
    ) {
        supportingProducts.push({
            product: "cleanser",
            reason: "Recommended as a supporting product for oily skin."
        });
    }

    // Dry skin → Moisturizer
    if (
        skinType === "dry" &&
        primaryProduct !== "moisturizer"
    ) {
        supportingProducts.push({
            product: "moisturizer",
            reason: "Recommended as a supporting product for dry skin."
        });
    }

    // Combination skin → Cleanser
    if (
        skinType === "combination" &&
        primaryProduct !== "cleanser"
    ) {
        supportingProducts.push({
            product: "cleanser",
            reason: "Recommended as a supporting product for combination skin."
        });
    }


    // =========================
    // OUTDOOR PROTECTION
    // =========================

    if (
        outdoor === "high" &&
        primaryProduct !== "sunscreen"
    ) {
        supportingProducts.push({
            product: "sunscreen",
            reason: "Recommended because you spend significant time outdoors."
        });
    }

    // =========================
// SEND DATA TO GOOGLE SHEETS
// =========================

fetch("https://script.google.com/macros/s/AKfycbxcNbijkfeSVqK9f72uahxUm2jcWHzNwJYPVm2dA1YXOZ9nHRUlW9irdd_hWCcz-Ms/exec", {
    method: "POST",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
        name: customerName,
        email: customerEmail,
        skinConcern: concern,
        skinType: skinType,
        outdoorExposure: outdoor,
        routineGoal: goal,
        recommendation: products[primaryProduct].name,
        supportingRecommendations: supportingProducts.map(function (item) {
            return products[item.product].name;
        })
    })
});

    // =========================
    // DISPLAY
    // =========================

    recommendedProducts.innerHTML = "";


    // PRIMARY PRODUCT

    const primary = products[primaryProduct];

    const primaryCard = document.createElement("div");

    primaryCard.className = "recommended-product primary-recommendation";

    primaryCard.innerHTML = `
        <span class="recommendation-label">
            PRIMARY RECOMMENDATION
        </span>

        <h3>${primary.name}</h3>

        <p>
            Recommended for your primary concern.
        </p>

        <p>${primary.description}</p>

        <span class="price">${primary.price}</span>

        <button class="primary-btn product-buy-btn">
            Buy ${primary.name}
        </button>
    `;

    recommendedProducts.appendChild(primaryCard);


    // SUPPORTING PRODUCTS

    supportingProducts.forEach(function (item) {

        const product = products[item.product];

        const card = document.createElement("div");

        card.className = "recommended-product";

        card.innerHTML = `
            <span class="recommendation-label">
                SUPPORTING RECOMMENDATION
            </span>

            <h3>${product.name}</h3>

            <p>${item.reason}</p>

            <p>${product.description}</p>

            <span class="price">${product.price}</span>

            <button class="primary-btn product-buy-btn">
                Buy ${product.name}
            </button>
        `;

        recommendedProducts.appendChild(card);
    });

// =========================
// WHATSAPP
// =========================

const whatsappNumber = "2349037557621";


// =========================
// COMPLETE ROUTINE BUTTON
// =========================

if (supportingProducts.length > 0) {

    const routineButton = document.createElement("button");

    routineButton.className = "primary-btn complete-routine-btn";

    routineButton.textContent = "Get the Complete Routine";

    recommendedProducts.appendChild(routineButton);

    routineButton.addEventListener("click", function () {

        const message =
           `Hi, I'm ${customerName}. I'd like to purchase the complete NOVA SKIN routine recommended for me. I got this recommendation from the NOVA SKIN website.`;

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

    });

}


// =========================
// INDIVIDUAL BUY BUTTONS
// =========================

const buyButtons = document.querySelectorAll(".product-buy-btn");

buyButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const productName = button.textContent.replace("Buy ", "");

        const message =
           `Hi, I'm ${customerName}. I'd like to purchase the ${productName}. I got this recommendation from the NOVA SKIN website.`;

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

    });

});

// =========================
// PERSONALIZED MESSAGE
// =========================

if (concern === "breakouts") {
    recommendationTitle.textContent =
        `${customerName}, here's your skin match for clearer-looking skin.`;
}
else if (concern === "oil") {
    recommendationTitle.textContent =
        `${customerName}, here's your skin match for balanced-looking skin.`;
}
else if (concern === "dryness") {
    recommendationTitle.textContent =
        `${customerName}, here's your skin match for hydrated-looking skin.`;
}
else {
    recommendationTitle.textContent =
        `${customerName}, here's your NOVA SKIN match.`;
}

if (supportingProducts.length > 0) {
    recommendationText.textContent =
        "We've selected a primary product for your main concern and added supporting products based on your skin type and routine.";
}
else {
    recommendationText.textContent =
        "We've selected the product that best matches your main skin concern and routine.";
}


    // Show recommendation

    recommendation.classList.add("active");

    recommendation.scrollIntoView({
        behavior: "smooth"
    });

});