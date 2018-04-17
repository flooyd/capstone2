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
    $('.loginLink').text('Logout');
    $('.loginLink').addClass('logoutLink').removeClass('loginLink');
    $('.preAuth').css('display', 'none');
    $('.authNeeded').css('display', 'block');
  }
}

function getWatchedShowHTML(show) {
  return `<div id=${show.showId} class="${displayPref}">
          <p><a href="/profile?showId=${show.showId}">${show.show}</a></p>
          <img src=${show.image} alt="A poster of the show ${show.show}">
          </div>`
}

function renderWatchedShow(show, displayPref) {
  $('#watchedTitles').append(getWatchedShowHTML(show));
}

$(() => {

  let loginOrRegister = 'Login';

  let loginFinished = document.createEvent('HTMLEvents');
  loginFinished.initEvent('loginFinished', true, true);
  let logoutFinished = document.createEvent('HTMLEvents');
  logoutFinished.initEvent('logoutFinished', true, true);

  handleDisplayLoginBox();
  handleSwitchLogin();
  handleLoginSubmit();
  handleChangeListDisplay();
  handleResizeSidebar();
  swapSidebarElements(sidebarCollapsed);
  handleLogout();

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

    $('header').on('click', '.loginLink', () => {
      $('.login').css('display', 'initial');
      console.log('hi');
    });
  }

  function handleSwitchLogin() {
    $('.registerLink').click(e => {
      $('.loginError').empty();
      $('.login input').each(function() {
        $(this).val('');
      });

      let linkText = $(e.currentTarget).text();

      if (linkText === 'Login') {
        $(e.currentTarget).text('Register');
        $('.currentForm-js').text('Need an account?')
        $('.loginForm legend').text('Login');
        loginOrRegister = 'login';
      } else {
        $(e.currentTarget).text('Login');
        $('.currentForm-js').text('Already Registered?')
        $('.loginForm legend').text('Create Account');
        loginOrRegister = 'register';
      }
    });
  }

  function handleLoginSubmit() {
    $('.loginForm').submit(e => {
      e.preventDefault();
      let password = $('#password').val();
      if (password.length < 8) {
        $('.loginError').text('Password must be at least 8 characters.');
        return;
      }
      let URL = '';
      if (loginOrRegister == 'register') {
        URL = 'api/users';
      } else {
        URL = 'api/auth/login'
      }
      login(URL);

    })
  }

  function handleLogout() {
    $('header').on('click', '.logoutLink', e => {
      console.log('hi');
      localStorage.clear();
      window.location.replace(window.location.href);
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
    $('.loginLink').addClass('logoutLink').removeClass('.loginLink');
    $('.login').css('display', 'none');
    window.dispatchEvent(loginFinished);
  }

  function failedLogin(res) {
    console.log(res);
    $('.loginError').text(res.responseJSON.message);
  }

  function handleResizeSidebar() {
    $('.sidebar').on('click', '.chevronCollapse', e => {
      swapSidebarElements(true);
      $('.sidebar').css('width', '35px');
      $('main').css('margin-left', '40px');
      
    });

    $('.sidebar').on('click', '.chevronOpen', e => {
      swapSidebarElements(false);
      $('.sidebar').css('width', '130px');
      $('main').css('margin-left', '135px');
    });
  }


  function swapSidebarElements(bCollapse, fromLogin) {
    $('.sidebar').empty();
    if (bCollapse) {
      $('.sidebar').append(
        `<div class="searchNav">
          <a name="search" href="/">
            <img alt="A magnifying glass icon" src="icons/search.png">
          </a>
        </div>
        <div class="profileNav">
          <a name="profile" href="/profile">
            <img alt="A person icon" src="icons/profile.png">
          </a>
        </div>
        <div class="aboutNav">
          <a name="about" href="/about">
            <img alt="A question mark icon" src="icons/about.png">
          </a>
        </div>
      <div class="collapseNav">
        <img alt="An icon of an arrow pointing to the right" src="icons/chevronOpen.png" class="chevronOpen">
      </div>`
      );
    } else {
      $('.sidebar').append(
        `<div class="searchNav">
          <a href="/">
            Search
          </a>
        </div>
        <div class="profileNav">
          <a href="/profile">
            Profile
          </a>
        </div>
        <div class="aboutNav">
          <a href="#">
            About
          </a>
        </div>
      <div class="collapseNav">
        <img alt="An icon of an arrow pointing to the left" src="icons/chevron.png" class="chevronCollapse">
      </div>`
      )
    }
  }


})