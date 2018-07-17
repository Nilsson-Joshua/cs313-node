/***********************************
               AJAX
***********************************/
let charactersObject;

function loadDoc() {
  let request = new XMLHttpRequest();

  request.onreadystatechange = function() {

    if (request.readyState == 4 && request.status == 200) {

      let characters = JSON.parse(request.responseText);
      console.log(characters);
      charactersObject = characters;
      displayExample(characters);
    }
  };
  request.open("GET", "../json/demographics.json", true);
  request.send();
}

/***********************************
          EXAMPLE DISPLAY
***********************************/
function displayExample(characters) {
  const EXAMPLE = document.getElementById("example");
  const BACK = document.getElementById("resetForm");
  const OUT = document.getElementById("example-out");

  let hideTable = document.getElementById('character-table').style.display = "none";
  let hideReset = document.getElementById('reset').style.display = "none";
  let hideRadios = document.getElementById('tableInputs').style.display = "none";

  EXAMPLE.innerHTML = '<i class="fas fa-angle-double-left"></i> BACK';

  let back = '<canvas id="canvas">';
  back += '</canvas>';
  back += '<button type="button" class="example" id="back"><i class="fas fa-angle-double-left"></i> BACK</button>';

  let str = '<table id="example-table">';
  str += '<thead>';
  str += '<tr>';
  str += '<th>';
  str += '<th>';
  str += '<th>Name</th>';
  str += '<th>Role</th>';
  str += '<th>Age</th>';
  str += '<th>Gender</th>';
  str += '<th>Race</th>';
  str += '<th>Nationality</th>';
  str += '</tr>';
  str += '</thead>';
  str += '<tbody>';
  for (let i = 0; i < characters.demographics.length; i++) {
    str += '<tr>';
    str += '<td><button type="submit" title="Click to Edit" class="edit"><i class="fas fa-edit fa-fw"></i></button></td>';
    str += '<td><button type="submit" title="Click to Delete" class="delete"><i class="fas fa-trash-alt fa-fw"></i></button></td>';
    str += '<td>' + characters.demographics[i].name + '</td>';
    str += '<td>' + characters.demographics[i].role + '</td>';
    str += '<td>' + characters.demographics[i].age + '</td>';
    str += '<td>' + characters.demographics[i].gender + '</td>';
    str += '<td>' + characters.demographics[i].race + '</td>';
    str += '<td>' + characters.demographics[i].nationality + '</td>';
    str += '</tr>';
  }
  str += '</tbody>';
  str += '</table>';
  OUT.innerHTML = str;
  BACK.innerHTML = back;

  let img = Math.floor(Math.random() * 15) + 1;
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var imageObj = new Image();
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  imageObj.onload = function() {
    ctx.drawImage(imageObj, 0, 0, window.innerWidth, window.innerHeight);
  };
  imageObj.src = '../images/image-' + img + '.jpg';

  document.querySelector('#example').addEventListener('click', reload);
  document.querySelector('#back').addEventListener('click', reload);
}

/***********************************
            RELOAD PAGE
***********************************/
function reload() {
  location.reload(true);
}

/***********************************
          CHARACTER OBJECT
***********************************/
let Character = function(id, name, role, age, gender, race, nationality) {
  this.id = id;
  this.name = name;
  this.role = role;
  this.age = age;
  this.gender = gender;
  this.race = race;
  this.nationality = nationality;
}

//let joshua = new Character(1, "Joshua Nilsson", "Creator", 26, "Male", "Human", "American");
//
//document.getElementById("footer").innerHTML = joshua.role + ": " + joshua.name;

/***********************************
    DISPLAY CHARACTERS IF SET
***********************************/

document.addEventListener('DOMContentLoaded', function(e) {
if (currentTable === 'local') {
  let out = document.getElementById('character-out');
  displayCharacters(getCharacters(), out);
}
else if (currentTable === 'community') {
  get('/community', function(error, result) {
    if (error) {
      return console.log(error);
    }
    let out = document.getElementById('character-out');
    displayCharacters(JSON.parse(result), out);
  });
}
});

