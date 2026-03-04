// --- 1. Product Database ---
const products = [
  {
    id: "hw-01",
    name: "Wi-Fi Adapter | TP-Link TL-WN722N (v1)",
    category: "hardware",
    price: 5500,
    image: "images/adapter_1.png",
    images: [
      "images/adapter_1.png",
      "images/adapter_2.png",
      "images/adapter_3.png",
    ],
    desc: `Wi-Fi Adapter with Monitor Mode & Packet Injection support. The TP-Link TL-WN722N v1 runs on the reliable Atheros AR9271 chipset, trusted for stable performance in security labs.

Supports 150 Mbps Wireless N, external high-gain antenna, and works smoothly with Linux like Kali Linux, Parrot OS, and Ubuntu.

Perfect for ethical hacking practice, packet analysis, and penetration testing setups. ⚡

Important: Only Version 1 (v1) has the AR9271 chipset. Later versions (v2/v3) do not support monitor mode natively.
`,
    paymentLink: "", // TODO (Backend Port): Add Gumroad product URL here
  },
  {
    id: "pdf-01",
    name: "Black Hat Python 2.0 | Advanced Hacker's Guide",
    category: "pdf-books",
    price: 70,
    image: "images/PDF Books Images/black-hat-python-2nd-edition.jpg",
    images: ["images/PDF Books Images/black-hat-python-2nd-edition.jpg"],
    desc: `Master the art of writing powerful Python tools for network discovery, packet manipulation, and web system exploitation.
This definitive guide dives deep into offensive security concepts, equipping you with the skills to build custom exploits and offensive tools from scratch.

⚠️ Note: Prior Python programming understanding is an absolute must before initializing this module.`,
    paymentLink: "",
  },
  {
    id: "pdf-02",
    name: "The Art of Exploitation | Core Hacking Foundations",
    category: "pdf-books",
    price: 70,
    image:
      "images/PDF Books Images/hacking-the-art-of-exploitation-by-jon-erickson-2nd-edition.jpg",
    images: [
      "images/PDF Books Images/hacking-the-art-of-exploitation-by-jon-erickson-2nd-edition.jpg",
    ],
    desc: `A comprehensive deep dive into the underlying architecture of modern systems and how to systematically exploit them.
Learn to think like a true hacker by exploring network communications, memory corruption, and assembly language fundamentals.
This essential manual bridges the gap between theoretical knowledge and practical, foundational exploit development.`,
    paymentLink: "",
  },
];

// --- 2. State & DOM Elements ---
let cart = JSON.parse(localStorage.getItem("bytevault_cart")) || [];

// DOM Elements
const productGrid = document.getElementById("product-grid");
const categoryTitle = document.getElementById("category-title");
const navLinksContainer = document.getElementById("nav-links");
const navItems = document.querySelectorAll(".nav-item");
const hamburgerBtn = document.getElementById("hamburger-menu");

// Cart DOM
const cartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartOverlay = document.getElementById("cart-overlay");
const cartBadge = document.getElementById("cart-badge");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");

// Modal DOM
const modalOverlay = document.getElementById("product-modal-overlay");
const closeModalBtn = document.getElementById("close-product-modal");
const modalTitle = document.getElementById("modal-title");
const modalPrice = document.getElementById("modal-price");
const modalDesc = document.getElementById("modal-desc");
const modalImage = document.getElementById("modal-image");
const modalAddCartBtn = document.getElementById("modal-add-cart");

// Checkout DOM
const openCheckoutBtn = document.getElementById("open-checkout-btn");
const closeCheckoutModalBtn = document.getElementById("close-checkout-modal");
const checkoutModalOverlay = document.getElementById("checkout-modal-overlay");
const checkoutSummaryItems = document.getElementById("checkout-summary-items");
const checkoutFinalPrice = document.getElementById("checkout-final-price");
const pdfDeliveryNote = document.getElementById("pdf-delivery-note");
const confirmOrderBtn = document.getElementById("confirm-order-btn");
const checkoutForm = document.getElementById("checkout-form");

// Success Modal DOM
const successModalOverlay = document.getElementById("success-modal-overlay");
const closeSuccessModalBtn = document.getElementById("close-success-modal");
const successContinueBtn = document.getElementById("success-continue-btn");
const successOrderIdElement = document.getElementById("success-order-id");

let currentModalProduct = null;

