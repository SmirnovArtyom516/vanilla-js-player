const audioUrl = 'https://file.audiostack.ai/demo.mp3'
const playerWidth = 300

const trackDurationDiv = document.querySelector('.audio-track')
const trackDurationTimeDiv = document.querySelector('.audio-track .time')
const progressDurationDiv = document.querySelector('.audio-track .progress')
const progressCircle = document.querySelector('.progress .circle')
const currentTimeDiv = document.querySelector('.audio-track .currentTime')
const playButton = document.querySelector('.controls .play')
const pauseButton = document.querySelector('.controls .pause')

let isPlaying = false

trackDurationDiv.style['width'] = `${playerWidth}px`
progressDurationDiv.style['width'] = `${playerWidth}px`
// progressCircle.style['width'] = `10px`
// progressCircle.style['height'] = `10px`


// number formatter helper
const formatNumber = (n) => {
  if (typeof n !== "number") {
    return ''
  }
  const seconds = (n % 60).toFixed(0).toString().padStart(2, '0')
  const minutes = (n / 60).toFixed(0).toString().padStart(2, '0')

  return `${minutes}:${seconds}`
}

// creating audio element
const audio = new Audio(audioUrl)

// play button event
playButton.addEventListener('click', () => {
  void audio.play()
  isPlaying = true
})


// pause button event
pauseButton.addEventListener('click', () => {
  audio.pause()
  isPlaying = false
})


// on load audio
audio.addEventListener("loadedmetadata", () => {
  // set track length in seconds
  trackDurationTimeDiv.innerText = formatNumber(audio.duration)

  // track playing progress update
  setInterval(() => {
    if (isPlaying) {
      currentTimeDiv.innerText = formatNumber(audio.currentTime)
      progressDurationDiv.style['transition'] = ''
      progressCircle.style['transition'] = ''
      

      const progress = audio.currentTime / audio.duration
      progressDurationDiv.style['transform'] = `scaleX(${progress})`
      progressCircle.style['transform-origin'] = `0% 0%`
    }
  }, 300)
})

trackDurationDiv.addEventListener('click', (e) => {
  // подсчитываем прогресс
  const offsetX = e.x - trackDurationDiv.getBoundingClientRect().x
  const clickProgress = offsetX / playerWidth
  audio.currentTime = clickProgress * audio.duration

  // приостанавливем регулярное обновление
  const prevIsPlaying = isPlaying
  isPlaying = false

  // убираем анимацию
  progressDurationDiv.style['transition'] = 'none'
  progressCircle.style['transition'] = 'none'

  // усанавливаем прогресс
  progressDurationDiv.style['transform'] = `scaleX(${clickProgress})`
  progressCircle.style['transform-origin'] = `0% 0%`
  currentTimeDiv.innerText = formatNumber(audio.currentTime)

  // возобновляем анимацию и регулярное обновление прогресса
  isPlaying = prevIsPlaying
})

// реализация drag-n-drop
let dndPrevPlaying

trackDurationDiv.addEventListener('dragstart', (e) => {
  // убираем drag preview
  e.dataTransfer.setDragImage(document.createElement('div'), 0, 0);

  // убираем анимацию
  dndPrevPlaying = isPlaying
  isPlaying = false
  progressDurationDiv.style['transition'] = 'none'
  progressCircle.style['transition'] = 'none'
  
})

trackDurationDiv.addEventListener('drag', (e) => {
  // подсчитываем прогресс
  const offsetX = e.x - trackDurationDiv.getBoundingClientRect().x
  const dragProgress = offsetX / playerWidth

  // отображаем прогресс
  if (dragProgress <= 0 ) {
    progressDurationDiv.style['transform'] = 'scaleX(0)'
    progressCircle.style['transform-origin'] = `0% 0%`
  } else if (dragProgress >= 1) {
    progressDurationDiv.style['transform'] = 'scaleX(1)'
    progressCircle.style['transform-origin'] = `0% 0%`
  } else {
    progressDurationDiv.style['transform'] = `scaleX(${dragProgress})`
    progressCircle.style['transform-origin'] = `0% 0%`
  }
})

trackDurationDiv.addEventListener('dragend', (e) => {
  // подсчитываем прогресс
  const offsetX = e.x - trackDurationDiv.getBoundingClientRect().x
  const dragEndProgress = offsetX / playerWidth

  // устанавливаем прогресс
  if (dragEndProgress <= 0 ) {
    progressDurationDiv.style['transform'] = 'scaleX(0)'
    progressCircle.style['transform-origin'] = `0% 0%`
    audio.currentTime = 0
  } else if(dragEndProgress >= 1) {
    audio.currentTime = audio.duration
    progressDurationDiv.style['transform'] = 'scaleX(1)'
    progressCircle.style['transform-origin'] = `0% 0%`
  } else {
    audio.currentTime = dragEndProgress * audio.duration
    progressDurationDiv.style['transform'] = `scaleX(${dragEndProgress})`
    progressCircle.style['transform-origin'] = `0% 0%`
  }

  currentTimeDiv.innerText = formatNumber(audio.currentTime)

  // возобновляем анимацию и регулярное обновление прогресса
  isPlaying = dndPrevPlaying
})










