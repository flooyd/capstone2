
$(() => {
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
  
  function renderItem(show) {
    console.log('hi');
    $('#searchResults').append(
      `<div class="result">
          <img class="resultImg" src="${show.image.medium}">
          <div class='resultInfo'>
            <div class="resultTitle">
              ${show.name}
            </div>
            <p class="resultDesc">
              ${show.summary}
            </p>
            <button class="Watching btn btn-danger">Watching</button>
            <button class="Watched btn btn-default">Watched All</button>
            <button class="IMDB btn btn-info">View on IMDB</button>
          </div>
        </div>`)
  }
  $('.searchForm-js').submit(e => {
    e.preventDefault();
    $('#searchResults').empty();
    let query = $('.titleSearch').val();
    search(query);
  });
});