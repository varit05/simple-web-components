const buttonTemplate = document.createElement("template");
buttonTemplate.innerHTML = `
  <style>
  button {
      all: unset;
      background: green;
      color: white;
      padding: 5px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
  }
  </style>
  <button>
    <slot />
  </button>
`;

class RealDigitalButton extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));
    this.buttonEle = this.shadowRoot.querySelector("button");
    this.buttonEle.type = this.type || "submit";
  }

  connectedCallback() {
    this.buttonEle.addEventListener("click", this.handleClick.bind(this));
  }

  get type() {
    return this.getAttribute("type");
  }

  set type(newValue) {
    this.setAttribute("type", newValue);
  }

  handleClick(event) {
    // if button type is submit then submit the form
    if (this.buttonEle.type === "submit") {
      this.parentElement.formEle.submit(event);
    } else {
      // do something for the other type of event e.g button/reset
    }
  }

  disconnectedCallback() {
    this.buttonEle.removeEventListener("click");
  }
}

window.customElements.define("real-digital-button", RealDigitalButton);
