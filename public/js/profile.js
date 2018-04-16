'use strict';

$(() => {
  let workingEpisodes = [];
  let watchedEpisodes = [];
  let numEpisodesToSave = 0;

  window.addEventListener('loginFinished', function () {
    begin();
    profileBegin();
  });

  if (loggedIn) {
    profileBegin();
  }

  handleShowClicked();
  handleDisplayEpisodes();
  handleWatchEpisode();
  handleWatchSeason();
  handleWatchAll();
  handleSaveEpisodes();

  function profileBegin() {
    //check for episode link clicked from search page
    let showId = checkForShow();
    if (showId !== '0') {
      $('main').empty();
      return getEpisodes(showId);
    }
    getWatched();
  }

  function handleShowClicked() {
    $('main').on('click', '.watchedTitle p', e => {
      e.preventDefault();
      let showId = $(e.currentTarget).parent().prop('id');
      getEpisodes(showId);
    });
  }

  function checkForShow() {
    let showId = $('main').prop('id');
    if (showId) return showId;
  }

  function getWatched() {
    ajax('/api/watched/watched', {}, 'GET', true, getWatchedSuccess, getWatchedFail);
  }

  function getWatchedSuccess(data, status, res) {
    data.forEach(show => {
      renderWatchedShow(show);
    });
  }

  function getWatchedFail(data, status, res) {
    console.log(data.responseText);
  }

  function renderShowInfo(show, episodes, seasonCount) {
    let episodesWatched = episodes.filter(e => {
      return e.watchedAt !== null;
    });

    let episodeCount = '';

    if (episodesWatched.length === episodes.length) {
      episodeCount = '- All episodes watched';
    } else if (episodesWatched.length > 0) {
      episodeCount = `- ${episodesWatched.length} episodes watched`;
    }

    $('main').empty().append(
      `
      <section class="showOptions">
      <p class="showTitle">${show.show} ${episodeCount}</p>
      <div class="showButtons">
        <button class="btn btn-default watchAllShow">Watch all</button>
        <button class="btn btn-default removeShow">Remove show</button>
        <button class="btn btn-default expandAllSeasons">Expand all</button>
        <button class="btn btn-default backToBrowse">Shows</button>
      </div>
      </section>

      <section class="showInfo">
        <img src="${show.image}" alt="An image of the show ${show.show}">
        <div class="showDescription">
        ${show.showDescription}
        </div>
      </section>

      <section id="episodes">

      </section>
      `
    )
    $('main').removeClass('showsGrid');
  }

  function renderSeasons(data) {
    let seasonCount = [...new Set(data.map(episode => episode.season))].length;
    renderShowInfo(data[0], data, seasonCount);

    for (let i = 0; i < seasonCount; i++) {
      let episodes = data.filter(episode => episode.season === i + 1);
      let episodesToRender = [];
      let currentSeason = $('#episodes').append(renderSeasonBlock(i + 1, episodes.length, data[0].showId));
      currentSeason = `${i+1}---${data[0].showId}`;
      currentSeason = $(`#${currentSeason}`);
      let watchedCount = 0;

      for (let j = 0; j < episodes.length; j++) {
        let episodeInfo = getEpisodeHTML(episodes[j], i + 1);
        let episodeHtml = episodeInfo.episodeHtml;
        if (episodes[j].watchedAt) {
          watchedCount++;
        }
        episodesToRender.push(episodeHtml);
      }
      let episodeCount = $(currentSeason).find('.episodeCount');
      $(episodeCount).text(`${watchedCount} / ${episodes.length} episodes watched`);
      if (watchedCount == episodes.length) {
        $(currentSeason).find('.watchAllSeason').prop('disabled', true);
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
        <td class="episodeCount">${episodeCount}</td>
        </tr>
        </table>
        <div class="saveEpisodes">
          <p class="numEpisodesToSave">15 episodes watched (all seasons)</p>
          <button class="saveEpisodesButton btn btn-default">Save watched episodes - Ctrl+S / ⌘+S</button>
        </div>
        <div class="seasonOptions">
          <button class="viewSeason btn btn-default">View episodes</button>
          <button class="watchAllSeason btn btn-default">Watch entire season</button>
        </div>
       </div>
       </div>
      `
    );
  }

  function getFormattedDate(date) {
    let formattedDate = new Date(date);
    let month = formattedDate.getUTCMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let day = formattedDate.getUTCDate();
    let year = formattedDate.getUTCFullYear();

    formattedDate = month + "/" + day + "/" + year;
    return formattedDate;
  }

  function getEpisodeHTML(episode) {
    //if all episodes null airdate, handle future season
    let airDate = episode.airDate.split('T')[0];
    let formattedAirDate = getFormattedDate(airDate);
    let formattedWatchDate = getFormattedDate(episode.watchedAt);
    let watchedAt = '';
    if (episode.watchedAt !== null) {
      watchedAt = `<p class="epWatchedAt">Watched on: ${formattedWatchDate}</p>
                   <button class="unwatch btn btn-default">Unwatch</button>`;
    } else {
      watchedAt = `<input class="dateInput" type="date" name="watchedDate" value="${airDate}">
        <button class="episodeWatched btn btn-default">Watch</button>`
    }

    let episodeHtml = `
      <div class="episode" id="${episode.id}">
        <p class="episodeHeader">
        <span class="episodeTitle">${episode.title}</span>
        <span class="episodeAirDate">Air date: ${formattedAirDate}</span>
        <span class="episodeNumber">Episode ${episode.number}</span>
        </p>
        <div class="episodeInfo">
        ${episode.description}
        <img class="episodeImg" src="${episode.episodeImage}" 
        alt="A preview picture of season ${episode.season} episode ${episode.number}">
        </div>
        <div class="episodeOptions">
        ${watchedAt}
        </div>
        <p class="watchedInfo"></p>
      </div>`;

    return {
      episodeHtml,
      watchedAt
    }
    //description, episodeImage, 
    //div episode ID
    //episode title
    //description button
    //watchedAt
    //date
    //unwatch
  }

  function handleWatchEpisode() {
    $('main').on('click', '.episodeWatched', e => {
      let watchedAt = $(e.currentTarget).siblings('.dateInput').val();
      let id = $(e.currentTarget).closest('.episode').prop('id');
      let seasonShow = $(e.currentTarget).closest('.season').prop('id').split('---');
      let showId = seasonShow[1];

      let airDate = workingEpisodes.find(e => {
        return e.id == id
      }).airDate;

      watchedAt = new Date(watchedAt);
      airDate = new Date(airDate);

      let watchedInfo = $(e.currentTarget).parent().siblings('.watchedInfo');
      let seasonBlock = $(e.currentTarget).closest('.episode').siblings('.seasonBlock');

      if (watchedAt.getTime() < airDate.getTime()) {
        $(watchedInfo).text('Watch date can\'t be before the air date.');
        return;
      } else {
        watchedEpisodes = watchedEpisodes.filter(e => {
          return e.id !== id
        });

        watchedEpisodes.push({
          id,
          watchedAt
        });

        numEpisodesToSave = watchedEpisodes.length;

        $(watchedInfo).text('Episode watched! Remember to save when you are finished.');
        $(watchedInfo).css('height', '34px');
        $('.saveEpisodes').css('display', 'block');
        $(e.currentTarget).parent().css('display', 'none');
        $('.numEpisodesToSave').text(`${numEpisodesToSave} episodes watched (all seasons)`);
        setTimeout(() => {
          $(watchedInfo).text('');
        }, 2500);
      }
    });
  }

  function handleWatchSeason() {
    $('main').on('click', '.watchAllSeason', e => {
      let season = $(e.currentTarget).closest('.season').prop('id').split('---')[0];
      watchMany(false, season);
    });
  }

  function handleWatchAll() {
    $('main').on('click', '.watchAllShow', e => {
      //$('.watchNotification').css('display', 'initial');
      //$('.watchNotification').css('height', 1000);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      //$('body').addClass('noScroll');
      watchMany(true);
    });
  }

  function handleSaveEpisodes() {
    $('main').on('click', '.saveEpisodesButton', e => {
      watchMany(false);
    });

    $(document).keydown(e => {
      if ((e.ctrlKey || e.metaKey) && e.which == 83) {
        e.preventDefault();
        watchMany(false);
      }
    })
  }

  function watchMany(bAll = false, season = false) {
    let showId = workingEpisodes[0].showId;
    let episodesToSave = workingEpisodes;

    if (bAll || season) {
      if (season) {
        episodesToSave = episodesToSave.filter(e => e.season == season);
      }
      //map and filter
      episodesToSave = episodesToSave.reduce((filtered, episode) => {
        if (!episode.watchedAt) {
          if (episode.airDate) {
            episode.watchedAt = episode.airDate;
          } else {
            episode.watchedAt = Date.now();
          }
          filtered.push({
            id: episode.id,
            watchedAt: episode.watchedAt
          });
        }

        return filtered;
      }, []);
    } else {
      episodesToSave = watchedEpisodes;
    }

    ajax('/api/watched/watched', JSON.stringify({
      episodesToSave,
      showId
    }), 'PUT', true, watchManySuccess, watchManyFail);
  }

  function watchManySuccess(data, status, res) {
    for (let i = 0; i < data.length; i++) {
      workingEpisodes = workingEpisodes.map(e => {
        if (e.id === data[i].id) {
          e.watchedAt = data[i].watchedAt;
        }
        return e;
      })
    }

    watchedEpisodes = [];
    $('.saveEpisodes').css('display', 'none');
    updateShowInfo();
    updateEpisodes(data);
    updateSeasons();
  }

  function watchManyFail(data, status, res) {
    console.log(data);
  }

  function updateShowInfo() {
    let numEpisodes = workingEpisodes.filter(e => {
      return e.watchedAt !== null;
    }).length;

    let episodeCount = '';

    if (numEpisodes === workingEpisodes.length) {
      episodeCount = '- All episodes watched';
    } else if (numEpisodes > 0) {
      episodeCount = `- ${numEpisodes} episodes watched`;
    }

    $('.showTitle').text(`${workingEpisodes[0].show} ${episodeCount}`);
  }

  function updateSeasons() {
    let seasonBlocks = $('.seasonBlock');
    $(seasonBlocks).each(function (s) {
      let season = $(this).closest('.season').prop('id').split('---')[0];

      let numWatched = workingEpisodes.filter(e => {
        return e.watchedAt && e.season == season;
      }).length;

      let numInSeason = workingEpisodes.filter(e => {
        return e.season == season;
      }).length;

      $(this).find('.episodeCount').text(`${numWatched} / ${numInSeason} episodes watched`);
      if (numWatched == numInSeason) {
        $(this).find('.watchAllSeason').prop('disabled', true);
      } else {
        $(this).find('.watchAllSeason').prop('disabled', false);
      }
    });
  }

  function updateEpisodes(episodes) {
    episodes.forEach(episodeToUpdate => {
      let newEpisode = workingEpisodes.find(e => {
        return e.id === episodeToUpdate.id;
      });

      let oldEpisode = $(`#${episodeToUpdate.id}`);
      newEpisode = getEpisodeHTML(newEpisode).episodeHtml;
      newEpisode = $('<div></div>').html(newEpisode).children();
      $(oldEpisode).find('.episodeOptions');

      $(oldEpisode).replaceWith(newEpisode);
      $(newEpisode).css('display', 'block');
      let seasonBlock = $(newEpisode).closest('.seasonBlock').html();
    })
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
    renderSeasons(data);
  }

  function getEpisodesFail(data, status, res) {
    console.log(data);
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
      $('.viewEpisodes').removeClass('viewSeason').addClass('hideEpisodes');
      $('.viewEpisodes').text('Hide episodes')
    });

    $('main').on('click', '.expandAllSeasons', e => {
      if ($(e.currentTarget).text() === 'Expand all') {
        $('.viewSeason').each(function () {
          $('.episode').css('display', 'block');
          $(this).text('Hide Episodes');
          $(this).removeClass('viewSeason').addClass('hideEpisodes');
        });
        $(e.currentTarget).text('Collapse all');
      } else {
        $('.hideEpisodes').each(function () {
          $('.episode').css('display', 'none');
          $(this).text('View Episodes');
          $(this).removeClass('hideEpisodes').addClass('viewSeason');
        });
        $(e.currentTarget).text('Expand all');
      }
    });
  }

  $('main').on('click', '.removeShow', e => {
    ajax(`/api/watched/remove`, JSON.stringify({
      showId: workingEpisodes[0].showId
    }), 'DELETE', true, removeSuccess, removeFail);
  })

  function removeSuccess(data, status, res) {
    window.location.replace('/profile');
  }

  function removeFail(data, status, res) {
    console.log(data);
  }

  $('main').on('click', '.unwatch', e => {
    let id = $(e.currentTarget).closest('.episode').prop('id');
    let episode = workingEpisodes.find(e => e.id == id);
    let unwatch = {
      id: episode.id,
      showId: episode.showId
    };

    ajax('/api/watched/unwatch', JSON.stringify(unwatch), 'PUT', true, unwatchSuccess, unwatchFail);
  });

  function unwatchSuccess(data, status, res) {
    workingEpisodes = workingEpisodes.map(e => {
      if (e.id == data.id) {
        e.watchedAt = data.watchedAt;
      }
      return e;
    });
    
    updateShowInfo();
    updateEpisodes(new Array(data));
    updateSeasons();
  }



  function unwatchFail(data, status, res) {
    console.log(data);
  }

  $('main').on('click', '.backToBrowse', e => {
    window.location.replace('/profile');
  });
});