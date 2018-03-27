$(() => {
  handleDisplayLoginBox();
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
  
  function handleLoginSubmit() {
    $('.registerLink').click(e => {
      let linkText = $(e.currentTarget).text();
      if(linkText == 'Register') {
        console.log('hi');
        $('.loginForm p').text('Already registered? <span class="registerLink">Login</span>')
        $(e.currentTarget).text('Login');
        $('.loginForm').attr('action', 'api/auth/login');
        $('.loginForm button').text('Register');
        $('.loginForm button').before(
          `<div class="passwordConfirm">
          <label for="passwordConfirm">Confirm</label>
          <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirm password" required>
        </div>`)
      } else {
        $(e.currentTarget).text('Register');
        $('.loginForm legend').text('Register');
        $('.loginForm').attr('action', 'api/users');
        $('.loginForm button').text('Login');
        $('.passwordConfirm').remove();
      }
      
     
    })
  }


})