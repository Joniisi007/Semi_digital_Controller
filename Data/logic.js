let emergancy = false;
let run = false;
let maxSpeed;
let currentspeed = [
  [0, 0.0, false],
  [0, 0.0, false],
];

let slider = document.getElementById("sliders");

window.addEventListener("resize", () => {
  if (window.innerWidth > 950) {
    document.getElementById("menu").style.visibility = "visible";
    document.getElementById("menu").style.display = "grid";
  } else if (window.innerWidth <= 950) {
    document.getElementById("menu").style.visibility = "hidden";
    document.getElementById("menu").style.display = "none";
  }
});

function add_controlls() {
  let content = document.getElementById("content");
  content.appendChild(document.createElement("r-controlls"));
  document.getElementById("overlay_add").style.display = "none";
}
function overlay(display) {
  document.getElementById("overlay_add").style.display = display;
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
  document.getElementById("menu").style.visibility = visibility;
  document.getElementById("menu").style.display = display;
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
