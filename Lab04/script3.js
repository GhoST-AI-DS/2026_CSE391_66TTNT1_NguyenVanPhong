// UTILITY FUNCTIONS
function showError(fieldId, message) {
  const errorEl = document.getElementById(fieldId + "Error");
  const input = document.getElementById(fieldId);
  errorEl.textContent = message;
  input.classList.add("invalid");
  input.classList.remove("valid");
}

function clearError(fieldId) {
  const errorEl = document.getElementById(fieldId + "Error");
  const input = document.getElementById(fieldId);
  errorEl.textContent = "";
  input.classList.remove("invalid");
  input.classList.add("valid");
}

function getRadioValue(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : "";
}

// VALIDATION FUNCTIONS
function validateFullname() {
  const val = document.getElementById("fullname").value.trim();
  if (!val) return "Vui lòng nhập họ và tên";
  if (val.length < 3) return "Họ tên phải ≥ 3 ký tự";
  if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(val))
    return "Họ tên chỉ được chứa chữ cái và khoảng trắng";
  clearError("fullname");
  return true;
}

function validateEmail() {
  const val = document.getElementById("email").value.trim();
  if (!val) return "Vui lòng nhập email";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    return "Email không đúng định dạng";
  clearError("email");
  return true;
}

function validatePhone() {
  const val = document.getElementById("phone").value.trim();
  if (!val) return "Vui lòng nhập số điện thoại";
  if (!/^0[0-9]{9}$/.test(val)) return "SĐT phải bắt đầu bằng 0 và đủ 10 số";
  clearError("phone");
  return true;
}

function validatePassword() {
  const val = document.getElementById("password").value;
  if (!val) return "Vui lòng nhập mật khẩu";
  if (val.length < 8) return "Mật khẩu phải ≥ 8 ký tự";
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(val)) {
    return "Mật khẩu cần ít nhất 1 chữ hoa, 1 chữ thường, 1 số";
  }
  clearError("password");
  return true;
}

function validateConfirmPassword() {
  const pw = document.getElementById("password").value;
  const cpw = document.getElementById("confirmPassword").value;
  if (!cpw) return "Vui lòng xác nhận mật khẩu";
  if (cpw !== pw) return "Mật khẩu xác nhận không khớp";
  clearError("confirmPassword");
  return true;
}

function validateGender() {
  if (!getRadioValue("gender")) return "Vui lòng chọn giới tính";
  clearError("gender");
  return true;
}

function validateTerms() {
  if (!document.getElementById("terms").checked)
    return "Bạn phải đồng ý với điều khoản";
  clearError("terms");
  return true;
}

// EVENT LISTENERS
const form = document.getElementById("registerForm");

// Realtime clear error khi đang nhập
["fullname", "email", "phone", "password", "confirmPassword"].forEach((id) => {
  const el = document.getElementById(id);
  el.addEventListener("input", () => {
    clearError(id);
    if (id === "password") validateConfirmPassword();
  });
});

// Validate khi blur
document.getElementById("fullname").addEventListener("blur", validateFullname);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("phone").addEventListener("blur", validatePhone);
document.getElementById("password").addEventListener("blur", validatePassword);
document
  .getElementById("confirmPassword")
  .addEventListener("blur", validateConfirmPassword);

// Submit
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const isValid =
    (validateFullname() === true) &
    (validateEmail() === true) &
    (validatePhone() === true) &
    (validatePassword() === true) &
    (validateConfirmPassword() === true) &
    (validateGender() === true) &
    (validateTerms() === true);

  if (isValid) {
    const name = document.getElementById("fullname").value.trim();
    form.style.display = "none";
    document.getElementById("successMessage").style.display = "block";
    document.getElementById("welcomeName").textContent = name;
  }
});
