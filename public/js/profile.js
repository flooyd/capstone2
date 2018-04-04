$(() => {
  let watchedShows;
  console.log('hi');
  getWatched();

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
    console.log(data);
  }
})