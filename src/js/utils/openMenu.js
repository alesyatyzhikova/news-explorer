const menu = document.querySelector('.header__nav');

function mainMenu(selector) {
  selector.addEventListener('click', (e) => {
    if (e.currentTarget.classList.contains('header__menu-button_open_light')) {
      menu.classList.remove('header__nav_hidden-mobile');
      e.currentTarget.classList.remove('header__menu-button_open_light')
      e.currentTarget.classList.add('header__menu-button_close_light')
    } else {
      menu.classList.add('header__nav_hidden-mobile');
      e.currentTarget.classList.add('header__menu-button_open_light')
      e.currentTarget.classList.remove('header__menu-button_close_light')
    }
  })
};

function savePageMenu(selector) {
  const logo = document.querySelector('.header__logo');

  selector.addEventListener('click', (e) => {
    if (e.currentTarget.classList.contains('header__menu-button_open_dark')) {
      menu.classList.remove('header__nav_hidden-mobile');
      e.currentTarget.classList.remove('header__menu-button_open_dark');
      e.currentTarget.classList.add('header__menu-button_close_light');
      document.querySelector('.header__logo').classList.remove('header__logo_black');
      document.querySelector('.header__logo').classList.add('header__logo_light');
    } else {
      menu.classList.add('header__nav_hidden-mobile');
      e.currentTarget.classList.add('header__menu-button_open_dark');
      e.currentTarget.classList.remove('header__menu-button_close_light');
      logo.classList.add('header__logo_black');
      logo.classList.remove('header__logo_light');
    }
  })
};

export { mainMenu, savePageMenu };