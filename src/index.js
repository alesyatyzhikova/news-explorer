import './index.css';

import renderLoading from './js/utils/loading';
import { getDateForApi } from './js/utils/date';
import { mainMenu } from './js/utils/openMenu';

import Popup from './js/components/Popup';
import MainApi from './js/api/MainApi';
import NewsApi from './js/api/NewsApi';
import Header from './js/components/Header';
import NewsCard from './js/components/NewsCard';
import NewsCardList from './js/components/NewsCardList';
import Form from './js/components/Form';

// Попапы
const popup = document.querySelector('.popup');
const reg = document.querySelector('.popup__registration');
const auth = document.querySelector('.popup__login');
const success = document.querySelector('.popup__success');

const popupReg = new Popup(reg, popup);
const popupAuth = new Popup(auth, popup);
const popupSuccess = new Popup(success, popup);

// Формы
const searchForm = document.forms.search;
const loginForm = document.forms.login;
const registrationForm = document.forms.reg;

const loginFormClass = new Form(loginForm);
const registrationFormClass = new Form(registrationForm);
const searchFormClass = new Form(searchForm);


const commonRegError = document.querySelector('.popup__error_common_reg');
const commonAuthError = document.querySelector('.popup__error_common_login');

// Кнопки
const regButton = document.querySelector('.popup__reg-button');
const authButton = document.querySelector('.popup__auth-button');
const regSuccessButton = document.querySelector('.popup__reg-success-button');
const headerAuthButton = document.querySelector('.header__auth');
const headerLogoutButton = document.querySelector('.header__logout');
const moreButton = document.querySelector('.articles__more-button');
const menuButton = document.querySelector('.header__menu-button');


const wrapper = document.querySelector('.articles__wrapper');
const articlesWrapper = document.querySelector('.articles__wrapper');
const serverErrorBlock = document.querySelector('.not-found_server-error');


// API
const api = new MainApi({
  url: 'https://api.explorer-news.tk',
})

const header = new Header({ isLoggedIn: true, userName: document.forms.login.elements.name })
const article = new NewsCard();

// Проверяем авторизацию
const logged = localStorage.getItem("header");
const token = localStorage.getItem('token');
const name = localStorage.getItem("name");

if (logged && token) {
  header.render();
  headerLogoutButton.textContent = name 
}; 

mainMenu(menuButton);

// События для попапов //
const registration = () => {
  regButton.classList.add('popup__link_hidden')
  authButton.classList.remove('popup__link_hidden')
  popupAuth.clearContent()
  popupReg.setContent()
};

const login = (e) => {
  if(e.target.classList.contains('success__link')) {
    regButton.classList.add('popup__link_hidden')
    regSuccessButton.classList.add('popup__link_hidden')
  }
  authButton.classList.add('popup__link_hidden')
  regButton.classList.remove('popup__link_hidden')
  popupAuth.open();
  popupSuccess.clearContent();
  popupReg.clearContent();
  popupAuth.setContent()
};

headerAuthButton.addEventListener('click', login);
authButton.addEventListener('click', login);
regButton.addEventListener('click', registration);

// Конец - события для попапов //


// Отправка форм //
//Регистрация
  popupReg.form.addEventListener('submit', function (event) {
   event.preventDefault();
   registrationFormClass.lockButton(event.currentTarget); 
   api.registration('/signup', 
                    popupReg.form.elements.name.value, 
                    popupReg.form.elements.email.value,
                    popupReg.form.elements.password.value)
    .then(res => {
      if(res.ok) {
        return res.text();
      }
      commonRegError.textContent = 'Такой Email уже существует';
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .then(() => {
      popupReg.clearContent()
      popupSuccess.setContent()
      regButton.classList.add('popup__link_hidden')
      authButton.classList.remove('popup__link_hidden')
    })
    .catch(err => console.log(err))
    registrationFormClass.lockButton(event.currentTarget); 
  })

  // Аутентификация
  popupAuth.form.addEventListener('submit', function (event) {
    event.preventDefault();
    api.login('/signin', popupAuth.form.elements.email.value, popupAuth.form.elements.password.value)
    .then(res => {
      if(res.ok) {
        return res.text();
      }
      commonAuthError.textContent = 'Неправильные почта или пароль';
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .then(res => {
      localStorage.setItem("token", res)
      localStorage.setItem("header", header.isLoggedIn)
      header.render();
      popupReg.clearContent();
      popupAuth.close();
    })
    .then(() => {
      article.renderIconAuth();
      api.getUserData('/users/me')
      .then((res) => {
        localStorage.setItem("name", res.name)
        headerLogoutButton.textContent = res.name
        location.reload();
      })
      .catch((err) => {
        console.log('Ошибка', err.status)
      })
     })
    .catch(err => console.log(err)) 
   })

// Поиск
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  renderLoading(true);

  const dateFrom = new Date().toISOString().substr(0, 10);
  const dateTo = getDateForApi(7);
  const pageSize = 100;
  const newsApi = new NewsApi({ q: searchForm.elements.search.value, from: dateFrom, to: dateTo, pageSize: pageSize })

  newsApi.getNews()
    .then(res => res.json())
    .then(res => {
      const array = new NewsCardList(res.articles, wrapper);
      array.clear();
      array.renderResults();
      

      if(logged) {
        article.renderIconAuth();  
      }

      moreButton.addEventListener('click', (e) => {
        array.renderResults();

        if(logged) {
          article.renderIconAuth()   
        }

        if(res.articles.length === 0) { 
          e.target.classList.add('articles__more-button_hidden')
        }
      })     
    })
    .then(() => {
      articlesWrapper.addEventListener('click', (event) => {
        if(event.target.classList.contains('article__tag_save-not-auth')) {
          event.preventDefault();
          }

        if(event.target.classList.contains('article__tag_saved')) {
          event.preventDefault();

          article.renderIconForDelete(event)
           api.removeArticle(`/articles/${event.target.closest('.article').id}`, event)
           .then(() =>   event.target.classList.add('article__tag_for-save'))
          }

        if(event.target.classList.contains('article__tag_for-save')) {
          event.preventDefault();

          api.createArticle('/articles', event)
          .then((res) => {
            const createdArticle = event.target.closest('.article');
            createdArticle.id = res.data.id;
          })

          article.renderIconForSave(event)
        } 
      }) 
    })
    .catch(() => {
      serverErrorBlock.classList.remove('not-found_hidden')
    })
    .finally(() => {
      renderLoading(false)
    })  
})

// Закрытие попапа
document.querySelector('.popup__close').addEventListener('click', (e) => {
  popup.classList.remove('popup_opened');
})

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('popup')) {
    popup.classList.remove('popup_opened');
  }
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    popup.classList.remove('popup_opened');
  }
})


// Разлогиниться
headerLogoutButton.addEventListener('click', () => {
  localStorage.clear();
  location.reload()
})   

// Валидация форм
loginForm.addEventListener('input', (e) => {
  loginFormClass.validateForm(e)
  loginFormClass.disableForm(e.currentTarget)
})

registrationForm.addEventListener('input', (e) => {
  registrationFormClass.validateForm(e)
  registrationFormClass.disableForm(e.currentTarget)
})

searchForm.addEventListener('input', (e) => {
  searchFormClass.validateForm(e)
  searchFormClass.disableForm(e.currentTarget)
})






  





