let emergancy = false;

let maxSpeed;

console.log(fetch("/get-trains"));

maxSpeed = fetch("/get-trains").then((res) => res.json());

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
  fetch("/get?speed1=" + value);
}

function Stop() {
  console.log(fetch("/get?Run=0"));
  console.log(document.getElementById("speed1").value);
  emergancy = !emergancy;
  if (emergancy == true) {
    fetch("/get?speed1=" + 0);
    document.getElementById("Run").value = "Stopp";
  } else {
    fetch("/get?speed1=" + document.getElementById("speed1").value);
    document.getElementById("Run").value = "Run";
  }
}

function getMaxSpeed() {
  console.log(document.getElementById("trainSelect").selectedIndex);
  document.getElementById("speed1").max =
    maxSpeed.Train[
      document.getElementById("trainSelect").selectedIndex
    ].max_speed;
}

function Menu() {
  document.getElementById("MenuContent").hidden =
    !document.getElementById("MenuContent").hidden;
}

function edit() {
  document.getElementById("edit").style.display = "block";
}
function save() {
  // fetch("get-edit");
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
          "<td>" +
          '<button type="button" id="edit' +
          Trains.Train[index].id +
          '" onclick="edit()">Edit</button>' +
          "</td>";
        console.log("table:", tab, "tr", tr);
        index++;
        tab.appendChild(tr);
      });
    });
}