/***********************************
  GENERATE CHARACTERS UPON SUBMIT
***********************************/
function generate() {

  let characters = [];

  let time = new Date();
  let id = time.valueOf();

  let name = document.getElementById('name').value;
  let role = document.getElementById('role').value;
  let age = document.getElementById('age').value;

  name = capitalize(name);
  role = capitalize(role);
  age = Math.round(age);

  /***********************************
          IF MALE CHECKED
***********************************/
  if (document.getElementById('male').checked) {
    let gender = document.getElementById('male').value;
    gender = capitalize(gender);

    if((document.getElementById('race') && document.getElementById('race').value) && (document.getElementById('nationality') && document.getElementById('nationality').value))
    {
      let race = document.getElementById('race').value;
      race = capitalize(race);
      let nationality = document.getElementById('nationality').value;
      nationality = capitalize(nationality);
      writeFile(id, name, role, age, gender, race, nationality);
    }
    else {
      let race = "N/A";
      let nationality = "N/A";
      writeFile(id, name, role, age, gender, race, nationality);
    }
  }
  /***********************************
          IF FEMALE CHECKED
***********************************/
  else if (document.getElementById('female').checked) {
    let gender = document.getElementById('female').value;
    gender = capitalize(gender);

    if((document.getElementById('race') && document.getElementById('race').value) && (document.getElementById('nationality') && document.getElementById('nationality').value))
    {
      let race = document.getElementById('race').value;
      race = capitalize(race);
      let nationality = document.getElementById('nationality').value;
      nationality = capitalize(nationality);
      writeFile(id, name, role, age, gender, race, nationality);
    }
    else {
      let race = "N/A";
      let nationality = "N/A";
      writeFile(id, name, role, age, gender, race, nationality);
    }
  }
}

