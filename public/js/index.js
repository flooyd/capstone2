function ajax(url, data, bAuth, type, success, error) {
  $.ajax({
    url,
    data,
    type,
    success,
    error,
    beforeSend: function(req) {
      req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
    }
  })
}
$(() => {
  let event = document.createEvent('Event');
  event.initEvent('login', true, true);

  let loginOrRegister = 'register';
  handleDisplayLoginBox();
  handleSwitchLogin();
  handleLoginSubmit();
  
  function handleDisplayLoginBox() {
    $('.closeButton').click(() => {
      console.log('hi');
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
        console.log('hi');
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
    ajax(URL, data, false, 'POST', afterLogin, failedLogin);
  }
  
  function afterLogin(res) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', res.username);
    
    $('.login').css('display', 'none');
    dispatchEvent(event);
  }
  
  function failedLogin(res) {
    console.log(res);
  }


})