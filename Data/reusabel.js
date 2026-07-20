// to do build a reusable component for the controlls

class controlls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  trainValues = {
    pins: "",
    speed: 0.0,
    Train: 0,
  };

  render() {
    this.shadowRoot.innerHTML = `
    
    <div id="Train_Controll">  
    <link rel="stylesheet" href="style.css" />
      <div id="header_controlls">
        <b>Fahrregler Gleis 1</b>
         <button id="close_controlles" onclick="this.getRootNode().host.remove()">
          <img src="close_red.svg" height="25px" width="25px" />
          </button>
          </div>
        <select name="pins" id="pins" onchange="this.getRootNode().host.change_pins()">
          <option>22,21</option>
          <option>13,14</option>
        </select>
        <form action="get-trains">
          <select onchange="this.getRootNode().host.get_max_speed()" name="trainSelect" id="trainSelect">
            <option>Lade...</option>
          </select>
        </form>
        <form action="get" id="get">
        <input id="sliders" class="thick_slider" type="range" min="0" max="213" value="0" step=".01" oninput="this.getRootNode().host.setSliderValue(this.value)"></input>
        <div id="controlls">
          <input name="speed1" id="speed1" onchange="this.getRootNode().host.fetchvalue(this.value)" type="number" step=".01" min="0" max="213" value="0"></input>
          <div id="direction">
            <button type="button" name="reverse" id="reverse" onclick="this.getRootNode().host.changedirection('reverse')">
              <img id="reverse_icon" src="reverse_icon.svg" height="20px" width="20px">
            </button>
            <button type="button" name="forward" id="forward" onclick="this.getRootNode().host.changedirection('forward')" >
              <img id="forward_icon" src="forward_icon.svg" height="20px" width="20px">
            </button>
          <div id="direction"></div>
        </div>
        <input type="button" id="Run" value="Ausführen" name="Run" onclick="this.getRootNode().host.stop()"></input>
      </form>
      </div>
      `;
  }

  async connectedCallback() {
    this.render();
    try {
      fetch("/get-trains")
        .then((res) => res.json())
        .then((data) => {
          const sel = this.shadowRoot.querySelector("#trainSelect");
          sel.innerHTML = "";
          data.Train.forEach((train) => {
            let opt = document.createElement("option");
            opt.text = `${train.type} - ID: ${train.id}`;
            sel.add(opt);
          });
        });
    } catch (error) {
      console.error("Error fetching train data:", error);
    }
  }
  remove() {
    this.shadowRoot.querySelector("#Train_Controll").remove();
  }
  change_pins() {
    let pins = this.shadowRoot.querySelector("#pins").value;
    if (pins == "13,14") {
      currentspeed[0][0] = 13;
      currentspeed[0][1] = this.shadowRoot.querySelector("#speed1").value;
      if (currentspeed[0][1] != currentspeed[1][1]) {
        this.shadowRoot.querySelector("#speed1").value = currentspeed[1][1];
        this.shadowRoot.querySelector("#sliders").value = currentspeed[1][1];
        fetch("/get?pins=" + pins);
        fetch("/get?speed1=" + currentspeed[1][1]);
      }
    } else {
      currentspeed[1][0] = 22;
      currentspeed[1][1] = this.shadowRoot.querySelector("#speed1").value;
      if (currentspeed[1][1] != currentspeed[0][1]) {
        this.shadowRoot.querySelector("#speed1").value = currentspeed[0][1];
        this.shadowRoot.querySelector("#sliders").value = currentspeed[0][1];
        fetch("/get?pins=" + pins);
        fetch("/get?speed1=" + currentspeed[0][1]);
      }
    }
    console.log(currentspeed);
  }

  fetchvalue(value) {
    console.log(value);
    this.shadowRoot.querySelector("#reverse").value = value;
    let pins = this.shadowRoot.querySelector("#pins").value;
    this.trainValues.pins = pins;
    // fetch("/get?pins=" + pins);
    fetch("/get?speed1=" + value);
    if (value > 0) {
      this.shadowRoot.querySelector("#Train_Controll").style.backgroundColor =
        "#00ff001f";
    } else {
      this.shadowRoot.querySelector("#Train_Controll").style.backgroundColor =
        "transparent";
    }
  }

  setSliderValue(speed) {
    console.log(speed);
    this.shadowRoot.querySelector("#speed1").value = speed;
    this.fetchvalue(speed);
  }

  get_max_speed() {
    console.log(this.shadowRoot.querySelector("#trainSelect").selectedIndex);
    this.shadowRoot.querySelector("#speed1").max =
      maxSpeed.Train[
        this.shadowRoot.querySelector("#trainSelect").selectedIndex
      ].max_speed;

    this.shadowRoot.querySelector("#sliders").max =
      maxSpeed.Train[
        this.shadowRoot.querySelector("#trainSelect").selectedIndex
      ].max_speed;
  }
  changedirection(direction) {
    let bderction = true;

    let pins = this.shadowRoot.querySelector("#pins").value; // not needed now
    fetch("/get?pins=" + pins);

    this.shadowRoot.querySelector("#speed1").value = 0;

    this.shadowRoot.querySelector("#reverse").style.filter =
      "invert(50%) sepia(10%) saturate(28%) hue-rotate(346deg) brightness(104%) contrast(97%)";
    this.shadowRoot.querySelector("#forward").style.filter =
      "invert(50%) sepia(10%) saturate(28%) hue-rotate(346deg) brightness(104%) contrast(97%)";

    if (direction == "reverse") {
      bderction = false;

      this.shadowRoot.querySelector("#reverse").style.filter =
        "invert(30%) sepia(60%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(600%)";
      fetch("/get?reverse=" + bderction);
    } else {
      bderction = true;
      this.shadowRoot.querySelector("#forward").style.filter =
        "invert(30%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(600%)";
      fetch("/get?forward=" + bderction);
    }

    // if ((pins = "13,14")) {
    //   currentspeed[0][2] = bderction;
    // } else if ((pins = "22,21")) {
    //   currentspeed[1][2] = bderction;
    // }
    fetch("/get?direction=" + bderction);
    fetch("/get?speed1=0");
  }

  stop() {
    console.log(fetch("/get?Run=0"));
    console.log(this.shadowRoot.querySelector("#speed1").value);
    emergancy = !emergancy;
    if (emergancy == true) {
      fetch("/get?speed1=" + 0);
      this.shadowRoot.querySelector("#Run").value = "Stopp";
      this.shadowRoot.querySelector("#Run").style.backgroundColor = "red";
      this.shadowRoot.querySelector("#Train_Controll").style.backgroundColor =
        "#9d15156e";
    } else {
      fetch("/get?speed1=" + this.shadowRoot.querySelector("#speed1").value);
      this.shadowRoot.querySelector("#Run").value = "Ausführen";
      this.shadowRoot.querySelector("#Run").style.backgroundColor = "green";
      if (this.shadowRoot.querySelector("#speed1").value > 0) {
        this.shadowRoot.querySelector("#Train_Controll").style.backgroundColor =
          "#00ff001f";
      } else {
        this.shadowRoot.querySelector("#Train_Controll").style.backgroundColor =
          "transparent";
      }
    }
  }
}

customElements.define("r-controlls", controlls);
