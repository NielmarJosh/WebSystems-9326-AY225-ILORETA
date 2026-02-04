const announcementContainer = document.getElementById("announcementList");

if (announcementContainer) {
  announcements.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>Category:</strong> ${item.category}</p>
    `;
    div.addEventListener("click", () => {
      openModal(item.title, item.description);
    });
    announcementContainer.appendChild(div);
  });
}




  
