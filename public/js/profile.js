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
  
  handleShowClicked();

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
  }

  function getWatchedFail(data, status, res) {
    console.log(data.responseText);
  }

  function getEpisodes(showId) {
    let show = {
      showId
    };

    ajax('/api/watched/episodes', show, 'GET', true, getEpisodesSuccess, getEpisodesFail);
  }

  function getEpisodesSuccess(data, status, res) {
    console.log(data);
  }

  function getEpisodesFail(data, status, res) {
    console.log(data);
  }
  
  function handleShowClicked() {
    $('main').on('click', '.watchedTitle p', e => {
      console.log('hi');
      let showId = $(e.currentTarget).parent().prop('id');
      console.log(showId);
      getEpisodes(showId);
    });
  }

});