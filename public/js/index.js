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
      if(linkText == 'Login') {
        console.log('hi');
        $(e.currentTarget).text('Register');
        $('.currentForm-js').text('Need an account?')
        $('.loginForm legend').text('Login');
        $('.loginForm').attr('action', 'api/users');
        $('.passwordConfirm').remove();
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
      }
    })
  }


})