

function updateTable(org) {
    document.getElementById("sub-org-table").display = "none";
    document.getElementById("faculty").textContent = "";
    document.getElementById("summary").textContent = "";
    document.getElementById("duplicates").textContent = "";

    if (org == null || !org["children"]) return;

    document.getElementById("sub-org-table").display = "block";
    sum = [0, 0, 0, 0, 0, 0]; 
    getvaluesForPublications = [
        (publications) => publications["scientific"],
        (publications) => publications["scientific_full"],
        (publications) => publications["wos_scopus"],
        (publications) => publications["scientific_full"] - publications["wos_scopus"],
        (publications) => publications["scientific"] - publications["scientific_full"]
    ]
    for (faculty of org["children"]) {
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
        sumvalue = getvaluesForPublications[i](org["publications"]);
        td.textContent = sumvalue;
        sum[i] -= sumvalue;
        row.appendChild(td);
    }
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
    document.getElementById("duplicates").appendChild(row);
}


function updateChart(org) {
    if (myChart) {
        myChart.destroy();
    }
    if (org == null || !org["children"]) return;
    
    org["children"] = org.children.filter(f => f!=null);
    faculties = org["children"].map(f => f["name"])
    pub1 = org["children"].map(f => f["publications"]["scientific"] - f["publications"]["scientific_full"])
    pub2 = org["children"].map(f => f["publications"]["scientific_full"] - f["publications"]["wos_scopus"])
    pub3 = org["children"].map(f => f["publications"]["wos_scopus"])

    myChart = new Chart(document.getElementById('myChart').getContext('2d'), {
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

function fetchPeople(org) {
    var people = [];
    getPersons(org, people);
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

function updateTopList(org) {
    toplist = document.getElementById("toplist");
    toplist.textContent = "";

    people = fetchPeople(org);
    people.sort((a, b) => b["publications"]["wos_scopus"] - a["publications"]["wos_scopus"]);

    for (let i = 0; i < 20 && i < people.length ; i++) {
        item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `<span><span class="badge bg-primary px-2">${people[i]["publications"]["wos_scopus"]}</span> <strong  class="px-5">${people[i]["name"]}</strong></span> (${people[i]["org"]})`;
        toplist.appendChild(item);
    }
}

function find_organization(org, id) {
    if (org == null) return null;
    if (org["id"] == id) return org;
    if (org["children"]) {
        for (child of org["children"]) {
            result = find_organization(child, id);
            if (result) return result;
        }
    }
    return null;
}

function update() {
    let year = document.getElementById("year").value;
    let orgid = document.getElementById("organization").value;
    orgdata = find_organization(data[year], orgid);

    console.log(orgdata)

    updateChart(orgdata);
    updateTable(orgdata);
    updateTopList(orgdata)
}





