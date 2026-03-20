document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("student-form");
  const studentList = document.getElementById("student-list");
  const modal = document.getElementById("student-modal");
  const btnOpenModal = document.getElementById("btn-open-modal");
  const btnCloseModal = document.getElementById("btn-close-modal");

  let students = JSON.parse(localStorage.getItem("students")) || [];

  // Nếu LocalStorage trống, tự động đọc từ file data.json
  if (students.length === 0) {
    fetch("data.json")
      .then((response) => {
        if (!response.ok) throw new Error("Không tìm thấy file data.json");
        return response.json();
      })
      .then((data) => {
        students = data;
        localStorage.setItem("students", JSON.stringify(students));
        renderTable(); // Vẽ lại bảng sau khi lấy dữ liệu xong
      })
      .catch((err) =>
        console.log("Chưa có dữ liệu mẫu hoặc lỗi đọc file:", err),
      );
  }

  // Hiển thị danh sách
  function renderTable() {
    studentList.innerHTML = "";
    let totalGpa = 0;

    students.forEach((s, index) => {
      totalGpa += parseFloat(s.gpa);
      studentList.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${s.studentId}</td>
                    <td>${s.fullName}</td>
                    <td>${s.dob}</td>
                    <td>${s.className}</td>
                    <td>${s.gpa}</td>
                    <td>
                        <button class="btn-edit" onclick="editStudent(${index})">Sửa</button>
                        <button class="btn-delete" onclick="deleteStudent(${index})">Xoá</button>
                    </td>
                </tr>
            `;
    });

    document.getElementById("total-students").innerText = students.length;
    const avg =
      students.length > 0 ? (totalGpa / students.length).toFixed(2) : "0.00";
    document.getElementById("avg-gpa").innerText = avg;
  }

  // Validate Form
  function validate() {
    let isValid = true;
    const setError = (id, msg) => {
      const input = document.getElementById(id);
      input.nextElementSibling.innerText = msg;
      if (msg) isValid = false;
    };

    // Reset errors
    document
      .querySelectorAll(".error-msg")
      .forEach((el) => (el.innerText = ""));

    const sId = document.getElementById("studentId").value;
    if (!/^SV\d{6}$/.test(sId))
      setError("studentId", "Mã SV phải bắt đầu bằng SV + 6 chữ số");

    const name = document.getElementById("fullName").value;
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name))
      //chứa biểu thức regex
      setError("fullName", "Họ tên chỉ chứa chữ cái");

    const dob = new Date(document.getElementById("dob").value);
    const age = new Date().getFullYear() - dob.getFullYear();
    if (isNaN(dob) || age < 18)
      setError("dob", "Sinh viên phải từ 18 tuổi trở lên");

    const gpa = document.getElementById("gpa").value;
    if (gpa < 0 || gpa > 10 || gpa === "") setError("gpa", "Điểm từ 0-10");

    const email = document.getElementById("email").value;
    if (!email.endsWith("@student.edu.vn"))
      setError("email", "Email phải kết thúc bằng @student.edu.vn");

    const pass = document.getElementById("password").value;
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    if (!passRegex.test(pass))
      setError(
        "password",
        "Mật khẩu yếu (8-32 ký tự, 1 hoa, 1 thường, 1 số, 1 kí tự đặc biệt)",
      );

    if (document.getElementById("confirmPassword").value !== pass)
      setError("confirmPassword", "Mật khẩu không khớp");

    return isValid;
  }

  // Lưu sinh viên
  studentForm.onsubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const studentData = {
      studentId: document.getElementById("studentId").value,
      fullName: document.getElementById("fullName").value,
      dob: document.getElementById("dob").value,
      className: document.getElementById("className").value,
      gpa: document.getElementById("gpa").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const editIndex = document.getElementById("edit-index").value;
    if (editIndex === "") {
      students.push(studentData);
    } else {
      students[editIndex] = studentData;
    }

    localStorage.setItem("students", JSON.stringify(students));
    modal.style.display = "none";
    studentForm.reset();
    renderTable();
  };

  // Xoá sinh viên
  window.deleteStudent = (index) => {
    if (confirm("Bạn có chắc chắn muốn xoá?")) {
      students.splice(index, 1);
      localStorage.setItem("students", JSON.stringify(students));
      renderTable();
      alert("Xóa thành công!");
    }
  };

  // Sửa sinh viên (đưa dữ liệu vào form)
  window.editStudent = (index) => {
    const s = students[index];
    document.getElementById("studentId").value = s.studentId;
    document.getElementById("fullName").value = s.fullName;
    document.getElementById("dob").value = s.dob;
    document.getElementById("className").value = s.className;
    document.getElementById("gpa").value = s.gpa;
    document.getElementById("email").value = s.email;
    document.getElementById("edit-index").value = index;
    modal.style.display = "block";
  };

  // Modal Events
  btnOpenModal.onclick = () => {
    studentForm.reset();
    document.getElementById("edit-index").value = "";
    modal.style.display = "block";
  };
  btnCloseModal.onclick = () => (modal.style.display = "none");

  renderTable();
});
