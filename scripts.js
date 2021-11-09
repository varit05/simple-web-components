function handleSubmit(event) {
  console.log("event", event);

  const formData = event.formData;

  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
}

document.addEventListener(
  "onSubmit",
  (event) => handleSubmit(event.detail),
  false
);
