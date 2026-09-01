const API_URL = "https://ai-power-data-analysis-3.onrender.com";

const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("uploadArea");
const fileName = document.getElementById("fileName");
const analyzeButton = document.getElementById("analyzeButton");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");

const overview = document.getElementById("overview");
const insights = document.getElementById("insights");
const visualizations = document.getElementById("visualizations");
const preview = document.getElementById("preview");
const askSection = document.getElementById("ask");

const rows = document.getElementById("rows");
const columns = document.getElementById("columns");
const missing = document.getElementById("missing");
const duplicates = document.getElementById("duplicates");

const numericColumns = document.getElementById("numericColumns");
const categoricalColumns = document.getElementById("categoricalColumns");

const aiInsights = document.getElementById("aiInsights");

const tableHead = document.getElementById("tableHead");
const tableBody = document.getElementById("tableBody");

const correlationContainer =
    document.getElementById("correlationContainer");

const questionInput =
    document.getElementById("questionInput");

const askButton =
    document.getElementById("askButton");

const questionLoading =
    document.getElementById("questionLoading");

const answerBox =
    document.getElementById("answerBox");

let selectedFile = null;

let lineChart = null;
let barChart = null;
let doughnutChart = null;


fileInput.addEventListener("change", function () {

    if (!this.files.length) {
        return;
    }

    const file = this.files[0];

    if (!file.name.toLowerCase().endsWith(".csv")) {

        showError("Please select a CSV file.");

        return;
    }

    selectedFile = file;

    fileName.textContent = file.name;

    analyzeButton.style.display = "inline-block";

    errorMessage.style.display = "none";
});


uploadArea.addEventListener("dragover", function (event) {

    event.preventDefault();

    uploadArea.classList.add("dragover");
});


uploadArea.addEventListener("dragleave", function () {

    uploadArea.classList.remove("dragover");
});


uploadArea.addEventListener("drop", function (event) {

    event.preventDefault();

    uploadArea.classList.remove("dragover");

    const files = event.dataTransfer.files;

    if (!files.length) {
        return;
    }

    const file = files[0];

    if (!file.name.toLowerCase().endsWith(".csv")) {

        showError("Please upload a CSV file.");

        return;
    }

    selectedFile = file;

    fileName.textContent = file.name;

    analyzeButton.style.display = "inline-block";

    errorMessage.style.display = "none";
});


analyzeButton.addEventListener("click", async function () {

    if (!selectedFile) {

        showError(
            "Please select a CSV file first."
        );

        return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    loading.style.display = "flex";

    analyzeButton.disabled = true;

    errorMessage.style.display = "none";

    try {

        const response = await fetch(
            `${API_URL}/upload`,
            {
                method: "POST",
                body: formData
            }
        );

        if (!response.ok) {
            throw new Error(
                "Failed to analyze dataset."
            );
        }

        const data = await response.json();

        displayDashboard(data);

    } catch (error) {

        showError(
            "Could not connect to the backend. Make sure FastAPI is running."
        );

    } finally {

        loading.style.display = "none";

        analyzeButton.disabled = false;
    }
});


function displayDashboard(data) {

    overview.classList.remove("hidden");
    insights.classList.remove("hidden");
    visualizations.classList.remove("hidden");
    preview.classList.remove("hidden");
    askSection.classList.remove("hidden");

    rows.textContent =
        formatNumber(data.rows);

    columns.textContent =
        formatNumber(data.columns);

    missing.textContent =
        formatNumber(data.missing_values);

    duplicates.textContent =
        formatNumber(data.duplicate_rows);

    renderTags(
        numericColumns,
        data.numeric_columns || []
    );

    renderTags(
        categoricalColumns,
        data.categorical_columns || []
    );

    aiInsights.textContent =
        data.ai_insights || "No insights available.";

    renderCharts(
        data.chart_data,
        data.correlation
    );

    renderTable(
        data.preview
    );

    setTimeout(function () {

        overview.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }, 200);
}


function renderTags(container, items) {

    container.innerHTML = "";

    if (!items.length) {

        const tag = document.createElement("span");

        tag.className = "tag";

        tag.textContent = "None";

        container.appendChild(tag);

        return;
    }

    items.forEach(function (item) {

        const tag = document.createElement("span");

        tag.className = "tag";

        tag.textContent = item;

        container.appendChild(tag);
    });
}


function renderCharts(chartData, correlation) {

    if (lineChart) {
        lineChart.destroy();
    }

    if (barChart) {
        barChart.destroy();
    }

    if (doughnutChart) {
        doughnutChart.destroy();
    }

    const numericData =
        chartData?.numeric || {};

    const numericKeys =
        Object.keys(numericData);

    if (numericKeys.length) {

        const labels =
            numericData[numericKeys[0]]
                .map((_, index) => index + 1);

        const datasets =
            numericKeys.slice(0, 3).map(function (column) {

                return {
                    label: column,
                    data: numericData[column],
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 2
                };

            });

        lineChart = new Chart(
            document.getElementById("lineChart"),
            {
                type: "line",
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: "#aeb6ca"
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#737d93"
                            },
                            grid: {
                                color: "rgba(255,255,255,0.05)"
                            }
                        },
                        y: {
                            ticks: {
                                color: "#737d93"
                            },
                            grid: {
                                color: "rgba(255,255,255,0.05)"
                            }
                        }
                    }
                }
            }
        );
    }


    const categoricalData =
        chartData?.categorical;

    if (categoricalData) {

        barChart = new Chart(
            document.getElementById("barChart"),
            {
                type: "bar",
                data: {
                    labels: categoricalData.labels,
                    datasets: [
                        {
                            label: categoricalData.column,
                            data: categoricalData.values,
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: "#aeb6ca"
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: "#737d93"
                            },
                            grid: {
                                display: false
                            }
                        },
                        y: {
                            ticks: {
                                color: "#737d93"
                            },
                            grid: {
                                color: "rgba(255,255,255,0.05)"
                            }
                        }
                    }
                }
            }
        );


        doughnutChart = new Chart(
            document.getElementById("doughnutChart"),
            {
                type: "doughnut",
                data: {
                    labels: categoricalData.labels,
                    datasets: [
                        {
                            data: categoricalData.values,
                            borderWidth: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: "bottom",
                            labels: {
                                color: "#aeb6ca",
                                padding: 15
                            }
                        }
                    }
                }
            }
        );
    }

    renderCorrelation(correlation);
}


