// DATA & UTILITY
const prices = {
  "Áo thun": 150000,
  "Quần jeans": 320000,
  "Giày thể thao": 580000,
  "Mũ lưỡi trai": 120000,
};

function formatMoney(num) {
  return num.toLocaleString("vi-VN") + " ₫";
}

function updateTotal() {
  const product = document.getElementById("product").value;
  const qty = parseInt(document.getElementById("quantity").value) || 0;
  const price = prices[product] || 0;
  const total = price * qty;
  document.getElementById("totalPrice").textContent =
    `Tổng tiền: ${formatMoney(total)}`;
}

// VALIDATION
function validateProduct() {
  const val = document.getElementById("product").value;
  if (!val) {
    showError("product", "Vui lòng chọn sản phẩm");
    return false;
  }
  clearError("product");
  return true;
}

function validateQuantity() {
  const val = parseInt(document.getElementById("quantity").value);
  if (isNaN(val) || val < 1 || val > 99) {
    showError("quantity", "Số lượng phải từ 1 đến 99");
    return false;
  }
  clearError("quantity");
  return true;
}

function validateDeliveryDate() {
  const input = document.getElementById("deliveryDate");
  const val = input.value;
  if (!val) {
    showError("deliveryDate", "Vui lòng chọn ngày giao hàng");
    return false;
  }
  const selected = new Date(val);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 30);

  if (selected < today) {
    showError("deliveryDate", "Ngày giao không được trong quá khứ");
    return false;
  }
  if (selected > maxDate) {
    showError("deliveryDate", "Ngày giao không được quá 30 ngày từ hôm nay");
    return false;
  }
  clearError("deliveryDate");
  return true;
}

function validateAddress() {
  const val = document.getElementById("address").value.trim();
  if (!val) return (showError("address", "Vui lòng nhập địa chỉ"), false);
  if (val.length < 10)
    return (showError("address", "Địa chỉ phải ≥ 10 ký tự"), false);
  clearError("address");
  return true;
}

function validateNote() {
  const val = document.getElementById("note").value.trim();
  if (val.length > 200) {
    showError("note", "Ghi chú không được quá 200 ký tự");
    return false;
  }
  clearError("note");
  return true;
}

function validatePayment() {
  if (!document.querySelector('input[name="payment"]:checked')) {
    showError("payment", "Vui lòng chọn phương thức thanh toán");
    return false;
  }
  clearError("payment");
  return true;
}

function showError(id, msg) {
  document.getElementById(id + "Error").textContent = msg;
  document.getElementById(id).classList.add("invalid");
  document.getElementById(id).classList.remove("valid");
}

function clearError(id) {
  document.getElementById(id + "Error").textContent = "";
  document.getElementById(id).classList.remove("invalid");
  document.getElementById(id).classList.add("valid");
}

// EVENT LISTENERS
document.getElementById("product").addEventListener("change", () => {
  validateProduct();
  updateTotal();
});

document.getElementById("quantity").addEventListener("input", () => {
  validateQuantity();
  updateTotal();
});

["product", "quantity", "deliveryDate", "address"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener(
      "blur",
      window[`validate${id.charAt(0).toUpperCase() + id.slice(1)}`],
    );
});

document.getElementById("note").addEventListener("input", function () {
  const len = this.value.length;
  const counter = document.getElementById("noteCounter");
  counter.textContent = `${len}/200`;
  if (len > 200) counter.classList.add("over");
  else counter.classList.remove("over");
  validateNote();
});

// Clear error khi input
["product", "quantity", "deliveryDate", "address", "note"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => clearError(id));
});

const form = document.getElementById("orderForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const isValid =
    validateProduct() &
    validateQuantity() &
    validateDeliveryDate() &
    validateAddress() &
    validateNote() &
    validatePayment();

  if (!isValid) return;

  // Hiển thị xác nhận
  const product = document.getElementById("product").value;
  const qty = document.getElementById("quantity").value;
  const total = prices[product] * qty;
  const date = document.getElementById("deliveryDate").value;

  document.getElementById("confirmProduct").textContent = product;
  document.getElementById("confirmQuantity").textContent = qty;
  document.getElementById("confirmTotal").textContent = formatMoney(total);
  document.getElementById("confirmDate").textContent = date;

  document.getElementById("confirmOrder").style.display = "block";
  form.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("confirmBtn").addEventListener("click", () => {
  document.getElementById("confirmOrder").style.display = "none";
  form.style.display = "none";
  alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
});

document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("confirmOrder").style.display = "none";
});
