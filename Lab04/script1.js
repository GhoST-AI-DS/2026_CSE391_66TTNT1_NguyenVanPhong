let students = [];

const fullnameInput = document.getElementById("fullname");
const scoreInput = document.getElementById("score");
const btnAdd = document.getElementById("btnAdd");
const tbody = document.getElementById("tbody");
const statsDiv = document.getElementById("stats");

function getRank(score) {
  if (score >= 8.5) return "Giỏi";
  if (score >= 7.0) return "Khá";
  if (score >= 5.0) return "Trung bình";
  return "Yếu";
}

function renderTable() {
  tbody.innerHTML = "";
  students.forEach((student, index) => {
    const tr = document.createElement("tr");
    if (student.score < 5) tr.classList.add("weak");

    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${student.name}</td>
      <td>${student.score.toFixed(1)}</td>
      <td>${student.rank}</td>
      <td><button class="btn-delete" data-index="${index}">Xóa</button></td>
    `;
    tbody.appendChild(tr);
  });

  const total = students.length;
  const avg =
    total === 0
      ? 0
      : (students.reduce((sum, s) => sum + s.score, 0) / total).toFixed(2);
  statsDiv.textContent = `Tổng số SV: ${total} | Điểm trung bình: ${avg}`;
}

function addStudent() {
  const name = fullnameInput.value.trim();
  const score = parseFloat(scoreInput.value);

  if (!name) return alert("Vui lòng nhập họ tên!");
  if (isNaN(score) || score < 0 || score > 10)
    return alert("Điểm phải nằm trong khoảng 0–10!");

  students.push({
    name,
    score,
    rank: getRank(score),
  });

  fullnameInput.value = "";
  scoreInput.value = "";
  fullnameInput.focus();

  renderTable();
}

btnAdd.addEventListener("click", addStudent);

scoreInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addStudent();
});

tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    const idx = parseInt(e.target.dataset.index);
    students.splice(idx, 1);
    renderTable();
  }
});

// Khởi tạo
renderTable();
