const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const tools = document.querySelectorAll('.tools__tool')
let activeTool = null
const pencilTool = document.querySelector('.pencil-tool')
const options = document.querySelectorAll('.switcher__option-square')
const currentColor = document.querySelector('.current-color')
let prevColor = document.querySelector('.prev-color')
let currentColorPicker = currentColor.value
let prevColorPicker = currentColorPicker
const prev = document.querySelector('.prev')
const fillTool = document.querySelector('.fill-tool')
const redColor = document.querySelector('.red-color')
const blueColor = document.querySelector('.blue-color')
const chooseColor = document.querySelector('.choose-color')
const inputElement = document.querySelector('.search-input')
const loadButton = document.querySelector('.load-button')
const toggleButton = document.querySelector('.toggle-button')

// Choose color tool(pipetka)
function rgbToHex(rgbColor) {
  const matches = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  const r = parseInt(matches[1])
  const g = parseInt(matches[2])
  const b = parseInt(matches[3])
  const hexColor = ((r << 16) | (g << 8) | b).toString(16)
  return "#" + ("000000" + hexColor).slice(-6)
}

function canvasChooseColorHandler(e) {
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const pixel = ctx.getImageData(x, y, 1, 1).data
  const color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`

  const hexColor = rgbToHex(color)
  updatePrevColor()
  updateCurrentColor(hexColor)
}

// Change background-color of active tool
tools.forEach(tool => {
  tool.addEventListener('click', () => {
    canvas.removeEventListener('click', canvasChooseColorHandler)
    if (activeTool !== null) {
      activeTool.classList.remove('tool-active')
    }
    if (tool !== activeTool) {
      tool.classList.add('tool-active')
      activeTool = tool
    } else {
      activeTool = null
    }
  })
})

// Pencil tool
pencilTool.addEventListener('click', function () {
  let isDrawing = false
  let lastX = 0
  let lastY = 0

  canvas.addEventListener('mousedown', function (e) {
    ctx.strokeStyle = currentColor.value
    isDrawing = true
    lastX = e.offsetX
    lastY = e.offsetY
  })

  canvas.addEventListener('mousemove', function (e) {
    ctx.strokeStyle = currentColor.value
    if (isDrawing) {
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(e.offsetX, e.offsetY)
      ctx.stroke()

      lastX = e.offsetX
      lastY = e.offsetY
    }
  })

  canvas.addEventListener('mouseup', function (e) {
    isDrawing = false
  })

  canvas.addEventListener('mouseout', function (e) {
    isDrawing = false
  })
})

// Fill tool
fillTool.addEventListener('click', function () {
  ctx.fillStyle = currentColor.value
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fill()
})

// For change current and prev colors
function updatePrevColor() {
  prevColorPicker = currentColorPicker
  prev.style.background = currentColorPicker
}
function updateCurrentColor(color) {
  currentColor.value = color
  currentColorPicker = color
}

currentColor.addEventListener('input', function (event) {
  updatePrevColor()
  currentColorPicker = event.target.value
})
prevColor.addEventListener('click', function () {
  const copyPrevColorPicker = prevColorPicker
  updatePrevColor()
  updateCurrentColor(copyPrevColorPicker)
})

// Red & Blue color picker
redColor.addEventListener('click', function () {
  updatePrevColor()
  updateCurrentColor('#FF0000')
})
blueColor.addEventListener('click', function () {
  updatePrevColor()
  updateCurrentColor('#41b7f7')
})

// Choose color tool(pipetka)  
chooseColor.addEventListener('click', function () {
  canvas.addEventListener('click', canvasChooseColorHandler)
})


// Load random images of city in the input

const accessKey = 'wcFSuwY7S8FTJDf7yAqoQz7tZGyEttatjgVGzoEnnGg'
let query = ''

canvas.width = 514
canvas.height = 514

loadButton.addEventListener('click', (event) => {
  event.preventDefault()
  const apiUrlWithQuery = `https://api.unsplash.com/photos/random/?query=${query}&client_id=${accessKey}`
  fetch(apiUrlWithQuery)
    .then(response => response.json())
    .then(data => {
      console.log(data.urls.small)
      const imgUrl = data.urls.small
      const img = new Image()
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = imgUrl
    })
    .catch(err => {
      console.error(err)
    })
})

inputElement.addEventListener('change', () => {
  query = inputElement.value
  console.log(query)
})

// Change img to black&white color

toggleButton.addEventListener('click', () => {
  canvas.classList.toggle('grayscale')
})