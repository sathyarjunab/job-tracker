document
  .getElementById("additional-info-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const location = document.getElementById("location").value;
    const careerGoals = document.getElementById("careerGoals").value;
    const jobPreferences = document.getElementById("jobPreferences").value;
    const skills = document.getElementById("skills").value;
    const education = document.getElementById("education").value;

    const token = localStorage.getItem("token");
    const UserName = localStorage.getItem("user");

    const additionalInfo = {
      location,
      careerGoals,
      jobPreferences,
      skills,
      education,
    };

    try {
      const response = await fetch("http://localhost:3001/user-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
        body: JSON.stringify(additionalInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to save information");
      }

      const data = await response.json();
      alert("Information Saved Successfully!");
      document.getElementById("additional-info-form").reset();
      window.location.href = "../dashboard/dashBoard.html";
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error saving your information. Please try again.");
    }
  });
