const textFieldTemplate = document.createElement("template");
textFieldTemplate.innerHTML = `
  <style>
    input {
        all: unset;
        border: 1px solid green;
        color: black;
        padding: 5px 10px;
        border-radius: 5px;
        margin: 5px 0;
        text-align: left;
    }

    .invalid-field { 
      border: 1px solid red; 
    } 
    .invalid-field:focus { 
        outline-color: red; 
    }
    .error-msg {
        color: red;
        font-size: 14px;
        margin: 5px 0;
    }
  </style>
  <div>
    <input type="text" required />
    <p class="error-msg"></p>
  <div>
`;

class RealDigitalTextfield extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(textFieldTemplate.content.cloneNode(true));
    
    this.isValid = true;
    this.initializeInput();
    this.shadowRoot.querySelector("p").style.display = "none";
  }

  /**
   * Once the component is connected to DOM, Below events are added
   */
  connectedCallback() {
    this.inputEle.addEventListener("keyup", (event) =>
      this.checkInputValidity(event)
    );
    this.inputEle.addEventListener("blur", (event) =>
      this.checkInputValidity(event)
    );
    this.inputEle.addEventListener(
      "checkInputValidity",
      (event) => this.checkInputValidity(event),
      false
    );
  }

  /**
   * Observing the custom attribute and updating as when changes are detected.
   */
  static get observedAttributes() {
    return ["value", "type", "validation"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "value":
        this.value = newValue;
        break;
      case "type":
        this.type = newValue;
        break;
      case "validation":
        this.validation = newValue;
        break;
      default:
        break;
    }
  }

  /**
   * Setting up Input with default and customize values
   */
  initializeInput() {
    this.inputEle = this.shadowRoot.querySelector("input");
    this.inputEle.name = this.name;
    this.inputEle.placeholder = this.name;
    if (this.validation) {
      this.inputEle.pattern = this.validation;
    }
    this.inputEle.type = this.type || "text";
  }

  checkInputValidity(event) {
    this.isValid = event.srcElement.checkValidity();
    const errorMessageEle = this.shadowRoot.querySelector("p");
    if (this.isValid) {
      errorMessageEle.style.display = "none";
      this.inputEle.classList.remove("invalid-field");
    } else {
      if (this.inputEle.validity.patternMismatch) {
        errorMessageEle.textContent = "Please enter valid value";
      }

      if (this.inputEle.validity.valueMissing) {
        errorMessageEle.textContent = "This is required Field";
      }
      errorMessageEle.style.display = "block";
      this.inputEle.classList.add("invalid-field");
    }
  }

  get name() {
    return this.getAttribute("name");
  }

  get type() {
    return this.getAttribute("type");
  }

  get validation() {
    return this.getAttribute("validation");
  }

  set name(newValue) {
    this.setAttribute("name", newValue);
  }

  set type(newValue) {
    this.setAttribute("type", newValue);
  }

  set validation(newValue) {
    this.setAttribute("pattern", newValue);
  }

  /**
   * When component is leaving the  DOM, Below events are removed so it can not be listen
   */

  disconnectedCallback() {
    this.inputEle.removeEventListener("keyup");
    this.inputEle.removeEventListener("blur");
    this.inputEle.removeEventListener("checkInputValidity");
  }
}

window.customElements.define("real-digital-textfield", RealDigitalTextfield);
