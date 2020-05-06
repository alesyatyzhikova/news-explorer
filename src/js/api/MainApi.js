import Popup from '../components/Popup';

const popupReg = new Popup(document.querySelector('.popup__registration'), document.querySelector('.popup'));

export default class MainApi {
  constructor(options) {
    this.url = options.url;
    this.header = options.header;
  }

  editProfile(path) {
    return fetch(`${this.url}${path}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
            name: popupReg.form.elements.name.value,
            about: popupReg.form.elements.email.value
        })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject(`Ошибка: ${res}`);
        })
        .catch(err => {
            console.log(`Ошибка: ${err}`)
        })
}

  regAccount(path) {
    return fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: this.headers,
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
  }
}