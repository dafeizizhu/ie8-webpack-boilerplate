/* global $, alert */

let showToastTimer

const showToast = (message, cb) => {
  if (typeof $ === 'undefined') return alert(message)

  clearTimeout(showToastTimer)
  let $toast = $('#toast')

  if ($toast.length <= 0) {
    $toast = $('<div id="toast" class="toast"></div>')
    $('body').append($toast)
  }

  $toast.text(message).show()
  showToastTimer = setTimeout(() => {
    $toast.hide()
    if (typeof cb === 'function') cb()
  }, 2000)
}

export default {
  showToast
}
