/* global $ */

let showToastTimer

const showToast = (message, cb) => {
  clearTimeout(showToastTimer)
  $('#toast').text(message).show()
  showToastTimer = setTimeout(() => {
    $('#toast').hide()

    if (typeof cb === 'function') cb()
  }, 2000)
}

export {
  showToast
}
