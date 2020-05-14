import NewsCard from './NewsCard';

const notFoundBlock = document.querySelector('.not-found');
const articlesBlock = document.querySelector('.articles')

export default class NewsCardList {
  constructor(array, container) {
    this.array = array;
    this.container = container;
  }

  render() {
    if(this.array.length === 0) {
      notFoundBlock.classList.remove('not-found_hidden');
      articlesBlock.classList.add('articles_hidden');
    } else {
      notFoundBlock.classList.add('not-found_hidden');
      articlesBlock.classList.remove('articles_hidden');
    }  
  }

  renderResults() {
    const article = new NewsCard();
    
    this.render();
    const firstArticles = this.array.splice(0, 3);
        firstArticles.forEach(content => {
          this.container.insertAdjacentHTML('beforeend', article.create(content));
        });
  }

  renderSavedResults() {
    const article = new NewsCard();
    // this.render();
    // this.clear();
    this.array.forEach(card => {
      this.container.insertAdjacentHTML('beforeend', article.createSave(card));
      
    })
  }

  clear() {
    this.container.innerHTML = ''
  }
}