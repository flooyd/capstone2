//global variables and functions. Tried to avoid these as much as possible, but it's an easy way to
//allow for modular functions that can be used across pages (can't use export and import here...)

'use strict';
let loggedIn = false;
let displayPref = 'watchedTitle';
let sidebarCollapsed = true;
begin();

function ajax(url, data, type, bSendAuth, success, error) {
  return $.ajax({
    url,
    data,
    type,
    beforeSend: function (req) {
      if (bSendAuth) {
        req.setRequestHeader('Authorization', 'bearer ' + localStorage.getItem('token'));
        req.setRequestHeader('Content-type', 'application/json');
      }
    },
    success: function (data, status, res) {
      success(data, status, res);
    },
    error: function (data, status, res) {
      error(data, status, res);
    }
  })
}

function begin() {
  if (localStorage.getItem('token')) {
    loggedIn = true;
    $('.preAuth').css('display', 'none');
    $('.authNeeded').css('display', 'block');
  }
}

function getWatchedShowHTML(show) {
  console.log(show);
  return `<div id=${show.showId} class="${displayPref}">
          <p>${show.show}</p>
          <img src=${show.image} alt="A poster of the show ${show.show}">
          </div>`
}

function renderWatchedShow(show, displayPref) {
  $('#watchedTitles').append(getWatchedShowHTML(show));
}

$(() => {
  let event = document.createEvent('Event');
  event.initEvent('login', true, true);

  let loginOrRegister = 'register';
  var body = document.getElementsByTagName("BODY")[0];
  let loginFinished = document.createEvent('HTMLEvents');
  loginFinished.initEvent('loginFinished', true, true);

  handleDisplayLoginBox();
  handleSwitchLogin();
  handleLoginSubmit();
  handleChangeListDisplay();
  handleResizeSidebar();
  swapSidebarElements(sidebarCollapsed);

  function handleChangeListDisplay() {
    $('.titleBlocks').click((e) => {
      toggleClass('watchedTitleOnly');
      $('#displayFilters button').prop('disabled', false);
      $(e.currentTarget).prop('disabled', true);
    });

    $('.imageBlocks').click((e) => {
      toggleClass('watchedTitle');
      $('#displayFilters button').prop('disabled', false);
      $(e.currentTarget).prop('disabled', true);
    });
  }

  function toggleClass(classToAdd) {
    displayPref = classToAdd;
    $('.watchedTitle, .watchedTitleOnly').removeClass('watchedTitleOnly watchedTitle').addClass(classToAdd);
  }

  function handleDisplayLoginBox() {
    $('.closeButton').click(() => {
      $('.login').css('display', 'none');
    });

    $('.sidebar').on('click', '.logNav', () => {
      $('.login').css('display', 'initial');
    });
  }

  function handleSwitchLogin() {
    $('.registerLink').click(e => {
      $('.loginError').empty();
      let linkText = $(e.currentTarget).text();
      if (linkText == 'Login') {
        ('hi');
        $(e.currentTarget).text('Register');
        $('.currentForm-js').text('Need an account?')
        $('.loginForm legend').text('Login');
        $('.loginForm').attr('action', 'api/auth/login');
        $('.passwordConfirm').remove();
        loginOrRegister = 'login';
      } else {
        $(e.currentTarget).text('Login');
        $('.currentForm-js').text('Already Registered?')
        $('.loginForm legend').text('Create Account');
        $('.loginForm').attr('action', 'api/users');
        $('.loginForm button').before(
          `<div class="passwordConfirm">
          <label for="passwordConfirm">Confirm</label>
          <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirm password" required>
        </div>`)
        loginOrRegister = 'register';
      }
    })
  }

  function handleLoginSubmit() {
    $('.loginForm').submit(e => {
      e.preventDefault();
      let URL = '';
      if (loginOrRegister === 'register') {
        URL = 'api/users';
      } else {
        URL = 'api/auth/login'
      }
      login(URL);

    })
  }

  function login(URL) {
    let username = $('#username').val();
    let password = $('#password').val();
    let data = {
      username,
      password
    }

    ajax(URL, data, 'POST', false, afterLogin, failedLogin);
  }

  function afterLogin(res) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', res.username);
    $('.login').css('display', 'none');
    window.dispatchEvent(loginFinished);
  }

  function failedLogin(res) {
    console.log(res);
    $('.loginError').text('Incorrect username or password. Please try again.');
  }

  function handleResizeSidebar() {
    $('.sidebar').on('click', '.chevronCollapse', e => {
      swapSidebarElements(true);
      //$('.sidebar').css('width', '40px');
      //$('.brand').css('margin-left', '25px');
      $('body').css('grid-template-columns', '40px 1fr');
    });

    $('.sidebar').on('click', '.chevronOpen', e => {
      swapSidebarElements(false);
      //$('.sidebar').css('width', '130px');
      //$('.brand').css('margin-left', '115px');
      $('body').css('grid-template-columns', '130px 1fr');
    });
  }


  function swapSidebarElements(bCollapse, fromLogin) {
    let loginElement = '';
    if (loggedIn) {
      if (bCollapse) {
        loginElement = '<img src="icons/logout.png">';
      } else {
        loginElement = '<a href="#">Logout</a>';
      }
    } else {
      if (bCollapse) {
        loginElement = '<img src="icons/login.png">';
      } else {
        loginElement = '<p>Login</p>';
      }
    }


    $('.sidebar').empty();
    if (bCollapse) {
      $('.sidebar').append(
        `<div class="sidebarNav">
        <div class="searchNav">
          <a href="/">
            <img src="icons/search.png">
          </a>
        </div>
        <div class="profileNav">
          <a href="/profile">
            <img src="icons/profile.png">
          </a>
        </div>
        <div class="friendsNav">
          <a href="#">
            <img src="icons/friends.png">
          </a>
        </div>
      </div>
      <div class="collapseNav">
        <button>
          <img src="icons/chevronOpen.png" class="chevronOpen">
        </button>
      </div>
      <div class="logNav">
        <a href="#">
          ${loginElement}
        </a>
      </div>`
      )
    } else {
      $('.sidebar').append(
        `<div class="sidebarNav">
        <div class="searchNav">
          <a href="/">
            Search
          </a>
        </div>
        <div class="profileNav">
          <a href="/profile">
            Profile
          </a>
        </div>
        <div class="friendsNav">
          <a href="#">
            Friends
          </a>
        </div>
      </div>
      <div class="collapseNav">
        <button>
          <img src="icons/chevron.png" class="chevronCollapse">
        </button>
      </div>
      <div class="logNav">
        <a href="#">
          ${loginElement}
        </a>
      </div>`
      )
    }
  }


})