import './index.css';

import Popup from './js/components/Popup';
import MainApi from './js/api/MainApi';

let reg = document.querySelector('.popup__registration');

let auth = document.querySelector('.popup__login');

const api = new MainApi({
  url: 'https://api.explorer-news.tk',
  headers: {
    "Content-Type": "application/json",
  }
})


const popupReg = new Popup(reg, document.querySelector('.popup'));
const popupAuth = new Popup(auth, document.querySelector('.popup'));

const regForm = document.forms.reg;


const registration = () => {
  document.querySelector('.popup__reg-button').classList.add('popup__link_hidden')
  document.querySelector('.popup__auth-button').classList.remove('popup__link_hidden')
  popupReg.open();
  popupAuth.clearContent()
  popupReg.setContent()
}
document.querySelector('.header__auth').addEventListener('click', registration);
document.querySelector('.popup__reg-button').addEventListener('click', registration)

let btn = document.querySelector('.popup__auth-button');

  btn.addEventListener('click', (e) => {
    document.querySelector('.popup__auth-button').classList.add('popup__link_hidden')
    document.querySelector('.popup__reg-button').classList.remove('popup__link_hidden')
    popupReg.clearContent()
    popupAuth.setContent()
  })

  popupReg.form.addEventListener('submit', function (event) {
   event.preventDefault();
   return fetch('https://api.explorer-news.tk/signup', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: popupReg.form.elements.name.value,
      email: popupReg.form.elements.email.value,
      password: popupReg.form.elements.password.value,
    })
  })
  .then(res => {
    if(res.ok) {
      return res.json();
    }
    return Promise.reject(res);
  })
  .catch(err => {
    console.log(err)
  })
  })

  





