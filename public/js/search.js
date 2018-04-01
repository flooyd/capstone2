
$(() => {
  window.addEventListener('login', function(e) {
    console.log('we just logged in!!!');
  }, false);
  let watchedId;
  let watchedAll;
  
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
    let url = `https://api.tvmaze.com/shows/${watchedId}/episodes`
    ajax(url, {}, 'GET', false, watchingSuccess, watchingFail);
    $(e.currentTarget).parent().find('button').css('display', 'none');
    $(e.currentTarget).parent().append('<p class="watchd">Adding to watchd</p>');
    
  });
  
  window.addEventListener('loginFinished', function() {
    $('.login').css('display', 'none');
  });
  
  function watchingSuccess(data, status, res) {
    //ajax call to my server
    if (watchedAll) {
      console.log(data);
    } else {
      console.log(data);
    }
  }
  
  function watchingFail(data, status, res) {
    console.log(data);
  }
  
  function episodesSaveSuccess(data, status, res) {
    let watchedShow = $(`#${watchedId}`).parent().parent();
    $(watchedShow).remove();
  }
  
  function episodesSaveFail(data, status, res) {
    
  }
});