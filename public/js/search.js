$(() => {
  //from index.js
  begin();

  if (loggedIn) {
    searchBegin();
  }

  let searchedShows;

  let watchedId;
  let watchedImage;
  let watchedAll;
  let watchedShow;
  let watchedSummary = [];

  //called on login from search page
  function searchBegin() {
    begin();
    getWatched();
  }



  window.addEventListener('loginFinished', function () {
    console.log('logged in');
    searchBegin();
    $('#searchResults').empty();
  });

  function search(query) {
    let URL = `https://api.tvmaze.com/search/shows?q=${query}`
    $.getJSON(URL)
      .then(data => {
        if (data.length > 0) {
          searchedShows = data;
          data.forEach(item => {
            renderItem(item.show);
          })
        } else {
          $('#searchResults').append('<p>No show was found. Try searching for something else</p>');
        }
      })
      .catch(e => {
        console.log(e);
      })
  }

  function getImage(image) {
    if (image) {
      console.log(image.medium.replace(/^http:\/\//i, 'https://'));
      return image.medium.replace(/^http:\/\//i, 'https://');
    } else {
      return 'images/camera.png';
    }
  }

  function renderItem(show) {
    if (!show.summary) {
      show.summary = "<p>This show has no description available.</p>"
    }

    let watchShows;
    if (!loggedIn) {
      watchShows = `<p class="watchShows">
              Login to watch shows.
      </p>`;
    } else {
      watchShows = `
      <div class="watchButtons">
            <button id=${show.id} class="Watching btn btn-danger">Watching</button>
            <button id=${show.externals.imdb} class="IMDB btn btn-info">View on IMDB</button>
            </div>`;
    }
    $('#searchResults').append(
      `<div class="result">
          <img class="resultImg" src="${getImage(show.image)}">
          <div class='resultInfo'>
            <div class="resultTitle">
              ${show.name}
            </div>
            ${show.summary}
            ${watchShows}
          </div>
        </div>`)
  }

  $('.searchForm-js').submit(e => {
    e.preventDefault();
    $('#searchResults').empty();
    let query = $('.titleSearch').val();
    search(query);
  });

  $('#searchResults').on('click', '.IMDB', e => {
    let id = $(e.currentTarget).prop('id');
    window.open(`https://www.imdb.com/title/${id}`);
  });

  function parseShowDescription(watchedDescription) {
    watchedSummary = [];
    if (watchedDescription.length > 0) {
      $.each(watchedDescription, (index, value) => {
        watchedSummary.push($(value).html());
      });
    }
  }

  function saveShowInfo(show) {
    watchedId = $(show).prop('id');
    watchedShow = $(show).parent().parent().parent();
    watchedImage = $(watchedShow).find('img').prop('src');
    watchedDescription = $(watchedShow).find('p');
    watchedShow = $(watchedShow).find('.resultTitle').text().trim();
    parseShowDescription($(watchedDescription));
  }

  $('#searchResults').on('click', '.Watching', e => {
    saveShowInfo($(e.currentTarget));
    let url = `https://api.tvmaze.com/shows/${watchedId}/episodes`
    ajax(url, {}, 'GET', false, watchingSuccess, watchingFail);
    $(e.currentTarget).parent().find('button').css('display', 'none');
    $(e.currentTarget).parent().append('<p class="watched">Adding to Watched</p>');
  });

  function getWatched() {
    ajax('/api/watched/watched', {}, 'GET', true, getWatchedSuccess, getWatchedFail);
  }

  function getWatchedSuccess(data, status, res) {
    if (data.length > 0) {
      $('#displayFilters ').css('display', 'block');
      console.log('hello 2');
      data.forEach(s => {
        $('#watchedTitles').append(renderWatchedShow(s));
      });
    } else {
      $('#displayFilters ').css('display', 'none');
    }
  }

  function getWatchedFail(data, status, res) {
    console.log(data);
  }

  function watchingSuccess(data, status, res) {
    //some shows have 0 episodes...
    if (data.length < 1) {
      $('.watched').text('This appears to be a direct to TV movie, or it is a show with no episodes listed. No support for these yet.');
      $('.watched').removeClass('watched').addClass('watchedError');
      return;
    }

    let episodes = data.map(e => {
      return {
        season: e.season,
        number: e.number,
        description: e.summary,
        title: e.name,
        id: e.id,
        showId: watchedId,
        user: localStorage.getItem('user'),
        watchedAt: null,
        airDate: e.airdate,
        episodeImage: getImage(e.image)
      };
    });

    let showDescription = searchedShows.filter(show => {
      if (show.show.id == watchedId) {
        return show;
      }
    })[0].show.summary;

    console.log(showDescription);

    episodes[0].image = watchedImage;
    episodes[0].show = watchedShow;
    episodes[0].showDescription = showDescription;

    episodes = JSON.stringify(episodes);

    //ajax call to my server
    if (watchedAll) {

    } else {
      //save with none watched
      ajax('api/watched/watching', episodes, 'POST', true, episodesSaveSuccess, episodesSaveFail);
    }
  }

  function watchingFail(data, status, res) {
    console.log(data);
  }

  function episodesSaveSuccess(data, status, res) {
    console.log(data);
    let watchedShow = $(`#${watchedId}`).parent().parent().parent();
    $(watchedShow).remove();
    $('#displayFilters').after(getWatchedShowHTML(data));
  }

  function episodesSaveFail(data, status, res) {
    if (data.status == 413) {
      $('.watched').text('Show is too large to track. Need to fix :)');
    } else {
      $('.watched').text('You are already watching this show.');
    }

    $('.watched').removeClass('watched').addClass('watchedError');
    return;

  }
});