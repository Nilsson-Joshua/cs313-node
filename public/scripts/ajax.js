function get(url, callback) {
  var request = new XMLHttpRequest();

  request.addEventListener('load', function() {
    if (request.status === 200 || request.status === 304) {
      return callback(null, request.responseText);
    }

    return callback(new Error('!200'));
  });

  request.open('GET', url, true);
  request.send();
};



function post(url, data, callback) {
  var request = new XMLHttpRequest();

  request.addEventListener('load', function() {
    if (request.status === 200 || request.status === 201) {
      return callback(null, request.responseText);
    }

    return callback(new Error('!200'));
  });

  request.open('POST', url, true);

  request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

  request.send(data);
};


function editEntry(url, data, callback) {
  var request = new XMLHttpRequest();

  request.addEventListener('load', function() {
    if (request.status === 200 || request.status === 204) {
      return callback(null, request.responseText);
    }

    return callback(new Error('!200'));
  });

  request.open('PATCH', url, true);

  request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

  /////////////////////////////////////////////////////////////// TO WORK ON!
  //// patch request through AJAX, maybe header set incorrectly?

  request.send(JSON.stringify(data));
//  request.send(data);
};


function deleteEntry(url, callback) {
  var request = new XMLHttpRequest();

  request.addEventListener('load', function() {
    if (request.status === 200 || request.status === 202) {
      return callback(null, request.responseText);
    }

    return callback(new Error('!200'));
  });

  request.open('DELETE', url, true);
  request.send();
};


function clearTarget(target) {
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
}

function displayPeople(people) {
  var output = document.getElementById('community-out');

  // commented out for testing; uncomment for production
  // clearTarget(output);

  var table = document.createElement('table');
  var thead = document.createElement('thead');
  var trTHEAD = document.createElement('tr');
  var nameTH = document.createElement('th');
  var roleTH = document.createElement('th');
  var ageTH = document.createElement('th');
  var genderTH = document.createElement('th');
  var raceTH = document.createElement('th');
  var nationalityTH = document.createElement('th');

  // output is probably a table already; append thead there instead
  //table.appendChild(thead);
  output.appendChild(thead);


  thead.appendChild(trTHEAD);
  trTHEAD.appendChild(nameTH);
  nameTH.innerText = "Name";
  trTHEAD.appendChild(roleTH);
  roleTH.innerText = "Role";
  trTHEAD.appendChild(ageTH);
  ageTH.innerText = "Age";
  trTHEAD.appendChild(genderTH);
  genderTH.innerText = "Gender";
  trTHEAD.appendChild(raceTH);
  raceTH.innerText = "Race";
  trTHEAD.appendChild(nationalityTH);
  nationalityTH.innerText = "Nationality";
  var tbody = document.createElement('tbody');

  // output is probably a table already; append tbody there instead
  // table.appendChild(tbody);
  output.appendChild(tbody);

  people.forEach(function(person) {

    var row = document.createElement('tr');
    var editCell = document.createElement('td');
    var editButton = document.createElement('button');
    var deleteCell = document.createElement('td');
    var deleteButton = document.createElement('button');

    var nameCell = document.createElement('td');
    var roleCell = document.createElement('td');
    var ageCell = document.createElement('td');
    var genderCell = document.createElement('td');
    var raceCell = document.createElement('td');
    var nationalityCell = document.createElement('td');

    editButton.addEventListener('click', function(e) {
      alert(person.id);
    });
    deleteButton.addEventListener('click', function(e) {
      alert(person.id);
    });

    row.appendChild(editCell);
    editCell.appendChild(editButton);
    editButton.innerText = 'Edit';

    row.appendChild(deleteCell);
    deleteCell.appendChild(deleteButton);
    deleteButton.innerText = 'Delete';

    row.appendChild(nameCell);
    nameCell.innerText = person.name;

    row.appendChild(roleCell);
    roleCell.innerText = person.role;

    row.appendChild(ageCell);
    ageCell.innerText = person.age;

    row.appendChild(genderCell);
    genderCell.innerText = person.gender;

    row.appendChild(raceCell);
    raceCell.innerText = person.race;

    row.appendChild(nationalityCell);
    nationalityCell.innerText = person.nationality;

    // append rows to the table body, not the table
    tbody.appendChild(row);
  });
}
