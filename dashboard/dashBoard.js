const token = localStorage.getItem("token");
document.addEventListener("DOMContentLoaded", () => {
  fetchJobApplications();
  fetchStatusSummary();
});

function toggleSideBlock() {
  const sideBlock = document.getElementById("sideBlock");
  sideBlock.style.display =
    sideBlock.style.display === "none" ? "block" : "none";
}

function openModal(modalId) {
  document.getElementById(modalId).style.display = "flex";
}

function toggleFilter() {
  const filterOptions = document.getElementById("filterOptions");
  filterOptions.style.display =
    filterOptions.style.display === "none" ? "block" : "none";
}

function applyFilters() {
  const searchInput = document.getElementById("searchInput").value;
  const statusFilter = document.getElementById("statusFilter").value;
  const roleFilter = document.getElementById("roleFilter").value;
  const dateFilter = document.getElementById("dateFilter").value;

  fetchJobApplications(searchInput, statusFilter, roleFilter, dateFilter);
}

function fetchJobApplications(search = "", status = "", role = "", date = "") {
  const token = localStorage.getItem("token");
  fetch("http://localhost:3001/job-applications", {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: token },
    body: JSON.stringify({ search, status, role, date }),
  })
    .then((response) => response.json())
    .then((data) => {
      const jobList = document.getElementById("jobList");
      jobList.innerHTML = "";
      data.forEach((job) => {
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");
        jobItem.innerHTML = `
        <div>
          <h3>${job.JobTitle} at ${job.CompanyName}</h3>
          <p>Status: ${job.Status}</p>
          <button onclick="viewJobDetails('${job.id}')">View Details</button>
          <button onclick="toggleNote('${job.id}')">📝</button>
          <div id="note-${job.id}" class="note" style="display: none;">
            <textarea id="noteText-${job.id}" placeholder="Add a note">${
          job.note || ""
        }</textarea>
            <button onclick="saveNote('${job.id}')">Save Note</button>
          </div>
        </div>
      `;
        jobList.appendChild(jobItem);
      });
    });
}

function fetchStatusSummary() {
  fetch("http://localhost:3001/status-summary", {
    headers: {
      authorization: token,
    },
  })
    .then((response) => response.json())
    .then(({ stats, counter }) => {
      const statusSummary = document.getElementById("statusSummary");
      statusSummary.innerHTML = `
        <div>Total Applications Sent: ${counter}</div>
        <div>Applied: ${stats[0]}</div>
        <div>Interviewed: ${stats[1]}</div>
        <div>Offered: ${stats[2]}</div>
        <div>Rejected: ${stats[3]}</div>
      `;
    });
}

function openAddJobModal() {
  document.getElementById("addJobModal").style.display = "flex";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

document.getElementById("addJobForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  // const token = localStorage.getItem("token");
  fetch("http://localhost:3001/add-job", {
    method: "POST",
    headers: {
      authorization: token,
    },
    body: formData,
  })
    .then((response) => response.json())
    .then(() => {
      closeModal("addJobModal");
      fetchJobApplications(); // Refresh the job list
    });
});

function viewJobDetails(jobId) {
  fetch(`http://localhost:3001/job-details/${jobId}`, {
    headers: {
      authorization: token,
    },
  })
    .then((response) => response.json())
    .then((job) => {
      console.log(job);
      const jobDetails = document.getElementById("jobDetails");
      jobDetails.innerHTML = `
        <p><strong>Company Name:</strong> ${job.CompanyName}</p>
        <p><strong>Job Title:</strong> ${job.JobTitle}</p>
        <p><strong>Application Date:</strong> ${job.Date}</p>
        <p><strong>Status:</strong> <select id="statusSelect">
          <option value="applied" ${
            job.Status === "applied" ? "selected" : ""
          }>Applied</option>
          <option value="interviewed" ${
            job.Status === "interviewed" ? "selected" : ""
          }>Interviewed</option>
          <option value="offered" ${
            job.Status === "offered" ? "selected" : ""
          }>Offered</option>
          <option value="rejected" ${
            job.Status === "rejected" ? "selected" : ""
          }>Rejected</option>
        </select></p>
        <p><strong>Contact Details:</strong> ${job.ContactDetails}</p>
        <p><strong>Company Size:</strong> ${job.CompanySize}</p>
        <p><strong>Industry:</strong> ${job.industry}</p>
        <p><strong>Description:</strong> ${job.Description}</p>
        <p><strong>Description:</strong> <a href="${job.Resume}">Resume</a></p>
        <button onclick="updateJobStatus('${job.id}')">Update Status</button>
      `;
      openModal("jobModal");
    });
}

function updateJobStatus(jobId) {
  const statusSelect = document.getElementById("statusSelect");
  const newStatus = statusSelect.value;

  fetch(`http://localhost:3001/update-job-status/${jobId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: token },
    body: JSON.stringify({ status: newStatus }),
  }).then(() => {
    closeModal("jobModal");
    fetchJobApplications(); // Refresh the job list
    fetchStatusSummary(); // Refresh the status summary
  });
}

function toggleNote(jobId) {
  const noteDiv = document.getElementById(`note-${jobId}`);
  noteDiv.style.display = noteDiv.style.display === "none" ? "block" : "none";
  fetch(`http://localhost:3001/get-note/${jobId}`, {
    headers: { authorization: token },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      if (res.text) {
        noteDiv.firstElementChild.value = `${res.text}`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function saveNote(jobId) {
  const noteText = document.getElementById(`noteText-${jobId}`).value;

  fetch(`http://localhost:3001/save-note/${jobId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", authorization: token },
    body: JSON.stringify({ note: noteText }),
  }).then(() => {
    fetchJobApplications(); // Refresh the job list
  });
}
