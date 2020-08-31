import './index.css';

import renderLoading from './js/utils/loading';
import clickArticle from './js/utils/removeAndCreate';
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
const menuButton = document.querySelector('.header__menu-button');
const moreButton = document.querySelector('.articles__more-button');
let moreButtonListener;


const wrapper = document.querySelector('.articles__wrapper');
const articlesWrapper = document.querySelector('.articles__wrapper');
const serverErrorBlock = document.querySelector('.not-found_server-error');


// API
const api = new MainApi({
  url: 'https://api-praktikum.ru',
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
   registrationFormClass.lockInputs(event.currentTarget);
   registrationFormClass.lockButton(event.currentTarget);
  
   api.registration('/signup', 
                    popupReg.form.elements.name.value, 
                    popupReg.form.elements.email.value,
                    popupReg.form.elements.password.value)
    .then(res => {
      if(res.ok) {
       return res.json()
      } else if (res.status === 409) {
        return Promise.reject('Такой email уже существует')
      } else {
        return Promise.reject('Сервер не отвечает')
      }  
    })
    .then(() => {
      popupReg.clearContent()
      popupSuccess.setContent()
      regButton.classList.add('popup__link_hidden')
      authButton.classList.remove('popup__link_hidden')
    })
    .catch(err => commonRegError.textContent = err)
    .finally(() => {
      registrationFormClass.unlockButton(event.target);
      registrationFormClass.unlockInputs(event.target);
    })
  })

  // Аутентификация
  popupAuth.form.addEventListener('submit', function (event) {
    event.preventDefault();
    loginFormClass.lockButton(event.currentTarget);
    loginFormClass.lockInputs(event.currentTarget);
    api.auth('/signin', popupAuth.form.elements.email.value, popupAuth.form.elements.password.value)
    .then(res => {
      if(res.ok) {
       return res.json()
      } else if (res.status === 400) {
        return Promise.reject('Неправильные почта или пароль')
      } else {
        return Promise.reject('Сервер не отвечает')
      }  
    })
    .then(res => {
      localStorage.setItem("token", res.token)
      localStorage.setItem("header", header.isLoggedIn)
      header.render();
      popupReg.clearContent();
      popupAuth.close();
    })
    .then(() => {
      article.renderIconAuth();
      api.getUserData('/users/me')
      .then(res => {
        if(res.ok) {
          return res.json()
        }
        return Promise.reject(res)
      })
      .then((res) => {
        localStorage.setItem("name", res.name)
        headerLogoutButton.textContent = res.name
        location.reload();
      })
      .catch((err) => {
        console.log('Ошибка', err.status)
      })
     })
    .catch(err => commonAuthError.textContent = err) 
    .finally(() => {
      loginFormClass.unlockButton(event.target);
      loginFormClass.unlockInputs(event.target)
    })
   })
 
// Поиск
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  searchFormClass.lockButton(e.currentTarget);
  searchFormClass.lockInputs(e.currentTarget);
  renderLoading(true);

  articlesWrapper.removeEventListener('click', clickArticle); 

  const dateFrom = new Date().toISOString().substr(0, 10);
  const dateTo = getDateForApi(7);
  const pageSize = 100;
  const newsApi = new NewsApi({ q: searchForm.elements.search.value, from: dateFrom, to: dateTo, pageSize: pageSize });

  newsApi.getNews()
    .then(res => {
      if(res.ok) {
        return res.json()
      }
      return Promise.reject(res)
    })
    .then(res => {
     
      const array = new NewsCardList(res.articles, wrapper, 3);
      array.clear();
      array.renderResults();

      if(logged) {
        article.renderIconAuth();  
      }
       
      moreButton.removeEventListener('click', moreButtonListener);
      moreButtonListener = array.renderResults.bind(array);
      moreButton.addEventListener('click', moreButtonListener); 
    
    })
    .then(() => {
      articlesWrapper.addEventListener('click', clickArticle); 
    })
    .catch(() => {
      serverErrorBlock.classList.remove('not-found_hidden');
    })
    .finally(() => {
      renderLoading(false);
      searchFormClass.unlockButton(e.target);
      searchFormClass.unlockInputs(e.target); 
    }) 
})

// Закрытие попапа
document.querySelector('.popup__close').addEventListener('click', (e) => {
  popup.classList.remove('popup_opened');
})

document.addEventListener('mousedown', (e) => {
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






  





