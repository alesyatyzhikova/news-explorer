import './index.css';

import sortArray from '../js/utils/sort';
import { savePageMenu } from '../js/utils/openMenu';

import MainApi from '../js/api/MainApi';
import NewsCard from '../js/components/NewsCard';
import NewsCardList from '../js/components/NewsCardList';

const api = new MainApi({
  url: 'https://api.explorer-news.tk',
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
    // Сортируем массив, если его длина больше одного
    if (res.data.length > 1) {
      let finalArray = sortArray(res.data);

      // Описываем ключевые слова в зависимости от их количества
      if (finalArray.length === 2) {
        keywords.textContent = `${finalArray[0].keyword}, ${finalArray[1].keyword}`;
      } else if (finalArray.length === 3) {
        keywords.textContent = `${finalArray[0].keyword}, ${finalArray[1].keyword} и ${finalArray[2].keyword}`;
      } else {
        keywords.textContent = `${finalArray[0].keyword}, ${finalArray[1].keyword}`
        otherKeyword.textContent = ` и ${finalArray.length - 2} другим`
      } 

    } else {
      keywords.textContent = res.data[0].keyword;
    }
    
    // Рендерим карточки на страницу
    const array = new NewsCardList(res.data, wrapper);
    array.renderSavedResults();
    articleNumber.textContent = res.data.length;
  })
  .then(() => {
    wrapper.addEventListener('click', (event) => {
      // Удаление карточки
      if(event.target.classList.contains('article__tag_delete')) {
        event.preventDefault();
        const article = new NewsCard();
        article.remove(event)
        api.removeArticle(`/articles/${event.target.closest('.article').id}`, event)      
      }
    })
  })
  .catch(()=> {
    notFoundArticles.classList.remove('not-found_hidden');
    saveBlock.classList.add('save_hidden');
  })









  
  
  
 