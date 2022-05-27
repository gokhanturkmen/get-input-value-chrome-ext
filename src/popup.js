const selElm = document.getElementById('selElm')

selElm.addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  })

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: selectElement,
  })
})

function selectElement() {
  const body = document.querySelector('body')
  const success = (elm) => {
    elm.style.outline = '2px solid #0F2'
    elm.style.cursor = 'pointer'
  }
  const error = (elm) => {
    elm.style.outline = '2px solid'
    //elm.style.cursor = 'pointer'
  }
  const clear = (elm) => {
    elm.style.outline = ''
    elm.style.cursor = ''
  }
  const getVal = (elm) => {
    let val = elm.value
    if (!val) {
      if (!!elm?.attributes?.contenteditable) {
        val = elm.innerHtml
      }
    }
    return val
  }
  const handleElmClick = function (event) {
    event.stopPropagation()

    body.removeEventListener('click', handleElmClick)
    body.removeEventListener('mouseover', handleMouseOver)
    body.removeEventListener('mouseout', handleMouseOut)

    const target = event.target

    clear(target)

    const val = getVal(target)
    console.log(target, val)
    if (!val) {
      alert('Value is empty or does not exist!')
      return
    }
    alert(`Value is: '${val}'`)
  }

  const handleMouseOver = function (event) {
    const target = event.target
    const val = getVal(target)
    if (val) {
      success(target)
      event.stopPropagation()
      return
    }
    error(target)
  }

  const handleMouseOut = function (event) {
    event.stopPropagation()
    clear(event.target)
  }

  body.addEventListener('click', handleElmClick)
  body.addEventListener('mouseover', handleMouseOver)
  body.addEventListener('mouseout', handleMouseOut)
}
