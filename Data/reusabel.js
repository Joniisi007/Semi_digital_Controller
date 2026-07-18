// to do build a reusable component for the controlls

class controlls extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
    
    <div id="Train_Controll">  
    <link rel="stylesheet" href="style.css" />
        <b>Fahrregler Gleis 1</b>
        <form action="get-trains">
          <select onchange="this.getRootNode().host.get_max_speed()" name="trainSelect" id="trainSelect">
            <option>Lade...</option>
          </select>
        </form>
        <form action="get" id="get">
        <select name="pins" id="pins" onchange="change_pins()">
          <option>22,21</option>
          <option>13,14</option>
        </select>
        <input id="sliders" class="thick_slider" type="range" min="0" max="213" value="0" step=".01"></input>
        <div id="controlls">
          <input name="speed1" id="speed1" onchange="fetchvalue(this.value)" type="number" step=".01" min="0" max="213" value="0"></input>
          <div id="direction">
            <button type="button" name="reverse" id="reverse" onclick="this.getRootNode().host.changedirection('reverse')">
              <img id="reverse_icon" src="reverse_icon.svg" height="20px" width="20px">
            </button>
            <button type="button" name="forward" id="forward" onclick="this.getRootNode().host.changedirection('forward')" >
              <img id="forward_icon" src="forward_icon.svg" height="20px" width="20px">
            </button>
          <div id="direction"></div>
        </div>
        <input type="button" id="Run" value="Ausführen" name="Run" onclick="Stop()"></input>
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
          const sel = document.getElementById("trainSelect");
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
  get_max_speed() {
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
  changedirection(direction) {
    let bderction = true;

    // let pins = document.getElementById("pins").value; // not needed now
    // fetch("/get?pins=" + pins);

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
}

customElements.define("r-controlls", controlls);
