const template = document.createElement("template");
template.innerHTML = `
  <style>
  </style>
  <form novalidate>
    <slot />
  </form>
`;

class RealDigitalForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.formEle = this.shadowRoot.querySelector("form");

    this.formEle.action = this.action;
    this.formEle.method = this.method;
    this.formEle.submit = this.submitForm.bind(this);
  }

  connectedCallback() {}

  /**
   * Observing the custom attribute and updating as when changes are detected.
   */
  static get observedAttributes() {
    return ["action", "method"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "action":
        this.formEle.action = newValue;
        break;
      case "method":
        this.formEle.method = newValue;
        break;
      default:
        break;
    }
  }

  get action() {
    return this.getAttribute("action");
  }

  get method() {
    return this.getAttribute("method");
  }

  set action(newValue) {
    this.setAttribute("action", newValue);
  }

  set method(newValue) {
    this.setAttribute("method", newValue);
  }

  /**
   * Clear Form once it is submits
   */
  clearForm() {
    const fields = this.querySelectorAll("real-digital-textfield");
    for (let element in fields) {
      const currentEl = fields[element].inputEle;
      if (currentEl?.value) {
        currentEl.value = "";
      }
    }
  }

  formSubmission(message, color = "green") {
    const submitStatusEle = document.createElement("p");
    submitStatusEle.textContent = message;
    submitStatusEle.style.color = color;
    this.formEle.appendChild(submitStatusEle);

    this.clearForm();
  }

  async submitForm(event) {
    event.preventDefault();
    const formData = new FormData();
    const inputData = new URLSearchParams();

    const fields = this.querySelectorAll("real-digital-textfield");

    for (let element in fields) {
      const currentEl = fields[element].inputEle;
      // check if the element is valid or not and return execution if any element is invalid
      if (currentEl && !currentEl.checkValidity()) {
        // Dispatch event if the field is not valid and stop form submission
        currentEl.dispatchEvent(new Event("checkInputValidity"));
        return;
      }
      if (currentEl?.value) {
        formData.append(currentEl.name, currentEl.value);
        inputData.append([currentEl.name], currentEl.value);
      }
    }

    this.formEle.FormData = formData;

    // TODO: It goes to all the elements. It should only pass to the closest parent
    const sendSubmitEvent = new CustomEvent("onSubmit", {
      detail: {
        formData,
      },
    });
    document.dispatchEvent(sendSubmitEvent);

    try {
      const response = await fetch(this.action, {
        method: this.method,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          body: inputData,
        },
      });

      const result = await response.json();

      console.log("data", result);
      this.formSubmission("Data sent successfully!", "green");
    } catch (error) {
      console.log("error while sending data", error);
      this.formSubmission("Error while sending data!", "red");
    }
  }

  disconnectedCallback() {}
}

window.customElements.define("real-digital-form", RealDigitalForm);
