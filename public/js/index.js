
function ajax(url, data, type, bSendAuth, success, error) {
  return $.ajax({
    url,
    data,
    type,
    beforeSend: function(req) {
      if(bSendAuth) {
        req.setRequestHeader('Authorization', 'bearer ' + localStorage.getItem('token'));
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

let localStorage = window.localStorage;


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

    window.dispatchEvent(loginFinished);
  

  }
  
  function failedLogin(res) {
    console.log(res);
    $('.loginError').text('Incorrect username or password. Please try again.');
  }


})