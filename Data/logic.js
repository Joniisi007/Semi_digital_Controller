let emergancy = false;
let run = false;

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
  if (value > 0) {
    document.getElementById("Train_Controll").style.backgroundColor =
      "lightgreen";
  } else {
    document.getElementById("Train_Controll").style.backgroundColor = "white";
  }
}

function Stop() {
  console.log(fetch("/get?Run=0"));
  console.log(document.getElementById("speed1").value);
  emergancy = !emergancy;
  if (emergancy == true) {
    fetch("/get?speed1=" + 0);
    document.getElementById("Run").value = "Stopp";
    document.getElementById("Run").style.backgroundColor = "red";
    document.getElementById("Train_Controll").style.backgroundColor = "#da3c3c";
  } else {
    fetch("/get?speed1=" + document.getElementById("speed1").value);
    document.getElementById("Run").value = "Run";
    document.getElementById("Run").style.backgroundColor = "green";
    if (document.getElementById("speed1").value > 0) {
      document.getElementById("Train_Controll").style.backgroundColor =
        "lightgreen";
    } else {
      document.getElementById("Train_Controll").style.backgroundColor = "white";
    }
  }
}

function getMaxSpeed() {
  console.log(document.getElementById("trainSelect").selectedIndex);
  document.getElementById("speed1").max =
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

function edit(index) {
  document.getElementById("edit").style.display = "block";
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
  // console.log(fetch("/get_edit"));
  document.getElementById("edit").style.display = "none";
  fetch("/edit_train")
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
