
$(() => {
  //from index.js
  begin();

  if(loggedIn) {
    searchBegin();
  }
  
  let watchedId;
  let watchedImage;
  let watchedAll;
  let watchedShow;

  //called on login from search page
  function searchBegin() {
    getWatched();
  }
  
  function search(query) {
    let URL = `https://api.tvmaze.com/search/shows?q=${query}`
    $.getJSON(URL)
    .then(data => {
      if(data.length > 0) {
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
    if(image) {
      image.medium = image.medium.replace(/^http:\/\//i, 'https://');
      return image.medium;
    } else {
      return 'images/camera.png';
    }
  }
  function renderItem(show) {
    $('#searchResults').append(
      `<div class="result">
          <img class="resultImg" src="${getImage(show.image)}">
          <div class='resultInfo'>
            <div class="resultTitle">
              ${show.name}
            </div>
            <p class="resultDesc">
              ${show.summary}
            </p>
            <button id=${show.id} class="Watching btn btn-danger">Watching</button>
            <button id="${show.id}-all" class="Watched btn btn-default">Watched All</button>
            <button id=${show.externals.imdb} class="IMDB btn btn-info">View on IMDB</button>
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
  
  $('#searchResults').on('click', '.Watching', e => {
    watchedId = $(e.currentTarget).prop('id');
    watchedImage = $(e.currentTarget).parent().parent().find('img').prop('src');
    watchedShow = $(e.currentTarget).parent().parent().find('.resultTitle').text().trim();
    let url = `https://api.tvmaze.com/shows/${watchedId}/episodes`
    ajax(url, {}, 'GET', false, watchingSuccess, watchingFail);
    $(e.currentTarget).parent().find('button').css('display', 'none');
    $(e.currentTarget).parent().append('<p class="watchd">Adding to Watched</p>');
    
  });
  
  window.addEventListener('loginFinished', function() {
    //if user wasn't logged in when initially reaches this page, begin is never called, so it's called here as well
    begin();
    searchBegin();
  });
  
  function getWatched() {
    ajax('/api/watched/watched', {}, 'GET', true, getWatchedSuccess, getWatchedFail);
  }
  
  function getWatchedSuccess(data, status, res) {
    console.log(data);
    data.forEach(s => {
      $('#watchedTitles').append(renderWatchedShow(s));
    });
  }
  
  function getWatchedFail(data, status, res) {
    console.log(data);
  }
  function watchingSuccess(data, status, res) {
    console.log(data);
    //some shows have 0 episodes...
    if(data.length < 1) {
      $('.watchd').text('This appears to be a direct to TV movie, or it is a show with no episodes listed. No support for these yet.');
      return;
    }
    
    console.log(data);
    let episodes = data.map(e => {
      let episodeImage = e.image.medium || null;
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
          episodeImage
        };
    });
    
    episodes[0].image = watchedImage;
    episodes[0].show = watchedShow;
    
    episodes = JSON.stringify(episodes);
    
    //ajax call to my server
    if (watchedAll) {
      console.log(data);
    } else {
      //save with none watched
      console.log(data);
      ajax('api/watched/watching', episodes, 'POST', true, episodesSaveSuccess, episodesSaveFail);
    }
  }
  
  function watchingFail(data, status, res) {
    console.log(data);
  }
  
  function episodesSaveSuccess(data, status, res) {
    console.log(data);
    let watchedShow = $(`#${watchedId}`).parent().parent();
    $(watchedShow).remove();
    $('#displayFilters').after(getWatchedShowHTML(data));
  }
  
  function episodesSaveFail(data, status, res) {
    console.log('already watching');
    $('.watchd').text('You are already watching this show.');
  }
});