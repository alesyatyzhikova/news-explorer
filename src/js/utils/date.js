
function getDateForApi(days) {
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() - days);

  return currentDate.toISOString().substr(0, 10);
}

function getDateForArticles(date) {
  return date.toLocaleString('ru', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).replace('г.', '');
}

export { getDateForApi, getDateForArticles }