// --- 3. Rendering Logic ---

/**
 * Initializes the store by rendering all products
 */
function initStore() {
  renderProducts(products);
  setupEventListeners();
  updateCartDisplay();
}

/**
 * Renders an array of product objects to the grid
 * @param {Array} items - Array of product objects
 */
function renderProducts(items) {
  productGrid.innerHTML = ""; // Clear grid

  if (items.length === 0) {
    productGrid.innerHTML =
      '<p class="category-subtitle">No products found in this sector.</p>';
    return;
  }

  items.forEach((product) => {
    // Create card element
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = product.id;

    // Card Inner HTML
    card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="card-image" loading="lazy">
            <div class="card-content">
                <h3 class="card-title">${product.name}</h3>
                <p class="card-price">Rs ${product.price.toLocaleString()}</p>
                <button class="add-cart-btn" data-id="${product.id}" aria-label="Add ${product.name} to cart">
                    <i class="fas fa-plus"></i> ADD_TO_CART
                </button>
            </div>
        `;

    // Event listener for opening modal (click on card body, not button)
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".add-cart-btn")) {
        openProductModal(product);
      }
    });

    // Event listener for add to cart button
    const addBtn = card.querySelector(".add-cart-btn");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(product);
    });

    // Append to grid
    productGrid.appendChild(card);
  });
}

// --- 4. Filtering Logic ---

function filterProducts(category) {
  if (category === "all") {
    categoryTitle.textContent = "All Products";
    renderProducts(products);
  } else {
    const filtered = products.filter((p) => p.category === category);

    // Format title: 'pdf-books' -> 'PDF Books'
    const titleText = category.replace("-", " ");
    categoryTitle.textContent = titleText;

    renderProducts(filtered);
  }
}

// --- 5. Cart Logic ---

function saveCart() {
  localStorage.setItem("bytevault_cart", JSON.stringify(cart));
}

function addToCart(product) {
  // Check if modifying existing item
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    // If we want to support quantities, we can increment here.
    // For a minimal store, let's keep it 1 max for digital/hardware goods or just add multiple
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();

  // Visual feedback
  showSubtleNotification(`Added ${product.name}`);
  updateCartDisplay();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartDisplay();
}

function updateCartDisplay() {
  // Update Badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;

  // Update Sidebar HTML
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<div class="empty-cart-msg">Memory is empty. Add items.</div>';
    cartTotalPrice.textContent = "Rs 0";
    return;
  }

  let totalCost = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalCost += itemTotal;

    const cartElement = document.createElement("div");
    cartElement.className = "cart-item";
    cartElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name} ${item.quantity > 1 ? `(x${item.quantity})` : ""}</h4>
                <p class="cart-item-price">Rs ${itemTotal.toLocaleString()}</p>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

    // Remove listener
    cartElement
      .querySelector(".cart-item-remove")
      .addEventListener("click", () => {
        removeFromCart(item.id);
      });

    cartItemsContainer.appendChild(cartElement);
  });

  cartTotalPrice.textContent = `Rs ${totalCost.toLocaleString()}`;
}

// --- 6. Modal Logic ---

function openProductModal(product) {
  currentModalProduct = product;

  // Populate Data
  modalTitle.textContent = product.name;
  modalPrice.textContent = `Rs ${product.price.toLocaleString()}`;
  // Replace newline characters with <br> tags for the modal description to preserve spacing
  modalDesc.innerHTML = product.desc.replace(/\n/g, "<br>");
  modalImage.src = product.image;
  modalImage.alt = product.name;

  // Inject image gallery if multiple images are provided
  const galleryContainer = document.getElementById("modal-gallery-container");
  if (galleryContainer) {
    if (product.images && product.images.length > 1) {
      galleryContainer.style.display = "flex";
      galleryContainer.innerHTML = product.images
        .map(
          (imgSrc) =>
            `<img src="${imgSrc}" class="gallery-thumb" onclick="document.getElementById('modal-image').src='${imgSrc}'" style="width: 60px; height: 60px; object-fit: cover; border: 1px solid var(--neon-green); cursor: pointer; border-radius: 4px; transition: 0.2s;" />`,
        )
        .join("");
    } else {
      galleryContainer.style.display = "none";
      galleryContainer.innerHTML = "";
    }
  }

  // Show Overlay
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeProductModal() {
  currentModalProduct = null;
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// --- 7. Checkout Logic ---

function openCheckoutModal() {
  if (cart.length === 0) {
    showSubtleNotification("Memory is empty. Add items first.");
    return;
  }

  // Quick hide cart
  cartOverlay.classList.remove("active");

  renderCheckoutSummary();

  checkoutModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  checkoutModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

function renderCheckoutSummary() {
  checkoutSummaryItems.innerHTML = "";
  let totalCost = 0;
  let hasPdf = false;

  cart.forEach((item) => {
    if (item.category === "pdf-books") {
      hasPdf = true;
    }

    const itemRealPrice = item.price;
    const itemMarkupPrice = item.price * 1.2; // 20% markup to show "discount"

    const itemTotal = itemRealPrice * item.quantity;
    totalCost += itemTotal;

    const summaryEl = document.createElement("div");
    summaryEl.className = "checkout-summary-item";
    summaryEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="summary-details">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                    <h4>${item.name} <span style="opacity: 0.6">(x${item.quantity})</span></h4>
                    <button class="checkout-item-remove" aria-label="Remove item" style="color: var(--text-secondary); background: none; border: none; cursor: pointer; transition: color 0.3s; font-size: 1.1rem; padding: 0;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
                <div class="summary-pricerow">
                    <span class="original-price">Rs ${(itemMarkupPrice * item.quantity).toLocaleString()}</span>
                    <span class="discounted-price">Rs ${itemTotal.toLocaleString()}</span>
                </div>
            </div>
        `;

    summaryEl.querySelector(".checkout-item-remove").addEventListener("click", () => {
      removeFromCart(item.id);
      if (cart.length === 0) {
        closeCheckoutModal();
        showSubtleNotification("Memory is empty.");
      } else {
        renderCheckoutSummary();
      }
    });

    checkoutSummaryItems.appendChild(summaryEl);
  });

  checkoutFinalPrice.textContent = `Rs ${totalCost.toLocaleString()}`;

  if (hasPdf) {
    pdfDeliveryNote.style.display = "block";
  } else {
    pdfDeliveryNote.style.display = "none";
  }
}

