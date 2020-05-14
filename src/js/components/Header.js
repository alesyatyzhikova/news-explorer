export default class Header {
  constructor(props) {
    this.isLoggedIn = props.isLoggedIn;
    this.userName = props.userName
  }
  render() {
    if (this.isLoggedIn) {
      document.querySelectorAll('.header__item').forEach(item => item.classList.remove('header__item_not-active'))
      document.querySelector('.header__auth').style.display = 'none';
    }
  }

}