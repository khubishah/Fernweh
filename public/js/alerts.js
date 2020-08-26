/* eslint-disable */


const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
  };
  
  const showAlert = (type, msg, time = 8) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, time * 1000);
  };

  const alertMessage = docuent.querySelector('body').dataset.alert;
  if (alertMessage) showAlert('success', alertMessage, 20);