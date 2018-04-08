$(() => {
  let watchedShows = [];
  let clickedShows = [];
  let workingShow;

  window.addEventListener('loginFinished', function () {
    profileBegin();
  });

  if (loggedIn) {
    profileBegin();
  }

  handleShowClicked();

  function profileBegin() {
    getWatched();

  }

  function renderShowInfo(show) {
    console.log(show);
  }

  function renderSeasons(data) {
    let seasonCount = [...new Set(data.map(episode => episode.season))].length;

    for (let i = 0; i < seasonCount; i++) {
      
      let episodeCount = data.filter(episode => episode.season === i + 1).length;
      $('#episodes').append(renderSeasonBlock(i + 1, episodeCount, data[0].showId));
      for (let j = 0; j < episodeCount; j++) {
        
      }
    }
  }

  function renderSeasonBlock(season, episodeCount, showId) {
    return (
      `<div class="seasonBlock" id="${season}-${showId}">
        <table class="seasonTable">
        <tr>
        <td class="seasonNumber">Season ${season}</td>
        <td class="seasonExpand">Down</td>
        <td class="episodeCount">${episodeCount} episodes</td>
        </tr>
        </table>
        <div class="seasonOptions">
          <button class="btn btn-default">View episodes</button>
        </div>
       </div>
      `
      // <p class="seasonNumber">Season ${season} <span class="seasonExpand">down</span> <span class="episodeCount">${episodeCount} episodes</span></p>
    )
  }

  function renderEpisode(episode) {
    //div episode ID
        //episode title
        //description button
        //watchedAt
        //date
        //unwatch
  }

  function getWatched() {
    ajax('/api/watched/watched', {}, 'GET', true, getWatchedSuccess, getWatchedFail);
  }

  function getWatchedSuccess(data, status, res) {
    watchedShows.push(data);
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
    let showId = data[0].showId;
    clickedShows.push({
      showId: showId,
      episodes: data
    });
    renderShowInfo(data[0]);
    renderSeasons(data);
  }

  function getEpisodesFail(data, status, res) {
    console.log(data);
  }

  function handleShowClicked() {
    $('main').on('click', '.watchedTitle p', e => {
      let showId = $(e.currentTarget).parent().prop('id');
      let watchedShow = clickedShows.find(show => show.showId);
      if(watchedShow) {
        //user previously clicked on this show while on page
        //don't make another server call, get episodes from memory
        renderSeasons(watchedShow.episodes);
        renderShowInfo(watchedShow.episodes[0]);
      } else {
        getEpisodes(showId);
      }
    });
  }

});