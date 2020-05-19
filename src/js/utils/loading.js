export default function renderLoading(isLoading) {
  const preloader = document.querySelector('.preloader');
  const notFoundBlock = document.querySelector('.not-found_not-found-error');
  const articlesBlock = document.querySelector('.articles');

  if(isLoading) {
    preloader.classList.remove('preloader_hidden');
    articlesBlock.classList.add('articles_hidden');
    notFoundBlock.classList.add('not-found_hidden');
  } else {
    preloader.classList.add('preloader_hidden');
  }
}