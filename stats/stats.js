document.addEventListener("DOMContentLoaded", () => {
  fetchStatsData();

  async function fetchStatsData() {
    try {
      const response = await fetch("http://localhost:3001/stats");
      const data = await response.json();
      console.log(data);
      updateProgressBars(data);
      updateCharts(data);
      document.getElementById("totalApplications").textContent =
        data.totalApplications;
    } catch (error) {
      console.error("Error fetching stats data:", error);
    }
  }

  function updateProgressBars(data) {
    const interviewsProgress =
      (data.interviewsScheduled / data.totalApplications) * 100;
    const offersProgress = (data.offersReceived / data.totalApplications) * 100;

    document.getElementById(
      "interviewsProgress"
    ).style.width = `${interviewsProgress}%`;
    document.getElementById(
      "offersProgress"
    ).style.width = `${offersProgress}%`;
  }

  function updateCharts(data) {
    const statusCtx = document
      .getElementById("statusPieChart")
      .getContext("2d");
    const industryCtx = document
      .getElementById("industryPieChart")
      .getContext("2d");
    const successRateCtx = document
      .getElementById("successRateChart")
      .getContext("2d");

    new Chart(statusCtx, {
      type: "pie",
      data: {
        labels: ["Applied", "Interviewed", "Offered", "Rejected"],
        datasets: [
          {
            data: [
              data.status.applied,
              data.status.interviewed,
              data.status.offered,
              data.status.rejected,
            ],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF9F40"],
          },
        ],
      },
    });

    new Chart(industryCtx, {
      type: "pie",
      data: {
        labels: Object.keys(data.industryDistribution),
        datasets: [
          {
            data: Object.values(data.industryDistribution),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF9F40",
              "#4BC0C0",
            ],
          },
        ],
      },
    });

    new Chart(successRateCtx, {
      type: "bar",
      data: {
        labels: ["Interviews Scheduled", "Offers Received"],
        datasets: [
          {
            label: "Success Rate",
            data: [
              (data.interviewsScheduled / data.totalApplications) * 100,
              (data.offersReceived / data.totalApplications) * 100,
            ],
            backgroundColor: ["#4CAF50", "#2196F3"],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });
  }
});
