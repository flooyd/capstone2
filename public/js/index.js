const results = [{
  title: '1 - Some Description',
  img: 'images/bsgtest.jpg',
  info: 'When an old enemy, the Cylons, resurface and obliterate the 12 colonies, the crew of the aged Galactica protect a small civilian fleet - the last of humanity - as they journey toward the fabled 13th colony, Earth. '
}, {
  title: '2 - Some Description'
}, {
  title: '3 - Some Description'
}, {
  title: '4 - Some Description'
}, {
  title: '5 - Some Description'
}, {
  title: '6 - Some Description'
}];

$(() => {
  $('#searchResults').append(
    `<div class="result">
    <img class="resultImg" src="images/bsgtest.jpg">
    <div class='resultInfo'>
      <div class="resultTitle">
        Battlestar Galactica
      </div>
      <p class="resultDesc">
        When an old enemy, the Cylons, resurface and obliterate the 12 colonies, the crew of the aged Galactica protect a small civilian
        fleet - the last of humanity - as they journey toward the fabled 13th colony, Earth.
      </p>
      <button class="Watching btn btn-danger">Watching</button>
      <button class="Watched btn btn-default">Watched All</button>
      <button class="IMDB btn btn-info">View on IMDB</button>
    </div>
  </div>`
  )
})