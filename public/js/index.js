const results = [{
  title: '1 - Some Description'
}, {
  title: '2 - Some Description'
},{
  title: '3 - Some Description'
}, {
  title: '4 - Some Description'
}, {
  title: '5 - Some Description'
}, {
  title: '6 - Some Description'
}];

$(() => {
  results.forEach(r => {
    $('#searchResults').append(
      `<div class="result">${r.title}</div>`
    )
    $('#searchResults').append(
      `<div class="result">${r.title}</div>`
    )
    $('#searchResults').append(
      `<div class="result">${r.title}</div>`
    )
    $('#searchResults').append(
      `<div class="result">${r.title}</div>`
    )
  })
})