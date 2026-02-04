<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Announcements - Bacoor City LGU</title>
  <style>
    /* ===== General CSS ===== */
    * {
      box-sizing: border-box;
      font-family: "Segoe UI", Arial, sans-serif;
    }

    body {
      margin: 0;
      background: #f4f6f7;
      color: #222;
    }

    header {
      background: #0a3d62;
      padding: 15px 20px;
    }

    nav {
      display: flex;
      gap: 15px;
    }

    nav a {
      color: #ffffff;
      text-decoration: none;
      font-weight: 600;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background 0.3s, color 0.3s;
    }

    nav a:hover {
      background: #07304e;
    }

    nav a.active {
      background: #ffffff;
      color: #0a3d62;
    }

    .container {
      padding: 25px;
      max-width: 1000px;
      margin: auto;
    }

    h1 {
      color: #0a3d62;
      margin-bottom: 15px;
    }

    .card {
      background: #ffffff;
      padding: 15px;
      margin: 12px 0;
      border-radius: 6px;
      border-left: 5px solid #0a3d62;
      cursor: pointer;
      transition: background 0.3s;
    }

    .card:hover {
      background: #eef4f8;
    }

    /* ===== Modal CSS ===== */
    .modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 20px;
      max-width: 500px;
      margin: 10% auto;
      border-radius: 6px;
    }

    .modal-content h3 {
      margin-top: 0;
      color: #0a3d62;
    }

    .modal-content button {
      margin-top: 15px;
    }
  </style>
</head>
<body>

<header>
  <nav>
    <a href="index.html" id="home">Home</a>
    <a href="departments.html" id="departments">Departments</a>
    <a href="services.html" id="services">Services</a>
    <a href="announcements.html" id="announcements">Announcements</a>
    <a href="contact.html" id="contact">Contact</a>
  </nav>
</header>

<div class="container">
  <h1>Announcements</h1>

  <div class="card" data-title="Road Repair in Zone 3" data-body="The City Public Works will repair the road in Zone 3 starting February 10. Expect traffic delays.">Road Repair in Zone 3</div>
  <div class="card" data-title="Vaccination Drive" data-body="Free vaccination will be conducted at the City Health Center on February 12-15. Everyone is encouraged to participate.">Vaccination Drive</div>
  <div class="card" data-title="School Enrollment Open" data-body="Enrollment for the new school year starts on March 1. Visit the Education Department for requirements.">School Enrollment Open</div>
  <div class="card" data-title="Environmental Cleanup" data-body="A city-wide cleanup event will be held on February 20. Volunteers are welcome!">Environmental Cleanup</div>
</div>

<!-- Modal -->
<div class="modal" id="modal">
  <div class="modal-content">
    <h3 id="modalTitle"></h3>
    <p id="modalBody"></p>
    <button onclick="closeModal()">Close</button>
  </div>
</div>

<script>
  // ===== Highlight active nav link =====
  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll("nav a");

  navLinks.forEach(link => {
    if(link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  // ===== Modal functionality =====
  const cards = document.querySelectorAll(".card");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      modalTitle.textContent = card.dataset.title;
      modalBody.textContent = card.dataset.body;
      modal.style.display = "block";
    });
  });

  function closeModal() {
    modal.style.display = "none";
  }

  // Close modal when clicking outside content
  window.addEventListener("click", (e) => {
    if(e.target === modal) {
      closeModal();
    }
  });
</script>

</body>
</html>



  

