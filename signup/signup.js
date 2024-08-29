document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("signupForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const password = document.getElementById("password").value;

      const data = {
        name: name,
        email: email,
        phone: phone,
        password: password,
      };

      try {
        const response = await fetch("http://localhost:3001/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const resdata = await response.json();
        if (response.ok) {
          console.log(resdata);
          localStorage.setItem("token", resdata.token);
          localStorage.setItem("user", resdata.result.UserName);
          alert("Sign up successful!");
          window.location.href = "../personalData/personalData.html";
          document.getElementById("message").style.color = "green";
          document.getElementById("signupForm").reset();
        } else {
          document.getElementById("message").textContent = resdata.message;
          alert(resdata.message);
        }
      } catch (error) {
        console.log(error);
        document.getElementById("message").textContent =
          "An error occurred. Please try again.";
      }
    });
});
