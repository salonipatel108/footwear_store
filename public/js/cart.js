let cartProductsRender = () => {
  let cartProductContainer = document.querySelector(".cart-product-container");
  let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;
  let cartProductCards = ``;

  if (cartProducts.length == 0) {
    cartProductContainer.innerHTML = `<h4 class="text-center" style="color: #B388FF;">Your cart is empty 🛒</h4>`;
    document.getElementById("cart-total").innerHTML = "Total: $0";
    return;
  }

  cartProducts.forEach((item) => {
    total += item.price * item.Quontity;

    cartProductCards += `
      <div class="col-12 py-3 d-flex flex-wrap align-items-center cart-pri">
        <div class="col-4 col-md-2 cardthumbnail text-center">
          <img class="img-fluid" src="${item.thumbnail}" alt="${item.name}">
        </div>
        <div class="col-3 col-md-2 text-center">
          <h5>${item.name}</h5>
        </div>
        <div class="col-3 col-md-2 text-center">
          <p>Price: $${item.price}</p>
        </div>
        <div class="col-4 col-md-2 text-center">
          <div class="d-flex justify-content-center align-items-center mb-2">
            <button class="btn btn-sm btn-outline-light me-2" onclick="updateQuantity(${item.id}, -1)">-</button>
            <span class="mx-2 fw-bold">${item.Quontity}</span>
            <button class="btn btn-sm btn-outline-light ms-2" onclick="updateQuantity(${item.id}, 1)">+</button>
          </div>
        </div>
        <div class="col-4 col-md-2 text-center">
          <p><b>Subtotal: ${(item.price * item.Quontity).toFixed(2)}</b></p>
        </div>
        <div class="col-4 col-md-2 text-center">
          <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  });

  let discount = 0;
  if (total >= 500 && total <= 999) discount = total * 0.1;
  else if (total >= 1000 && total <= 1999) discount = total * 0.15;
  else if (total >= 2000 && total <= 4999) discount = total * 0.2;
  else if (total >= 5000) discount = total * 0.25;

  let finalAmount = total - discount;

  cartProductContainer.innerHTML = cartProductCards;

  document.getElementById("cart-total").innerHTML = `
    <p>Total: $${total.toFixed(2)}</p>
    <p style="color: green;">Discount: -$${discount.toFixed(2)}</p>
    <h5>Final Amount: $${finalAmount.toFixed(2)}</h5>
  `;
};

const updateQuantity = (id, change) => {
  let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
  let product = cartProducts.find((item) => item.id == id);

  if (product) {
    product.Quontity += change;
    if (product.Quontity < 1) product.Quontity = 1;
  }

  localStorage.setItem("cart", JSON.stringify(cartProducts));
  cartProductsRender();
};

const removeFromCart = (id) => {
  let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
  let updatedCart = cartProducts.filter((item) => item.id !== id);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  cartProductsRender();
};

function searchProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase().trim();
  const allProducts = document.querySelectorAll(".cart-pri");
  let anyMatch = false;

  allProducts.forEach((product) => {
    const nameElement = product.querySelector("h5");
    const productName = nameElement ? nameElement.textContent.toLowerCase() : "";

    if (productName.includes(input)) {
      product.style.display = "flex";
      anyMatch = true;
    } else {
      product.style.display = "none";
    }
  });

  const container = document.querySelector(".cart-product-container");
  const existingMsg = document.getElementById("noMatchMsg");

  if (!anyMatch) {
    if (!existingMsg) {
      const msg = document.createElement("h5");
      msg.id = "noMatchMsg";
      msg.className = "text-center mt-3";
      msg.style.color = "#B388FF";
      msg.textContent = "No matching products found 🔍";
      container.appendChild(msg);
    }
  } else {
    if (existingMsg) existingMsg.remove();
  }
}

function showUserIcon() {
  const loginArea = document.getElementById("loginArea");
  if (!loginArea) return;

  const user = JSON.parse(localStorage.getItem("loginData"));
  if (user) {
    loginArea.innerHTML = `
      <img src="./img/user.png"
        alt="User"
        title="${user.username}"
        class="rounded-circle shadow-sm"
        onclick="goToUserPage()"
        style="width:60px; height:60px; cursor:pointer;">
    `;
  } else {
    loginArea.innerHTML = `
      <a href="./login.html" class="text-decoration-none">
        <i class="fa-solid fa-circle-user fa-2xl" style="color:#B388FF;"></i>
      </a>
    `;
  }
}

function goToUserPage() {
  window.location.href = "./user.html";
}

document.addEventListener("DOMContentLoaded", () => {
  showUserIcon();
  cartProductsRender();
});