function renderCorrelation(correlation) {

    correlationContainer.innerHTML = "";

    if (
        !correlation ||
        !Object.keys(correlation).length
    ) {

        correlationContainer.innerHTML =
            "<p>No correlation data available.</p>";

        return;
    }

    const columns =
        Object.keys(correlation);

    const empty =
        document.createElement("div");

    correlationContainer.appendChild(empty);

    columns.forEach(function (column) {

        const cell =
            document.createElement("div");

        cell.className =
            "correlation-cell correlation-label";

        cell.textContent = column;

        correlationContainer.appendChild(cell);
    });


    columns.forEach(function (rowColumn) {

        const rowLabel =
            document.createElement("div");

        rowLabel.className =
            "correlation-cell correlation-label";

        rowLabel.textContent =
            rowColumn;

        correlationContainer.appendChild(rowLabel);


        columns.forEach(function (column) {

            const cell =
                document.createElement("div");

            cell.className =
                "correlation-cell correlation-value";

            const value =
                correlation[rowColumn]?.[column];

            cell.textContent =
                value === undefined
                    ? "-"
                    : Number(value).toFixed(2);

            correlationContainer.appendChild(cell);
        });
    });
}


function renderTable(previewData) {

    tableHead.innerHTML = "";

    tableBody.innerHTML = "";

    if (!previewData) {
        return;
    }

    const headerRow =
        document.createElement("tr");

    previewData.columns.forEach(function (column) {

        const th =
            document.createElement("th");

        th.textContent = column;

        headerRow.appendChild(th);
    });

    tableHead.appendChild(headerRow);


    previewData.rows.forEach(function (row) {

        const tr =
            document.createElement("tr");

        previewData.columns.forEach(function (column) {

            const td =
                document.createElement("td");

            td.textContent =
                row[column];

            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
}


function formatNumber(number) {

    return Number(number).toLocaleString();
}


askButton.addEventListener(
    "click",
    askQuestion
);


questionInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {
            askQuestion();
        }

    }
);


async function askQuestion() {

    const question =
        questionInput.value.trim();

    if (!question) {
        return;
    }

    questionLoading.style.display =
        "flex";

    answerBox.classList.add(
        "hidden"
    );

    askButton.disabled = true;

    try {

        const response =
            await fetch(
                `${API_URL}/ask`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        question: question
                    })
                }
            );

        if (!response.ok) {
            throw new Error(
                "Question request failed."
            );
        }

        const data =
            await response.json();

        displayAnswer(data);

    } catch (error) {

        answerBox.textContent =
            "Unable to get an answer. Please check your backend.";

        answerBox.classList.remove(
            "hidden"
        );

    } finally {

        questionLoading.style.display =
            "none";

        askButton.disabled = false;
    }
}


function displayAnswer(data) {

    answerBox.innerHTML = "";

    if (data.error) {

        answerBox.textContent =
            data.error;

        answerBox.classList.remove(
            "hidden"
        );

        return;
    }

    answerBox.textContent =
        data.response || "No response received.";

    answerBox.classList.remove(
        "hidden"
    );
}


function showError(message) {

    errorMessage.textContent =
        message;

    errorMessage.style.display =
        "block";
}