// --- 8. Utilities & Event Listeners Setup ---

function showSubtleNotification(message) {
  // Minimalist custom notification
  const notif = document.createElement("div");
  notif.textContent = `> ${message}`;
  notif.style.position = "fixed";
  notif.style.bottom = "20px";
  notif.style.left = "50%";
  notif.style.transform = "translateX(-50%)";
  notif.style.backgroundColor = "var(--neon-green)";
  notif.style.color = "var(--bg-color)";
  notif.style.padding = "10px 20px";
  notif.style.borderRadius = "4px";
  notif.style.fontFamily = "var(--font-mono)";
  notif.style.fontWeight = "bold";
  notif.style.zIndex = "2000";
  notif.style.boxShadow = "var(--glow-shadow)";
  notif.style.opacity = "0";
  notif.style.transition = "opacity 0.3s ease";

  document.body.appendChild(notif);

  // Fade in
  setTimeout(() => (notif.style.opacity = "1"), 10);

  // Fade out and remove
  setTimeout(() => {
    notif.style.opacity = "0";
    setTimeout(() => notif.remove(), 300);
  }, 2000);
}

function setupEventListeners() {
  // Nav Navigation
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all
      navItems.forEach((nav) => nav.classList.remove("active"));
      // Add to current
      e.currentTarget.classList.add("active");

      const category = e.currentTarget.dataset.category;
      filterProducts(category);

      // Close mobile menu if open
      if (navLinksContainer.classList.contains("active")) {
        navLinksContainer.classList.remove("active");
        hamburgerBtn.classList.remove("active");
      }
    });
  });

  // Hamburger Menu Toggle
  hamburgerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hamburgerBtn.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
  });

  // Close mobile menu when clicking outside (main store area)
  document.addEventListener("click", (e) => {
    if (
      navLinksContainer.classList.contains("active") &&
      !e.target.closest(".nav-links") &&
      !e.target.closest("#hamburger-menu")
    ) {
      navLinksContainer.classList.remove("active");
      hamburgerBtn.classList.remove("active");
    }
  });

  // Cart Sidebar Toggles
  cartBtn.addEventListener("click", () => {
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeCartBtn.addEventListener("click", () => {
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close Cart on overlay click
  cartOverlay.addEventListener("click", (e) => {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Modal Close toggles
  closeModalBtn.addEventListener("click", closeProductModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeProductModal();
    }
  });

  // Modal Add Cart Btn
  modalAddCartBtn.addEventListener("click", () => {
    if (currentModalProduct) {
      addToCart(currentModalProduct);
      closeProductModal();
      // Automatically open cart to show it was added?
      // cartOverlay.classList.add('active');
    }
  });

  // Success Modal Close toggles
  closeSuccessModalBtn.addEventListener("click", closeSuccessModal);
  successContinueBtn.addEventListener("click", closeSuccessModal);

  successModalOverlay.addEventListener("click", (e) => {
    if (e.target === successModalOverlay) {
      closeSuccessModal();
    }
  });

  // Checkout Event Listeners
  openCheckoutBtn.addEventListener("click", openCheckoutModal);
  closeCheckoutModalBtn.addEventListener("click", closeCheckoutModal);

  checkoutModalOverlay.addEventListener("click", (e) => {
    if (e.target === checkoutModalOverlay) {
      closeCheckoutModal();
    }
  });

  confirmOrderBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // Basic Validation
    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    // 1. Gather Customer Data
    const name = document.getElementById("checkout-name").value;
    const email = document.getElementById("checkout-email").value;
    const whatsapp = document.getElementById("checkout-whatsapp").value;
    const address = document.getElementById("checkout-address").value;

    // 2. Disable Button & Show Loading State
    const originalBtnText = confirmOrderBtn.innerHTML;
    confirmOrderBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING...';
    confirmOrderBtn.disabled = true;

    // 3. Generate Time-Based Order ID
    const now = new Date();
    const XX = String(now.getHours()).padStart(2, "0");
    const YY_min = String(now.getMinutes()).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const MM = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const YY_year = String(now.getFullYear()).slice(-2);

    // Format as: 0xXXHYYMDDMMYY
    const orderIdString = `0x${XX}H${YY_min}M${DD}${MM}${YY_year}`;

    // 4. Calculate Totals
    let totalCost = 0;
    const orderItemsForEmail = cart.map((item) => {
      const itemTotal = item.price * item.quantity;
      totalCost += itemTotal;
      // Map to EmailJS array format (HTML template uses {{#orders}} loop)
      return {
        name: item.name,
        units: item.quantity,
        price: itemTotal.toLocaleString(),
        // Use absolute un-relativized image paths so they render in emails properly
        image_url: "https://usaihack.github.io/Portfolio/Store/" + encodeURI(item.image)
      };
    });

    // Free shipping for all items
    const shippingCost = 0;
    const grandTotal = totalCost + shippingCost;

    // 5. Build Template Parameters object
    const templateParams = {
      order_id: orderIdString,
      customer_name: name,
      customer_email: email,
      customer_whatsapp: whatsapp,
      customer_address: address,
      cost_subtotal: totalCost.toLocaleString(),
      cost_shipping: shippingCost.toLocaleString(),
      cost_total: grandTotal.toLocaleString(),
      orders: orderItemsForEmail, // Array mapping for dynamic tables
    };

    // 6. Send Emails Concurrenty using Usman's Service IDs
    const SERVICE_ID = "service_x1o22so";
    const TEMPLATE_CUSTOMER = "template_zog0pao";
    const TEMPLATE_STORE = "template_7ma6n2k";

    Promise.all([
      emailjs.send(SERVICE_ID, TEMPLATE_CUSTOMER, templateParams),
      emailjs.send(SERVICE_ID, TEMPLATE_STORE, templateParams),
    ])
      .then(() => {
        // Empty Cart
        cart = [];
        saveCart();
        updateCartDisplay();

        // Hide Checkout Modal, Show Success Modal
        closeCheckoutModal();
        checkoutForm.reset();
        confirmOrderBtn.innerHTML = originalBtnText;
        confirmOrderBtn.disabled = false;

        showSuccessModal(orderIdString);
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        showSubtleNotification(
          `Transmission Failed. Please try again or contact support.`,
        );
        confirmOrderBtn.innerHTML = originalBtnText;
        confirmOrderBtn.disabled = false;
      });
  });
}

function showSuccessModal(orderId) {
  successOrderIdElement.textContent = `Order ID: ${orderId}`;
  successModalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSuccessModal() {
  successModalOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", initStore);
