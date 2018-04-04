$(() => {
  let watchedShows;
  console.log('hi');
  getWatched();

  function getWatchedShowHTML(show, bDisplayImages) {
    let image = '';

    if(bDisplayImages) {
      image = `<img src=${show.image} alt="A poster of the show ${show.show}">`;
    }

    return `<div class="watchedTitleOnly">
            <p>${show.show}</p>
            ${image}`
  }

  function renderWatchedShow(show) {
    $('#watchedTitles').append(getWatchedShowHTML(show, true));
  }

  function getWatched() {
    ajax('/api/watched/watched', {}, 'GET', true, getWatchedSuccess, getWatchedFail);
  }

  function getWatchedSuccess(data, status, res) {
    watchedShows = data;
    data.forEach(show => {
      $('#watchedTitles').append(renderWatchedShow(show, true));
    })
  }

  function getWatchedFail(data, status, res) {
    console.log(data);
  }
})