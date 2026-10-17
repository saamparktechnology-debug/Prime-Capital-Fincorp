const fullCatalog = [
  {
    id: 1,
    name: "BharatPe",
    category: "Loans & Credit",
    image: "img/banks/bharatpe.png",
    icon: "fa-solid fa-wallet",
    audience: [
      "Merchants & Small Business Owners",
      "Accepts digital payments",
      "Valid business proof or establishment",
    ],
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Bank Account Details",
      "Business Proof",
    ],
  },
  {
    id: 2,
    name: "Credit Sea",
    category: "Loans & Credit",
    image: "img/banks/credit-sea.jpeg",
    icon: "fa-solid fa-water",
    audience: [
      "Salaried & Self-Employed individuals",
      "Age 21 to 55 years",
      "Regular monthly income",
    ],
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Latest 3 Months Salary Slips",
      "Bank Statement",
    ],
  },
  {
    id: 3,
    name: "FLOT",
    category: "Loans & Credit",
    image: "img/banks/flot.png",
    icon: "fa-solid fa-bolt",
    audience: [
      "Fast loan seekers",
      "Salaried professionals with steady cash flow",
      "Age 21+ years",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Income Proof"],
  },
  {
    id: 4,
    name: "Kissht",
    category: "Loans & Credit",
    image: "img/banks/Kissht.png",
    icon: "fa-solid fa-mobile-screen-button",
    audience: [
      "Instant line of credit seekers",
      "Salaried or Self-Employed",
      "Age 21 to 60 years",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Bank Statement"],
  },
  {
    id: 5,
    name: "Poonawalla Fincorp",
    category: "Loans & Credit",
    image: "img/banks/poonawalla-fincorp.png",
    icon: "fa-solid fa-hand-holding-dollar",
    audience: [
      "Salaried professionals in service sector",
      "Self-employed business owners",
      "Good credit score (700+)",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Income Proof / ITR"],
  },
  {
    id: 6,
    name: "Savings Account (General)",
    category: "Savings & Banking",
    image: "img/banks/savings-account.png",
    icon: "fa-solid fa-piggy-bank",
    audience: [
      "Resident individuals",
      "Minors (with guardian)",
      "Looking for secure liquid savings",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Passport Size Photographs"],
  },
  {
    id: 7,
    name: "Axis Bank Savings Account",
    category: "Savings & Banking",
    image: "img/banks/axis-bank.png",
    icon: "fa-solid fa-building-columns",
    audience: [
      "Individuals seeking premium banking features",
      "Digital & branch banking preference",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Address Proof"],
  },
  {
    id: 8,
    name: "Kotak 811",
    category: "Savings & Banking",
    image: "img/banks/kotak.png",
    icon: "fa-solid fa-k",
    audience: [
      "Zero-balance digital account seekers",
      "Instant video KYC friendly users",
      "Indian residents above 18",
    ],
    documents: ["PAN Card", "Aadhaar Card (Mobile Linked)"],
  },
  {
    id: 9,
    name: "DBS Bank Savings Account",
    category: "Savings & Banking",
    image: "img/banks/dbs.png",
    icon: "fa-solid fa-globe",
    audience: [
      "Digital-first banking users",
      "Competitive interest rate seekers",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Biometric / Video KYC"],
  },
  {
    id: 10,
    name: "Airtel Payments Bank",
    category: "Savings & Banking",
    image: "img/banks/airtel-payment.png",
    icon: "fa-solid fa-sim-card",
    audience: ["Mobile-first users", "Instant mini-banking & wallet services"],
    documents: ["Aadhaar Card", "PAN Card", "Registered Mobile Number"],
  },
  {
    id: 11,
    name: "Kotak 811 Super Account",
    category: "Savings & Banking",
    image: "img/banks/kotak.png",
    icon: "fa-solid fa-star",
    audience: [
      "Users ready for initial ₹5,000 account funding",
      "Full KYC account seekers",
    ],
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Initial Funding Source (UPI/Netbanking)",
    ],
  },
  {
    id: 23,
    name: "Jio Bank Savings Account",
    category: "Savings & Banking",
    image: "img/banks/jio-bank.png",
    icon: "fa-solid fa-signal",
    audience: [
      "Jio users seeking a digital-first savings account",
      "Individuals wanting seamless UPI & mobile banking",
      "Resident Indians aged 18 and above",
    ],
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Registered Mobile Number",
      "Passport Size Photograph",
    ],
  },
  {
    id: 12,
    name: "Incred Stocko Demat A/C",
    category: "Demat & Trading",
    image: "img/banks/incred.png",
    icon: "fa-solid fa-chart-line",
    audience: [
      "Stock market traders & investors",
      "Fast digital onboarding preference",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Bank Proof", "Cancelled Cheque"],
  },
  {
    id: 13,
    name: "Incred Stocko First Trade",
    category: "Demat & Trading",
    image: "img/banks/incred-money.png",
    icon: "fa-solid fa-award",
    audience: [
      "Active traders completing first trade of minimum ₹100 within same month",
    ],
    documents: ["Demat Account", "Linked Bank Account for Trading"],
  },
  {
    id: 14,
    name: "AngelOne Demat Account",
    category: "Demat & Trading",
    image: "img/banks/angel-one.png",
    icon: "fa-solid fa-angles-up",
    audience: [
      "Traders completing first trade of minimum ₹200 within same month",
      "Smart advisory seekers",
    ],
    documents: [
      "PAN Card",
      "Aadhaar Card",
      "Income Proof (for F&O)",
      "Bank Statement",
    ],
  },
  {
    id: 15,
    name: "Kotak Securities",
    category: "Demat & Trading",
    image: "img/banks/kotak-neo.png",
    icon: "fa-solid fa-shield-cat",
    audience: [
      "Professional & beginner investors",
      "Robust research report access seekers",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Bank Account Proof"],
  },
  {
    id: 16,
    name: "Upstox Trading & Demat",
    category: "Demat & Trading",
    image: "img/banks/upstox.png",
    icon: "fa-solid fa-arrow-trend-up",
    audience: ["Tech-savvy investors & day traders", "Low brokerage seekers"],
    documents: ["PAN Card", "Aadhaar Card (Linked to Mobile)", "Bank Proof"],
  },
  {
    id: 17,
    name: "Upstox Demat Account",
    category: "Demat & Trading",
    image: "img/banks/upstox.png",
    icon: "fa-solid fa-folder-plus",
    audience: ["Long-term equity & mutual fund investors"],
    documents: ["PAN Card", "Aadhaar Card", "Signature Proof"],
  },
  {
    id: 18,
    name: "IndusInd Bank Credit Card",
    category: "Credit Cards",
    image: "img/banks/indusind.png",
    icon: "fa-solid fa-credit-card",
    audience: [
      "Age: 21 to 60 years",
      "Salaried or Self-Employed",
      "Annual Income: ₹3 Lakhs+",
      "Credit Score: 680+",
    ],
    documents: ["Aadhaar Card", "PAN Card", "Address Proof", "Income Proof"],
  },
  {
    id: 19,
    name: "AU Bank Credit Card",
    category: "Credit Cards",
    image: "img/banks/au-bank.jpeg",
    icon: "fa-solid fa-credit-card",
    audience: [
      "Age group 23-60 Years",
      "Metros & Tier 1 cities",
      "CIBIL score 750+",
      "Income above ₹4 Lakhs",
    ],
    documents: ["PAN Card", "Aadhaar Card", "Income Proof"],
  },
  {
    id: 20,
    name: "Bajaj Finserv Insta EMI Card",
    category: "Credit Cards",
    image: "img/banks/bajaj.png",
    icon: "fa-solid fa-id-card",
    audience: [
      "Individuals aged 21 to 65 years",
      "Monthly income ₹15,000+",
      "No Cost EMI shopping preference",
    ],
    documents: ["Aadhaar Card", "PAN Card", "Valid Mobile Number"],
  },
  {
    id: 21,
    name: "Airtel Axis Bank Credit Card",
    category: "Credit Cards",
    image: "img/banks/airtel.png",
    icon: "fa-solid fa-percent",
    audience: [
      "Age: 18-70 Years",
      "New To Bank Customers",
      "CIBIL Score: 700+",
    ],
    documents: ["Aadhaar Card", "PAN Card", "Income Proof"],
  },
  {
    id: 22,
    name: "Axis Bank Credit Card",
    category: "Credit Cards",
    image: "img/banks/axis-bank.png",
    icon: "fa-solid fa-award",
    audience: [
      "Salaried (Min Income ₹18k) & Self-employed (Min Income ₹25k)",
      "CIBIL Score: Min 720",
    ],
    documents: ["KYC Documents (PAN and Aadhaar)", "Income Documents"],
  },
];

let currentProduct = null;

document.addEventListener("DOMContentLoaded", () => {
  renderProducts(fullCatalog);
  setupSearchAndFilters();
});

function buildLogo(product, imgStyle) {
  const wrap = document.createDocumentFragment();
  const fallback = () => {
    const i = document.createElement("i");
    i.className = product.icon;
    return i;
  };
  if (!product.image) {
    wrap.appendChild(fallback());
    return wrap;
  }
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = `${product.name} Logo`;
  if (imgStyle) img.style.cssText = imgStyle;
  img.addEventListener("error", () => img.replaceWith(fallback()), {
    once: true,
  });
  wrap.appendChild(img);
  return wrap;
}

function renderProducts(items) {
  const grid = document.getElementById("productGrid");
  if (!grid) return; // guard: bank.js loads on pages without the grid
  const emptyState = document.getElementById("emptyState");
  const resultCount = document.getElementById("resultCount");

  grid.innerHTML = "";
  if (resultCount)
    resultCount.textContent = `Showing ${items.length} ${items.length === 1 ? "Product" : "Products"}`;

  if (emptyState) emptyState.classList.toggle("d-none", items.length !== 0);
  if (items.length === 0) return;

  items.forEach((product, index) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";

    const mainAudience = product.audience[0] || "Eligible customers";

    col.innerHTML = `
            <div class="product-card p-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div class="product-icon"></div>
                    <span class="badge badge-category bg-secondary bg-opacity-10 text-secondary"></span>
                </div>
                <h3 class="h5 fw-bold text-dark mb-2"></h3>
                <p class="text-muted small mb-3 flex-grow-1"><i class="fa-solid fa-circle-check text-success me-1"></i> <span class="product-audience"></span></p>
                <div class="card-footer-custom bg-transparent px-0 pb-0 pt-3 d-flex justify-content-between align-items-center">
                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 js-details">
                        View Details <i class="fa-solid fa-arrow-right ms-1"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-primary rounded-pill px-3 js-apply">Apply</button>
                </div>
            </div>`;

    const icon = col.querySelector(".product-icon");
    icon.title = product.name;
    icon.appendChild(buildLogo(product));
    col.querySelector(".badge").textContent = product.category;
    col.querySelector("h3").textContent = product.name;
    col.querySelector(".product-audience").textContent = mainAudience;
    col
      .querySelector(".js-details")
      .addEventListener("click", () => openProductModal(product.id));
    col
      .querySelector(".js-apply")
      .addEventListener("click", () => openProductModal(product.id));

    grid.appendChild(col);

    if (
      col.animate &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      col.animate(
        [
          { opacity: 0, transform: "translateY(30px)" },
          { opacity: 1, transform: "none" },
        ],
        {
          duration: 500,
          delay: (index % 10) * 80,
          easing: "ease-out",
          fill: "backwards",
        },
      );
    }
  });
}

function setupSearchAndFilters() {
  const searchInput = document.getElementById("searchInput");
  const filterButtons = document.querySelectorAll(".filter-btn");
  if (!searchInput && !filterButtons.length) return;
  let currentCategory = "all";
  let searchQuery = "";

  function applyFilters() {
    let filtered = fullCatalog;
    if (currentCategory !== "all") {
      filtered = filtered.filter((p) => p.category === currentCategory);
    }
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.audience.some((a) => a.toLowerCase().includes(query)),
      );
    }
    renderProducts(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      applyFilters();
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      const button = e.currentTarget;
      button.classList.add("active");
      currentCategory = button.getAttribute("data-category") || "all";
      applyFilters();
    });
  });
}

