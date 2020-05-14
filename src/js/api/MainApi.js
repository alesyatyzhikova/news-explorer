export default class MainApi {
  constructor(options) {
    this.url = options.url;
  }

  registration(path, name, email, password) {
    return fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      })
    })
  }

  login(path, email, password) {
    return fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      })
    })
  }

  getUserData(path) {
    return fetch(`${this.url}${path}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      credentials: 'include',
    })
    .then(res => res.json())
  }

  createArticle(path, event) {
    return fetch(`${this.url}${path}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        keyword: document.forms.search.elements.search.value,
        title: event.target.closest('.article').querySelector('.article__title').innerHTML,
        text: event.target.closest('.article').querySelector('.article__text').innerHTML,
        date: event.target.closest('.article').querySelector('.article__date').innerHTML,
        source: event.target.closest('.article').querySelector('.article__source').innerHTML,
        link: event.target.closest('.article').href,
        image: event.target.closest('.article').querySelector('.article__image').src,
      })
    })
      .then(res => res.json())
      .catch((err) => {
        console.log('Ошибка', err.status)
      })
  }

  getInitialCards(path) {
    return fetch(`${this.url}${path}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => res.json())
  }

  removeArticle(path, event) {
    return fetch(`${this.url}${path}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => res.text())
    .catch(err => {
        console.log(`Ошибка: ${err.status}`)
    })
  }
}