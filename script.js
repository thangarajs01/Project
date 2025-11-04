// Sample Employee Data
const employees = [
  {
    name: "Saravana Kumar",
    role: "Software Engineer",
    department: "IT",
    email: "saravana@nanmuthavan.com",
    photo: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Malathi",
    role: "HR Manager",
    department: "Human Resources",
    email: "priya@nanmuthavan.com",
    photo: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Thangaraj",
    role: "Accountant",
    department: "Finance",
    email: "manikandan@nanmuthavan.com",
    photo: "https://i.pravatar.cc/150?img=3"
  },
  {
    name: "Mahesh",
    role: "UI/UX Designer",
    department: "Design",
    email: "kavitha@nanmuthavan.com",
    photo: "https://i.pravatar.cc/150?img=4"
  }
];

// Render Employee Cards
function renderEmployees(list) {
  const container = document.getElementById("employeeList");
  container.innerHTML = "";

  list.forEach(emp => {
    const card = document.createElement("div");
    card.classList.add("employee-card");
    card.innerHTML = `
      <img src="${emp.photo}" alt="${emp.name}" />
      <h3>${emp.name}</h3>
      <p><strong>${emp.role}</strong></p>
      <p>${emp.department}</p>
      <p>${emp.email}</p>
    `;
    container.appendChild(card);
  });
}

// Search Functionality
document.getElementById("searchInput").addEventListener("input", e => {
  const searchValue = e.target.value.toLowerCase();
  const filtered = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchValue) ||
    emp.department.toLowerCase().includes(searchValue)
  );
  renderEmployees(filtered);
});

// Initialize Page
window.onload = () => renderEmployees(employees);