function openProductModal(id) {
  const product = fullCatalog.find((p) => p.id === id);
  if (!product) return;
  currentProduct = product;

  document.getElementById("productModalLabel").textContent = product.name;
  document.getElementById("modalCategory").textContent = product.category;

  const iconEl = document.getElementById("modalIcon");
  iconEl.innerHTML = "";
  iconEl.appendChild(
    buildLogo(
      product,
      "width:100%; height:100%; object-fit:contain; padding:4px;",
    ),
  );

  const audienceContainer = document.getElementById("modalAudience");
  audienceContainer.innerHTML = "";
  product.audience.forEach((item) => {
    const div = document.createElement("div");
    div.className = "criteria-pill text-dark";
    div.innerHTML = '<i class="fa-solid fa-user-check text-primary me-2"></i>';
    div.appendChild(document.createTextNode(item));
    audienceContainer.appendChild(div);
  });

  const docsContainer = document.getElementById("modalDocuments");
  docsContainer.innerHTML = "";
  product.documents.forEach((doc) => {
    const div = document.createElement("div");
    div.className = "criteria-pill text-dark";
    div.style.borderLeftColor = "var(--success-color)";
    div.innerHTML =
      '<i class="fa-solid fa-file-circle-check text-success me-2"></i>';
    div.appendChild(document.createTextNode(doc));
    docsContainer.appendChild(div);
  });

  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("productModal"),
  ).show();
}

