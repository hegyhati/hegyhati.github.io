
function reportyear() {
    let year = document.getElementById("year").value;

    
    document.getElementById("faculty").textContent = "";
    for (faculty of data[year]["children"]) {
        var row = document.createElement("tr");
        var fname = document.createElement("td");
        var scientific = document.createElement("td");
        var scientific_full = document.createElement("td");
        var wos_scopus = document.createElement("td");
        var full_not_wos_scopus = document.createElement("td");
        var scientific_not_full = document.createElement("td");

        fname.innerHTML = faculty["name"];
        scientific.innerHTML = faculty["publications"]["scientific"];
        scientific_full.innerHTML = faculty["publications"]["scientific_full"];
        wos_scopus.innerHTML = faculty["publications"]["wos_scopus"];
        full_not_wos_scopus.innerHTML = faculty["publications"]["scientific_full"] - faculty["publications"]["wos_scopus"];
        scientific_not_full.innerHTML = faculty["publications"]["scientific"] - faculty["publications"]["scientific_full"];

        row.appendChild(fname);
        row.appendChild(scientific);
        row.appendChild(scientific_full);
        row.appendChild(wos_scopus);
        row.appendChild(full_not_wos_scopus);
        row.appendChild(scientific_not_full);

        document.getElementById("faculty").appendChild(row);
    }

    faculties = data[year]["children"].map(f => f["name"])
    pub1 = data[year]["children"].map(f => f["publications"]["scientific"] - f["publications"]["scientific_full"])
    pub2 = data[year]["children"].map(f => f["publications"]["scientific_full"] - f["publications"]["wos_scopus"])
    pub3 = data[year]["children"].map(f => f["publications"]["wos_scopus"])

    // plot pub1, pub2, pub3 with labelst faculties
    var ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: faculties,
            datasets: [{
                label: 'scientific non full',
                data: pub1,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'full non wos_scopus',
                data: pub2,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'wos_scopus',
                data: pub3,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    beginAtZero: true,
                    stacked: true
                }
            }
        }
    });
}
