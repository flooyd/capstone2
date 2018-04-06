$(() => {
  let watchedShows;

  window.addEventListener('loginFinished', function() {
    //if user wasn't logged in when initially reaches this page, begin is never called, so it's called here as well
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
    });
    console.log(watchedShows);
    console.log(watchedShows[1].showId);
    getEpisodes();
  }

  function getWatchedFail(data, status, res) {
    console.log(data.responseText);
  }

  function getEpisodes() {
    let show = {
      showId: watchedShows[0].showId
    };

    ajax('/api/watched/episodes', show, 'GET', true, getEpisodesSuccess, getEpisodesFail);
  }

  function getEpisodesSuccess(data, status, res) {
    console.log(data);
  }

  function getEpisodesFail(data, status, res) {
    console.log(data);
  }

});