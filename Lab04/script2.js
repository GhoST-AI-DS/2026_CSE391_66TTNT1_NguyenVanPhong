let students = [];
let sortDirection = 1; // 1: tăng dần, -1: giảm dần
let currentSortColumn = "score";

// Xếp loại và màu nền
function getRank(score) {
  if (score >= 8.5) return "Giỏi";
  if (score >= 7.0) return "Khá";
  if (score >= 5.0) return "Trung bình";
  return "Yếu";
}

function getRowClass(score) {
  return score < 5.0 ? "weak" : "";
}

// Tính điểm trung bình
function calculateAverage() {
  if (students.length === 0) return 0;
  const sum = students.reduce((acc, s) => acc + s.score, 0);
  return (sum / students.length).toFixed(1);
}

// Cập nhật thống kê
function updateSummary() {
  document.getElementById("totalStudents").textContent = students.length;
  document.getElementById("avgScore").textContent = calculateAverage();
}

// Render bảng (dùng filtered list)
function renderTable(filteredStudents) {
  const tbody = document.getElementById("studentBody");
  tbody.innerHTML = "";

  if (filteredStudents.length === 0) {
    document.getElementById("noResult").style.display = "block";
    tbody.innerHTML = "";
    return;
  }

  document.getElementById("noResult").style.display = "none";

  filteredStudents.forEach((student, index) => {
    const tr = document.createElement("tr");
    tr.className = getRowClass(student.score);

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.score.toFixed(1)}</td>
      <td>${student.rank}</td>
      <td><button class="delete" data-index="${index}">Xóa</button></td>
    `;

    tbody.appendChild(tr);
  });

  updateSummary();
}

// Áp dụng tất cả bộ lọc + tìm kiếm + sắp xếp
function applyFilters() {
  let filtered = [...students];

  // 1. Tìm kiếm theo tên
  const searchText = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();
  if (searchText) {
    filtered = filtered.filter((s) =>
      s.name.toLowerCase().includes(searchText),
    );
  }

  // 2. Lọc theo xếp loại
  const rankFilter = document.getElementById("filterRank").value;
  if (rankFilter !== "all") {
    filtered = filtered.filter((s) => s.rank === rankFilter);
  }

  // 3. Sắp xếp theo điểm
  if (currentSortColumn === "score") {
    filtered.sort((a, b) => (a.score - b.score) * sortDirection);
  }

  renderTable(filtered);
}

// Thêm sinh viên mới
function addStudent() {
  const nameInput = document.getElementById("fullName");
  const scoreInput = document.getElementById("score");

  const name = nameInput.value.trim();
  const score = parseFloat(scoreInput.value);

  if (!name) {
    alert("Vui lòng nhập họ tên!");
    return;
  }
  if (isNaN(score) || score < 0 || score > 10) {
    alert("Điểm phải là số từ 0 đến 10!");
    return;
  }

  const rank = getRank(score);

  students.push({ name, score, rank });

  nameInput.value = "";
  scoreInput.value = "";
  nameInput.focus();

  applyFilters();
}

// Xử lý xóa (event delegation)
document.getElementById("studentBody").addEventListener("click", function (e) {
  if (e.target.classList.contains("delete")) {
    const index = parseInt(e.target.dataset.index);
    if (confirm("Bạn có chắc muốn xóa sinh viên này?")) {
      students.splice(index, 1);
      applyFilters();
    }
  }
});

// Event listeners
document.getElementById("addBtn").addEventListener("click", addStudent);

// Thêm bằng phím Enter ở ô điểm
document.getElementById("score").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addStudent();
  }
});

// Tìm kiếm realtime
document.getElementById("searchInput").addEventListener("input", applyFilters);

// Lọc theo xếp loại
document.getElementById("filterRank").addEventListener("change", applyFilters);

// Sắp xếp theo cột Điểm
document.getElementById("scoreHeader").addEventListener("click", function () {
  sortDirection *= -1;
  this.classList.remove("sort-asc", "sort-desc");
  this.classList.add(sortDirection === 1 ? "sort-asc" : "sort-desc");
  applyFilters();
});

// Khởi tạo
applyFilters();