/***********************************
      CAPITALIZE FIRST LETTERS
***********************************/
function capitalize(str)
{
  if (str === "") {
    str = "N/A";
    return str.toUpperCase();
  }
  else {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
}

/***********************************
          WRITE CHARACTERS
***********************************/
function writeFile(id, name, role, age, gender, race, nationality) {
  createCharacter({
    "id":          id,
    "name":        name,
    "role":        role,
    "age":         age,
    "gender":      gender,
    "race":        race,
    "nationality": nationality
  });
}

/***********************************
          CREATE CHARACTERS
***********************************/
function createCharacter(data) {
  if (currentTable === 'local') {
    var characters = getCharacters();
    characters.push(data);
    saveCharacters(characters);
  }
  else if (currentTable === 'community') {
    post('/character', JSON.stringify(data), function(err) {
      if (err) {
        console.log("Failed to Create");
      }
      else {
        location.reload();
      }
    });
  }
};

/***********************************
          SAVE CHARACTERS
***********************************/
function saveCharacters(data) {
  localStorage.setItem('characters', JSON.stringify(data));
};

/***********************************
          GET CHARACTERS
***********************************/
function getCharacters() {
  return JSON.parse(localStorage.getItem('characters') || JSON.stringify([]));
};

/***********************************
      DISPLAY CHARACTERS TABLE
***********************************/
function displayCharacters(characters, out) {

  let value = '<form>';
  characters.forEach(function(character) {
    value += '<tr id="' + character.id + '">';
    value += '<td><button type="submit" onclick="showUpdateForm(' + character.id + ')" title="Click to Edit" class="edit"><i class="fas fa-edit fa-fw"></i></button></td>';
    value += '<td><button type="submit" onclick="deleteCharacter(' + character.id + '); location.reload();" title="Click to Delete" data-delete="' + character.id + '" class="delete"><i class="fas fa-trash-alt fa-fw" data-delete="' + character.id + '"></i></button></td>';
    value += '<td>' + character.name + '</td>';
    value += '<td>' + character.role + '</td>';
    value += '<td>' + character.age + '</td>';
    value += '<td>' + character.gender + '</td>';
    value += '<td>' + character.race + '</td>';
    value += '<td>' + character.nationality + '</td>';
    value += '</tr>';
  })
  value += '</form>';

  out.innerHTML = value;
}

/***********************************
     SHOW RACE/NATIONALITY (DOM)
***********************************/
function showRaceNationality() {
  let element1 = document.createElement('div');
  let dom1 = document.getElementById('raceDOM');
  let div1 = document.querySelector('#raceDIV');

  let element2 = document.createElement('div');
  let dom2 = document.getElementById('nationalityDOM');
  let div2 = document.querySelector('#nationalityDIV');

  element1.innerHTML = '<label for="race">Race</label><input type="text" name="race" placeholder="Human" class="animate-input shadow-pop-br" id="race" required>';
  dom1.insertBefore(element1, div1.nextSibling);

  element2.innerHTML = '<label for="nationality">Nationality</label><input type="text" name="nationality" placeholder="Khesi" class="animate-input shadow-pop-br" id="nationality" required>';
  dom2.insertBefore(element2, div2.nextSibling);

  element1.classList.toggle("slide-in-fwd-left");
  element2.classList.toggle("slide-in-fwd-left");

  let hide = document.getElementById('showBtn').style.display = "none";
}

/***********************************
            RESET FORM
***********************************/
function resetForm() {
  document.getElementById("resetForm").value = "";
}

/***********************************
          GET CHARACTER ID
***********************************/
function getCharacter(id, callback) {

  if (currentTable === 'local') {
    let character = getCharacters().filter(function(character) {
      return Number(character.id) === Number(id);
    }).shift();
    callback(null, character);
  }

  else if (currentTable === 'community') {
    get('/character/' + id, callback);
    }
  }

/***********************************
          SHOW UPDATE FORM
***********************************/
function showUpdateForm(id) {
  console.log(id);
  console.log(currentTable);
  getCharacter(id, function(error, character) {
    if (error) {
      return console.log(error);
    }
    else {
      if (typeof character === 'string') {
        character = JSON.parse(character);
      }

      var updateForm = document.getElementById('update-form');

      let hideForm = document.getElementById('resetForm').style.display = "none";
      let hideBtn = document.getElementById('reset').style.display = "none";

      // read data out of the "character" variable and place it inside of the update form
      let value = '<div class="entry">';
      value += '<form onsubmit="return processCharacterUpdate()" id="resetFormUpdate">';

      // HIDDEN ID FIELD
      value += '<input name="id" type="hidden" value="' + character.id + '">';

      // NAME FIELD
      value += '<label for="name">Name</label>';
      value += '<input type="text" name="name" value="' + character.name + '" placeholder="Wren" maxlength="10" class="animate-input shadow-pop-br" id="nameUpdate" autofocus required>';

      // ROLE FIELD
      value += '<label for="role">Role</label>';
      value += '<input type="text" name="role" value="' + character.role + '" placeholder="Bounty Hunter" list="rolesUpdate" class="animate-input shadow-pop-br" id="roleUpdate" required>';
      value += '<datalist id="rolesUpdate"><option value="Bounty Hunter"></option><option value="Mercenary"></option><option value="Zealot"></option></datalist>';

      // AGE FIELD
      value += '<label for="age">Age</label>';
      value += '<input type="number" name="age" value="' + character.age + '" placeholder="123" min="0" class="animate-input shadow-pop-br" id="ageUpdate" required>';

      // GENDER RADIO BOXES -- ISSUES WITH RADIO BUTTONS 'FOR' ATTRIBUTE
      value += '<label>Gender</label>';
      value += '<div id="genderInputsUpdate">';

      // MALE RADIO BOX
      value += '<input type="radio" name="gender" value="Male" id="maleUpdate"';
      // input value ==== "male", but do caps-lock matter?
      if (character.gender === 'Male') {
        value += ' checked';
      }
      value += '>';
      value += '<label for="maleUpdate"><i class="fas fa-mars"></i> Male</label>';

      // FEMALE RADIO BOX
      value += '<input type="radio" name="gender" value="Female" id="femaleUpdate"';
      if (character.gender === 'Female') {
        value += ' checked';
      }
      value += '>';
      value += '<label for="femaleUpdate"><i class="fas fa-venus"></i> Female</label>';
      value += '</div>';

      // RACE FIELD
      value+= '<label for="race">Race</label>';
      value += '<input type="text" name="race" value="' + character.race + '" placeholder="Human" class="animate-input shadow-pop-br" id="raceUpdate" required>';

      // NATIONALITY FIELD
      value += '<label for="nationality">Nationality</label>';
      value += '<input type="text" name="nationality" value="' + character.nationality + '" placeholder="Khesi" class="animate-input shadow-pop-br" id="nationalityUpdate" required>';

      // SUBMIT UPDATE BUTTON
      value += '<button type="submit" value="UPDATE" id="submitUpdate"><i class="fas fa-pencil-alt"></i> UPDATE</button>';
      value += '</form>';
      value += '<button type="button" onclick="hideUpdateForm()" value="CANCEL" id="cancelUpdate"><i class="fas fa-ban"></i> CANCEL</button>'

      updateForm.innerHTML = value;
    }
  });
}

/***********************************
      PROCESS CHARACTER UPDATE
***********************************/
function processCharacterUpdate() {
  let updateForm = document.getElementById('resetFormUpdate');

  // read values out of the update form
  let id = updateForm.elements.namedItem('id').value;
  let name = updateForm.elements.namedItem('name').value;
  let role = updateForm.elements.namedItem('role').value;
  let age = updateForm.elements.namedItem('age').value;
  let gender = updateForm.elements.namedItem('gender').value;
  let race = updateForm.elements.namedItem('race').value;
  let nationality = updateForm.elements.namedItem('nationality').value;

  let character = {
    id: id,
    name: name,
    role: role,
    age: age,
    gender: gender,
    race: race,
    nationality: nationality
  };
//  console.log('hey', character);

  updateCharacter(id, character);
  hideUpdateForm();
  // RELOAD HERE?
  reload();
  return false;
}

/***********************************
          HIDE UPDATE FORM
***********************************/
function hideUpdateForm() {
  let hideForm = document.getElementById('resetFormUpdate').style.display = "none";
  let hideBtn = document.getElementById('cancelUpdate').style.display = "none";

  let showForm = document.getElementById('resetForm').style.display = "block";
  let showBtn = document.getElementById('reset').style.display = "block";
}

/***********************************
            UPDATE ENTRY
***********************************/
function updateCharacter(id, data) {
  if (currentTable === 'local') {
  saveCharacters(getCharacters().reduce(function(results, current) {
    results.push(Number(current.id) === Number(id) ? data : current);
    return results;
  }, []));
  }
  else if (currentTable === 'community') {

    ///////////// ADDED DATA PARAMETER between id and callback function - passes data now
    editEntry('/character/' + id, data, function(err) {
      if (err) {
        console.log("Failed to Update");
      }
      else {
        location.reload();
      }
    });
  }
}

/***********************************
            DELETE ENTRY
***********************************/
function deleteCharacter(id) {
  if (currentTable === 'local') {
  saveCharacters(getCharacters().filter(function(character) {
    return Number(character.id) !== Number(id);
  }));
  }
  else if (currentTable === 'community') {
    deleteEntry('/character/' + id, function(err) {
      if (err) {
        console.log("Failed to Delete");
      }
      else {
        location.reload();
      }
    });
  }
};

// GLOBAL VARIABLE!
var currentTable = localStorage.getItem('currentTable') || 'local';
/***********************************
            LOCAL TABLE
***********************************/
document.addEventListener('DOMContentLoaded', function(e) {
  document.getElementById('local').addEventListener('click', function(e) {
    currentTable = document.querySelector('input[name = "table"]:checked').value;

    localStorage.setItem('currentTable', currentTable);

//    let show = document.getElementById('character-out').style.display = "table-row-group";
//    let hide = document.getElementById('character-out').style.display = "none";
    if (currentTable === 'local') {
      console.log(currentTable);
      let out = document.getElementById('character-out');
      displayCharacters(getCharacters(), out);
    };
  });

/***********************************
          COMMUNITY TABLE
***********************************/
  document.getElementById('community').addEventListener('click', function(e) {
    currentTable = document.querySelector('input[name = "table"]:checked').value;

    localStorage.setItem('currentTable', currentTable);

//    let show = document.getElementById('character-out').style.display = "block";
//    let hide = document.getElementById('character-out').style.display = "none";
    if (currentTable === 'community') {
      get('/community', function(error, result) {
        if (error) {
          return console.log(error);
        }
        console.log(currentTable);
        let out = document.getElementById('character-out');
        displayCharacters(JSON.parse(result), out);
      });
    }
  });
});

if (window.location.search.indexOf('table=local') > -1 || window.location.search.indexOf('') > -1) {
  // Check #x
  $( "#community" ).prop( "checked", false );
  $( "#local" ).prop( "checked", true );
}

else {
  // Check #x
  $( "#local" ).prop( "checked", false );
  $( "#community" ).prop( "checked", true );
}

if (currentTable === 'local') {
  // Check #x
  $( "#community" ).prop( "checked", false );
  $( "#local" ).prop( "checked", true );
}

else {
  // Check #x
  $( "#local" ).prop( "checked", false );
  $( "#community" ).prop( "checked", true );
}
