document.addEventListener("DOMContentLoaded", () => {
  const editBtn = document.getElementById("editBtn");
  const backBtn = document.getElementById("backBtn");
  const modal = document.getElementById("editModal");
  const closeModal = document.querySelector(".close");
  const editForm = document.getElementById("editForm");

  const token = localStorage.getItem("token");

  // Fetch user data
  async function fetchUserData() {
    try {
      const response = await fetch("http://localhost:3001/user-data", {
        headers: { authorization: token },
      });
      const data = await response.json();

      document.getElementById("name").textContent = data.UserName || "";
      document.getElementById("email").textContent = data.Email || "";
      document.getElementById("phone").textContent = data.PhoneNumber || "";
      document.getElementById("location").textContent = data.Location || "";
      document.getElementById("careerGoals").textContent =
        data.CareerGoals || "";
      document.getElementById("jobPreferences").textContent =
        data.JobPreferences || "";
      document.getElementById("skills").textContent = data.Skills || "";
      document.getElementById("EducationalBackground").textContent =
        data.EducationalBackground || "";

      // Populate form inputs with user data
      document.getElementById("nameInput").value = data.UserName || "";
      document.getElementById("emailInput").value = data.Email || "";
      document.getElementById("phoneInput").value = data.PhoneNumber || "";
      document.getElementById("locationInput").value = data.Location || "";
      document.getElementById("careerGoalsInput").value =
        data.CareerGoals || "";
      document.getElementById("jobPreferencesInput").value =
        data.JobPreferences || "";
      document.getElementById("skillsInput").value = data.Skills || "";
      document.getElementById("EducationalBackground").value =
        data.EducationalBackground || "";
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Show the modal
  editBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Close the modal
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Handle form submission
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);
    try {
      const response = await fetch("http://localhost:3001/update-user", {
        method: "PUT",
        headers: { authorization: token },
        body: formData,
      });

      if (response.ok) {
        alert("User details updated successfully!");
        modal.style.display = "none";
        fetchUserData(); // Refresh user data
      } else {
        alert("Failed to update user details.");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  });

  // Handle back button
  backBtn.addEventListener("click", () => {
    window.location.href = "../dashboard/dashBoard.html"; // Redirect to home page
  });

  // Fetch user data on page load
  fetchUserData();
});
