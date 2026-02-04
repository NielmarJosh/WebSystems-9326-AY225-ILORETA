const contactForm = document.getElementById("contactForm");
const statusText = document.getElementById("status");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const feedback = document.getElementById("feedback").value.trim();

  if (!email.includes("@") || feedback.length < 5) {
    statusText.textContent = "Please provide a valid email and message.";
    statusText.style.color = "red";
    return;
  }

  const record = {
    email,
    feedback,
    submittedAt: new Date().toLocaleString()
  };

  localStorage.setItem("citizenFeedback", JSON.stringify(record));

  statusText.textContent = "Your feedback has been sent successfully.";
  statusText.style.color = "green";
  contactForm.reset();
});
