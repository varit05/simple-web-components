# Simple Web component

This project includes:

- `real-digital-form`: custom form component.
  - Takes `action` and `method` as input.
  - `onSubmit` event, it validates the input and stop execution if any one of the input is invalid
  - if all inputs are valid, it sends data to the given endpoint and method with form of `application/x-www-form-urlencoded`
  - Also emits an event before sending data to the endpoint. 

- `real-digital-textfield`: Handles Text field with the custom type
  - Takes `name`,`validation` and `type` as input.
  - By default type is `text`.
  - By default, Input is required to fill details.
  - provided invalid input, error message is shown.

- `real-digital-button`: Button wrapper componenet for form
  - Takes `text` as button slot.
  - By default type is `submit`.
  - On click, if button type is submit, it triggers `formSubmit` event.

## Development server

Right Click on `index.html` and open it with Live server or browser directly.

