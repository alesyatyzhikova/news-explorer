import './index.css';

import sortArray from '../js/utils/sort';
import { savePageMenu } from '../js/utils/openMenu';

import MainApi from '../js/api/MainApi';
import NewsCard from '../js/components/NewsCard';
import NewsCardList from '../js/components/NewsCardList';

const api = new MainApi({
  url: 'https://api-praktikum.ru',
})

const wrapper = document.querySelector('.articles__wrapper_saved');
const keywords = document.querySelector('.save__text span');
const otherKeyword = document.querySelector('.save__text .other');
const articleNumber = document.querySelector('.save__subtitle .number');
const notFoundArticles = document.querySelector('.not-found');
const saveBlock = document.querySelector('.save');
const menuButton = document.querySelector('.header__menu-button');
const logoutButton = document.querySelector('.header__logout');
 
logoutButton.textContent = localStorage.getItem("name")
document.querySelector('.user-name').textContent = localStorage.getItem("name")

logoutButton.addEventListener('click', () => {
  localStorage.clear();
  location.href = '../';
}); 

if(!localStorage.getItem('name') && !localStorage.getItem('token')) {
  location.href = '../';
};

// Открытие меню
savePageMenu(menuButton);

api.getInitialCards('/articles')
  .then(res => {
    if(res.ok) {
      return res.json()
    }
    return Promise.reject(res)
  })
  .then(res => {
    const array = new NewsCardList(res.data, wrapper);
    array.renderSavedResults();
    articleNumber.textContent = res.data.length;

    // Сортируем массив ключевых слов
    const finalArray = sortArray(res.data);

    // Описываем ключевые слова в зависимости от их количества
    if (finalArray.length === 1) {
      keywords.textContent = finalArray[0].keyword
    } else if (finalArray.length === 2) {
      keywords.textContent = `${finalArray[0].keyword}, ${finalArray[1].keyword}`;
    } else if (finalArray.length === 3) {
      console.log(finalArray)
      keywords.textContent = `${finalArray[0].keyword}, ${finalArray[1].keyword} и ${finalArray[2].keyword}`;
    } else {
      keywords.textContent = `${finalArray[0].keyword}, ${finalArray[1].keyword}`
      otherKeyword.textContent = ` и ${finalArray.length - 2} другим`
    } 
  })
  .then(() => {
    wrapper.addEventListener('click', (event) => {
      // Удаление карточки
      if(event.target.classList.contains('article__tag_delete')) {
        event.preventDefault();
        const article = new NewsCard();
        article.remove(event)
        api.removeArticle(`/articles/${event.target.closest('.article').id}`, event)  
        .then(res => {
          if(res.ok) {
            return res.text()
          }
          return Promise.reject(res)
        })
        .then(() => console.log('Карточка удалена')) 
        .catch((err) => console.log(err)) 
      }
    })
  })
  .catch(()=> {
    notFoundArticles.classList.remove('not-found_hidden');
    saveBlock.classList.add('save_hidden');
  })









  
  
  
 