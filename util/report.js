

function updateTable(year) {
    document.getElementById("faculty").textContent = "";

    sum = [0, 0, 0, 0, 0, 0]; 
    getvaluesForPublications = [
        (publications) => publications["scientific"],
        (publications) => publications["scientific_full"],
        (publications) => publications["wos_scopus"],
        (publications) => publications["scientific_full"] - publications["wos_scopus"],
        (publications) => publications["scientific"] - publications["scientific_full"]
    ]
    for (faculty of data[year]["children"]) {
        var row = document.createElement("tr");

        facultyname = document.createElement("td");
        facultyname.textContent = faculty["name"];
        row.appendChild(facultyname);
        

        for (let i = 0; i < 5; i++) {
            td = document.createElement("td");        
            value = getvaluesForPublications[i](faculty["publications"]);
            sum[i] += value;
            td.textContent = value;
            row.appendChild(td);
        }

        document.getElementById("faculty").appendChild(row);
    }
    
    
    var row = document.createElement("tr");
    sumname = document.createElement("td");
    sumname.textContent = "SUM";
    row.appendChild(sumname);
    for (let i = 0; i < 5; i++) {
        td = document.createElement("td");
        sumvalue = getvaluesForPublications[i](data[year]["publications"]);
        td.textContent = sumvalue;
        sum[i] -= sumvalue;
        row.appendChild(td);
    }
    document.getElementById("summary").textContent = "";
    document.getElementById("summary").appendChild(row);


    var row = document.createElement("tr");
    duplicatename = document.createElement("td");
    duplicatename.textContent = "Duplicates";
    row.appendChild(duplicatename);
    for (let i = 0; i < 5; i++) {
        td = document.createElement("td");
        td.textContent = sum[i];
        row.appendChild(td);
    }
    document.getElementById("duplicates").textContent = "";
    document.getElementById("duplicates").appendChild(row);
}


function updateChart(year) {
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

function fetchPeople(year) {
    var people = [];
    getPersons(data[year], people);
    return people
}

function getPersons(org, people) {
    if (org == null) return;
    if (org["children"]) 
        for (suborg of org["children"]) getPersons(suborg, people);
    if (org["people"])
        for (person of org["people"])  {
            person["org"] = org["name"];
            people.push(person);
        }
}

function updateTopList(year) {
    toplist = document.getElementById("toplist");
    people = fetchPeople(year);
    people.sort((a, b) => b["publications"]["wos_scopus"] - a["publications"]["wos_scopus"]);

    toplist.textContent = "";
    for (let i = 0; i < 20; i++) {
        item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `<span><span class="badge bg-primary px-2">${people[i]["publications"]["wos_scopus"]}</span> <strong  class="px-5">${people[i]["name"]}</strong></span> (${people[i]["org"]})`;
        toplist.appendChild(item);
    }
}

function update() {
    let year = document.getElementById("year").value;
    updateChart(year);
    updateTable(year);
    updateTopList(year)
    console.log(fetchPeople(year));
}





