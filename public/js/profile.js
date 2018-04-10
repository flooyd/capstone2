$(() => {
  let watchedShows = [];
  let clickedShows = [];
  let workingEpisodes = [];

  window.addEventListener('loginFinished', function () {
    begin();
    profileBegin();
  });

  if (loggedIn) {
    profileBegin();
  }

  handleShowClicked();
  handleDisplayEpisodes();

  function profileBegin() {
    let showId = checkForShow();
    if (showId !== '0') {
      $('main').empty();
      return getEpisodes(showId);
    }
    getWatched();
  }

  function checkForShow() {
    let showId = $('main').prop('id');
    if (showId) return showId;
  }

  function renderShowInfo(show, seasonCount) {
    $('main').empty().append(
      `
      <div class="showOptions">
      <p class="showTitle">${show.show}</p>
      <div class="showButtons">
        <button class="btn btn-default watchAllShow">Watch all</button>
        <button class="btn btn-default removeShow">Remove show</button>
        <button class="btn btn-default expandAllSeasons">Expand all</button>
        <button class="btn btn-default backToBrowse">Shows</button>
      </div>
      </div>

      <div class="showInfo">
        <img src="${show.image}" alt="An image of the show, ${show.show}">
        <div class="showDescription">
        ${show.showDescription}
        </div>
      </div>

      <div id="episodes">

      </div>
      `
    )
    $('main').removeClass('showsGrid');
  }

  function renderSeasons(data) {
    let seasonCount = [...new Set(data.map(episode => episode.season))].length;
    renderShowInfo(data[0], seasonCount);

    for (let i = 0; i < seasonCount; i++) {
      let episodes = data.filter(episode => episode.season === i + 1);
      let episodesToRender = [];
      let currentSeason = $('#episodes').append(renderSeasonBlock(i + 1, episodes.length, data[0].showId));
      currentSeason = `${i+1}---${data[0].showId}`;
      currentSeason = $(`#${currentSeason}`);
      
      for (let j = 0; j < episodes.length; j++) {
        let episode = getEpisodeHTML(episodes[j], i + 1);
        episodesToRender.push(episode);
      }
      $(currentSeason).append(episodesToRender);
    }
  }

  function renderSeasonBlock(season, episodeCount, showId) {
    return (
      `<div class="season" id="${season}---${showId}">
       <div class="seasonBlock">
        <table class="seasonTable">
        <tr>
        <td class="seasonNumber">Season ${season}</td>
        <td class="episodeCount">${episodeCount} episodes</td>
        </tr>
        </table>
        <div class="seasonOptions">
          <button class="btn btn-default viewSeason">View episodes</button>
          <button class="btn btn-default watchAllSeason">Watch entire season</button>
        </div>
       </div>
       </div>
      `
    );
  }

  function getEpisodeHTML(episode, season) {
    let airDate = episode.airDate.split('T')[0];
    let watchedAt = '';

    if (episode.watchedAt) {
      watchedAt = `<p>Watched on: <span class=watchedAt>${episode.watchedAt}</span></p>`;
    } else {
      watchedAt = '';
    }
    return (
      `
      <div class=episode id=${episode.id}>
        <p class="episodeHeader">
        <span class="episodeTitle">${episode.title}</span>
        <span class="episodeAirDate">Air date: ${airDate}</span>
        <span class="episodeNumber">Episode ${episode.number}</span>
        </p>
        <div class="episodeInfo">
        ${episode.description}
        <img class="episodeImg" src="${episode.episodeImage}" 
        alt="A preview picture of this episode of ${episode.show}">
        </div>
        <div class="episodeOptions">
        <input class="dateInput" type="date" name="watchedDate" value="${airDate}">
        <button class="episodeWatched btn btn-default">Watch</button>
        </div>
        
      </div>
      `
    )
    //description, episodeImage, 
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

  function handleDisplayEpisodes() {
    $('main').on('click', '.viewSeason', e => {
      let season = $(e.currentTarget).closest('.season');
      $(season).children('.episode').css('display', 'block');
      $(e.currentTarget).removeClass('viewSeason').addClass('hideEpisodes');
      $(e.currentTarget).text('Hide episodes');
    });

    $('main').on('click', '.hideEpisodes', e => {
      let season = $(e.currentTarget).closest('.season');
      $(season).children('.episode').css('display', 'none');
      $(e.currentTarget).removeClass('hideEpisodes').addClass('viewSeason');
      $(e.currentTarget).text('View Episodes');
    });

    $('main').on('click', '.expandAllSeasons', e => {
      $('.episode').css('display', 'block');
    })
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
    workingEpisodes = data;
    clickedShows.push({
      showId: showId,
      episodes: data
    });

    renderSeasons(data);
  }

  function getEpisodesFail(data, status, res) {
    console.log(data);
  }

  function handleShowClicked() {
    $('main').on('click', '.watchedTitle p', e => {
      e.preventDefault();
      let showId = $(e.currentTarget).parent().prop('id');
      let watchedShow = clickedShows.find(show => show.showId);
      if (watchedShow) {
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