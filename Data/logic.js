let emergancy = false;
let run = false;
//test
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
      "#00ff001f";
  } else {
    document.getElementById("Train_Controll").style.backgroundColor =
      "transparent";
  }
}
//Slider Value to Textfield and fetch
function setSliderValue(speed) {
  console.log(speed);
  document.getElementById("speed1").value = speed;
  fetchvalue(speed);
}
//Emengancy Stop
function Stop() {
  console.log(fetch("/get?Run=0"));
  console.log(document.getElementById("speed1").value);
  emergancy = !emergancy;
  if (emergancy == true) {
    fetch("/get?speed1=" + 0);
    document.getElementById("Run").value = "Stopp";
    document.getElementById("Run").style.backgroundColor = "red";
    document.getElementById("Train_Controll").style.backgroundColor =
      "#9d15156e";
  } else {
    fetch("/get?speed1=" + document.getElementById("speed1").value);
    document.getElementById("Run").value = "Ausführen";
    document.getElementById("Run").style.backgroundColor = "green";
    if (document.getElementById("speed1").value > 0) {
      document.getElementById("Train_Controll").style.backgroundColor =
        "#00ff001f";
    } else {
      document.getElementById("Train_Controll").style.backgroundColor =
        "transparent";
    }
  }
}
//Direction
function changedirection(direction) {
  bderction = true;
  document.getElementById("speed1").value = 0;

  document.getElementById("reverse").style.filter =
    "invert(50%) sepia(10%) saturate(28%) hue-rotate(346deg) brightness(104%) contrast(97%)";
  document.getElementById("forward").style.filter =
    "invert(50%) sepia(10%) saturate(28%) hue-rotate(346deg) brightness(104%) contrast(97%)";

  if (direction == "reverse") {
    bderction = false;

    document.getElementById("reverse").style.filter =
      "invert(30%) sepia(60%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(600%)";
    fetch("/get?reverse=" + bderction);
  } else {
    bderction = true;
    document.getElementById("forward").style.filter =
      "invert(30%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(600%)";
    fetch("/get?forward=" + bderction);
  }

  fetch("/get?speed1=0");
}
//Max Speed for Slider and Textfield
function getMaxSpeed() {
  console.log(document.getElementById("trainSelect").selectedIndex);
  document.getElementById("speed1").max =
    maxSpeed.Train[
      document.getElementById("trainSelect").selectedIndex
    ].max_speed;

  document.getElementById("sliders").max =
    maxSpeed.Train[
      document.getElementById("trainSelect").selectedIndex
    ].max_speed;
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
  document.getElementById("edit").style.display = "flex";
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
  document.getElementById("edit").style.display = "none";
  fetch("/edit_train");
}
function add() {
  document.getElementById("edit").style.display = "flex";
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
          '<button type="button" class="edit_button" id="edit' +
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
