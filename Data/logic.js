let emergancy = false;
let run = false;
<<<<<<< HEAD

=======
//test
>>>>>>> develop
let maxSpeed;

let slider = document.getElementById("sliders");

// maxSpeed = fetch("/get-trains").then((res) => res.json());

// fetch('/get-trains').then((res) => res.json()).then(res => maxSpeed = res.)

slider.oninput = () => setSliderValue(slider.value);

window.onload = () => {
  fetch("/get-trains")
    .then((res) => res.json())
    .then((data) => {
      const sel = document.getElementById("trainSelect");
      sel.innerHTML = "";
      data.Train.forEach((train) => {
        let opt = document.createElement("option");
        opt.text = `${train.type} - ID: ${train.id}`;
        maxSpeed = data;
        sel.add(opt);
      });
    });
};

function fetchvalue(value) {
  console.log(value);
  document.getElementById("reverse").value = value;
  fetch("/get?speed1=" + value);
  if (value > 0) {
    document.getElementById("Train_Controll").style.backgroundColor =
<<<<<<< HEAD
      "lightgreen";
  } else {
    document.getElementById("Train_Controll").style.backgroundColor = "white";
  }
}

=======
      "#00ff001f";
  } else {
    document.getElementById("Train_Controll").style.backgroundColor =
      "transparent";
  }
}
//Slider Value to Textfield and fetch
>>>>>>> develop
function setSliderValue(speed) {
  console.log(speed);
  document.getElementById("speed1").value = speed;
  fetchvalue(speed);
}
<<<<<<< HEAD

=======
//Emengancy Stop
>>>>>>> develop
function Stop() {
  console.log(fetch("/get?Run=0"));
  console.log(document.getElementById("speed1").value);
  emergancy = !emergancy;
  if (emergancy == true) {
    fetch("/get?speed1=" + 0);
    document.getElementById("Run").value = "Stopp";
    document.getElementById("Run").style.backgroundColor = "red";
<<<<<<< HEAD
    document.getElementById("Train_Controll").style.backgroundColor = "#da3c3c";
=======
    document.getElementById("Train_Controll").style.backgroundColor =
      "#9d15156e";
>>>>>>> develop
  } else {
    fetch("/get?speed1=" + document.getElementById("speed1").value);
    document.getElementById("Run").value = "Ausführen";
    document.getElementById("Run").style.backgroundColor = "green";
    if (document.getElementById("speed1").value > 0) {
      document.getElementById("Train_Controll").style.backgroundColor =
<<<<<<< HEAD
        "lightgreen";
    } else {
      document.getElementById("Train_Controll").style.backgroundColor = "white";
    }
  }
}

=======
        "#00ff001f";
    } else {
      document.getElementById("Train_Controll").style.backgroundColor =
        "transparent";
    }
  }
}
//Direction
>>>>>>> develop
function changedirection(direction) {
  bderction = true;
  document.getElementById("speed1").value = 0;

  document.getElementById("reverse").style.filter =
<<<<<<< HEAD
    "invert(0%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)";
  document.getElementById("forward").style.filter =
    "invert(0%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)";
=======
    "invert(50%) sepia(10%) saturate(28%) hue-rotate(346deg) brightness(104%) contrast(97%)";
  document.getElementById("forward").style.filter =
    "invert(50%) sepia(10%) saturate(28%) hue-rotate(346deg) brightness(104%) contrast(97%)";
>>>>>>> develop

  if (direction == "reverse") {
    bderction = false;

    document.getElementById("reverse").style.filter =
<<<<<<< HEAD
      "invert(30%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)";
=======
      "invert(30%) sepia(60%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(600%)";
>>>>>>> develop
    fetch("/get?reverse=" + bderction);
  } else {
    bderction = true;
    document.getElementById("forward").style.filter =
<<<<<<< HEAD
      "invert(30%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)";
=======
      "invert(30%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(600%)";
>>>>>>> develop
    fetch("/get?forward=" + bderction);
  }

  fetch("/get?speed1=0");
}
<<<<<<< HEAD

=======
//Max Speed for Slider and Textfield
>>>>>>> develop
function getMaxSpeed() {
  console.log(document.getElementById("trainSelect").selectedIndex);
  document.getElementById("speed1").max =
    maxSpeed.Train[
      document.getElementById("trainSelect").selectedIndex
    ].max_speed;
<<<<<<< HEAD
=======

  document.getElementById("sliders").max =
    maxSpeed.Train[
      document.getElementById("trainSelect").selectedIndex
    ].max_speed;
>>>>>>> develop
}

function Menu(Origin) {
  let visibility = "hidden";
  let display = "none";
  run = !run;
  if (run == true && Origin != "div") {
    visibility = "visible";
    display = "grid";
  } else {
    visibility = "hidden";
    display = "none";
  }
  document.getElementById("MenuContent").style.visibility = visibility;
  document.getElementById("MenuContent").style.display = display;
}

//Train.HTML
function edit(index) {
<<<<<<< HEAD
  document.getElementById("edit").style.display = "block";
=======
  document.getElementById("edit").style.display = "flex";
>>>>>>> develop
  fetch("/get-trains")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("edit_id").value = data.Train[index].id;
      document.getElementById("edit_type").value = data.Train[index].type;
      document.getElementById("edit_speed").value = data.Train[index].max_speed;
    });
}

function save() {
  console.log(document.getElementById("edit_type").value);
<<<<<<< HEAD
  // console.log(fetch("/get_edit"));
=======
>>>>>>> develop
  document.getElementById("edit").style.display = "none";
  fetch("/edit_train");
}
function add() {
<<<<<<< HEAD
  document.getElementById("edit").style.display = "block";
=======
  document.getElementById("edit").style.display = "flex";
>>>>>>> develop
  let id = document.getElementById("Trainlist").rows.length;
  document.getElementById("add").checked = "checked";
  document.getElementById("edit_id").value = id;
  console.log(document.getElementById("add").checked);
}
function off() {
  document.getElementById("edit").style.display = "none";
}

function populateTrainList() {
  var tab;
  let Trains;
  let index = 0;
  fetch("/get-trains")
    .then((res) => res.json())
    .then((data) => {
      Trains = data;
      tab = document.getElementById("Trainlist");

      Trains.Train.forEach((train) => {
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" +
          train.id +
          "</td>" +
          "<td>" +
          train.type +
          "</td>" +
          "<td>" +
          train.max_speed +
          "</td>" +
          "<td id='Function'>" +
<<<<<<< HEAD
          '<button type="button" id="edit' +
=======
          '<button type="button" class="edit_button" id="edit' +
>>>>>>> develop
          Trains.Train[index].id +
          '" onclick="edit(' +
          index +
          ')">Edit</button>' +
          "</td>";
        console.log("table:", tab, "tr", tr);
        index++;
        tab.appendChild(tr);
      });
    });
}
