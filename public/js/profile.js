$(() => {
  let watchedShows;
  begin();

  window.addEventListener('loginFinished', function() {
    //if user wasn't logged in when initially reaches this page, begin is never called, so it's called here as well
    begin();
    profileBegin();
  });

  console.log(loggedIn);
  if(loggedIn) {
    profileBegin();
  }

  function profileBegin() {
    getWatched();
  }
  

  function getWatched() {
    ajax('/api/watched/watched', {}, 'GET', true, getWatchedSuccess, getWatchedFail);
  }

  function getWatchedSuccess(data, status, res) {
    watchedShows = data;
    data.forEach(show => {
      renderWatchedShow(show);
    })
  }

  function getWatchedFail(data, status, res) {
    console.log(data.responseText);
  }
})