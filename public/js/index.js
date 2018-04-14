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
  return `<div id=${show.showId} class="${displayPref}">
          <p><a href="/profile?showId=${show.showId}">${show.show}</a></p>
          <img src=${show.image} alt="A poster of the show ${show.show}">
          </div>`
}

function renderWatchedShow(show, displayPref) {
  $('#watchedTitles').append(getWatchedShowHTML(show));
}

$(() => {
  let event = document.createEvent('Event');
  event.initEvent('login', true, true);

  let loginOrRegister = 'Login';
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
      let URL = '';
      if (loginOrRegister == 'register') {
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
      <div class="collapseNav">
        <img src="icons/chevronOpen.png" class="chevronOpen">
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
        <div class="friendsNav">
          <a href="#">
            Friends
          </a>
        </div>
      <div class="collapseNav">
        <img src="icons/chevron.png" class="chevronCollapse">
      </div>`
      )
    }
  }


})