function triggerApply() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("productModal"),
  );
  if (modal) modal.hide();
  const name = currentProduct ? ` for ${currentProduct.name}` : "";
  const msg = `Hello Prime Capital Fincorp,\n\nI am interested in applying${name}.\nPlease contact me with more details.\n\nThank you.`;
  const url = `https://wa.me/919339303216?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
  showToast(`Redirecting to WhatsApp to complete your application${name}.`);
}

function showToast(message) {
  const toastDiv = document.createElement("div");
  toastDiv.className = "position-fixed bottom-0 end-0 p-3";
  toastDiv.style.zIndex = "1080";
  toastDiv.innerHTML = `
        <div class="toast show align-items-center text-white bg-dark border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fa-solid fa-circle-check text-success me-2"></i><span class="toast-msg"></span>
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>`;
  toastDiv.querySelector(".toast-msg").textContent = message;
  toastDiv
    .querySelector(".btn-close")
    .addEventListener("click", () => toastDiv.remove());
  document.body.appendChild(toastDiv);
  setTimeout(() => toastDiv.remove(), 4000);
}

/* ===== Global form → WhatsApp handler (all forms on all pages) ===== */
const WA_NUMBER = "919339303216";

function formToWhatsApp(form, title) {
  const data = new FormData(form);
  const lines = [];
  lines.push(`*${title}* — Prime Capital Fincorp`);
  lines.push("-----------------------------");
  for (const [key, value] of data.entries()) {
    if (value === "" || value === "yes") continue;
    const label = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    lines.push(`*${label}:* ${value}`);
  }
  lines.push("-----------------------------");
  lines.push(`Sent: ${new Date().toLocaleString("en-IN")}`);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

document.addEventListener(
  "submit",
  (e) => {
    const form = e.target;
    if (!form || form.tagName !== "FORM") return;
    // Skip if the form is meant to go elsewhere (has data-native="true")
    if (form.dataset.native === "true") return;

    e.preventDefault();
    const title = form.dataset.waTitle || document.title || "Enquiry";
    const url = formToWhatsApp(form, title);
    window.open(url, "_blank");
    showToast(
      "Opening WhatsApp with your enquiry. Please tap send to reach our team.",
    );
    form.reset();
  },
  true,
);
