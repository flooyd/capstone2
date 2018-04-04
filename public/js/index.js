//global variables and functions. Tried to avoid these as much as possible, but it's an easy way to
//allow for modular functions that can be used across pages

let loggedIn = false;
function ajax(url, data, type, bSendAuth, success, error) {
  return $.ajax({
    url,
    data,
    type,
    beforeSend: function(req) {
      if(bSendAuth) {
        req.setRequestHeader('Authorization', 'bearer ' + localStorage.getItem('token'));
        req.setRequestHeader('Content-type', 'application/json');
      }
    },
    success: function(data, status, res) {
      success(data, status, res);
    },
    error: function(data, status, res) {
      error(data, status, res);
    }
  })
}

function begin(){
  if(localStorage.getItem('user')) {
    loggedIn = true;
    $('.preAuth').css('display', 'none');
    $('.authNeeded').css('display', 'block');
  }
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
    $('.watchedTitle, .watchedTitleOnly').removeClass('watchedTitleOnly watchedTitle').addClass(classToAdd);
  }
  
  function handleDisplayLoginBox() {
    $('.closeButton').click(() => {
      $('.login').css('display', 'none');
    });

    $('.logNav').click(() => {
      $('.login').css('display', 'initial');
    });
  }
  
  function handleSwitchLogin() {
    $('.registerLink').click(e => {
      $('.loginError').empty();
      let linkText = $(e.currentTarget).text();
      if(linkText == 'Login') {
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


})