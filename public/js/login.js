/* eslint-disable */
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 500);
};


const updateSettings = async (data, type) => {
  try {
      const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe';

      const res = await axios({
          method: 'PATCH',
          url,
          data,
      });

      if (res.data.status === 'success') {
          showAlert('success', 'Data updated successfully!');
      }
  } catch (err) {
      showAlert('error', err.response.data.message);
  }
}


if (document.querySelector('.form-user-data')) {
  document.querySelector('.form-user-data').addEventListener('submit', e => {
      e.preventDefault();
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);
      updateSettings(form, 'data');
  });
}

if (document.querySelector('.form-user-password')) {
  document.querySelector('.form-user-password').addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('btn--save-password').textContent = 'Updating...';
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      
      await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.querySelector('btn--save-password').textContent = 'Save Password';
      document.getElementById('password-confirm').value = '';
  });
}


if (document.querySelector('.nav__el--logout')) {
  document.querySelector('.nav__el--logout').addEventListener('click', async (e) => {
    //e.preventDefault();
    //alert('clicked');
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/users/logout',
      });
      if (res.data.status === 'success') location.reload(true);
    } catch (err) {
      showAlert('error', 'Error logging out!');
    }
  });
} 


const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      //url: 'http://127.0.0.1:3000/api/v1/users/login',
      url: '/api/v1/users/login',
      data: {
        email: email,
        password: password,
      }
    });

    if (res.data.status === 'success') {
        showAlert('success', 'Logged in successfuly!');
        window.setTimeout(() => {
            location.assign('/');
        }, 1500);
    }
   // console.log(res);
  } catch (err) {
      showAlert('error', err.response.data.message);
      //console.log(err.response.data.message);
  }
};

if (document.querySelector('.form--login')) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    //console.log(email);
    //console.log(password);
    login(email, password);
  });
   
}


