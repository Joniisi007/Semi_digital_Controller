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
      <style>
        color: white;
      </style>
      <div id="controlls">
        <p>Controlls</p>
      </div>
      `;
  }
}

customElements.define("controlls-component", controlls);
