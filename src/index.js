document.addEventListener('DOMContentLoaded', () => {
  const soundscapeURL = 'http://localhost:3000/api/v1/soundscapes/'
  const soundURL = 'http://localhost:3000/api/v1/sounds/'
  const dropdownMenu = document.getElementById('dropdown')
  const buttonContainer = document.getElementById('button-container')
  const audioContainer = document.getElementById('audio-container')
  const onOffButton = document.getElementById('on-off-button')
  const canvas = document.getElementById('audio-canvas')
  const waveSpan = document.getElementById('wave-span')

  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  let osc = audioContext.createOscillator()
  let gain = audioContext.createGain()

  const getSoundscapes = () => {
    fetch(soundscapeURL)
      .then(response => response.json())
      .then(data => {
        fillMenu(data)
      })
  }

  const getOneSoundscape = (id) => {
    buttonContainer.innerHTML = ''
    fetch(soundscapeURL + id)
      .then(response => response.json())
      .then(scape => {
        makeButtons(scape.sounds)
      })
  }

  const fillMenu = (data) => {
    data.forEach(scape => {
      dropdownMenu.innerHTML += `
        <option value="${scape.id}">${scape.name}</option>
      `
    })
  }

  const makeButtons = (sounds) => {
    sounds.forEach(sound => {
      buttonContainer.innerHTML += `
        <button type="button" data-id="${sound.id}" data-playing="0">${sound.name}</button>
      `
    })
  }

  const getOneSound = (id) => {
    fetch(soundURL + id)
      .then(response => response.json())
      .then(sound => {
        playSound(sound)
      })
  }

  const playSound = (sound) => {
    let newSound = new Audio(`sounds/${sound.source}`)
    newSound.dataset.id = `${sound.id}`
    // newSound.dataset.playing = true
    audioContainer.appendChild(newSound)
    newSound.loop = true
    newSound.play()
    animateBackground()
  }

  const animateBackground = () => {
    document.body.style.animationName = 'background'
    document.body.style.animationDuration = '10s'
    document.body.style.animationIterationCount = 'infinite'
    document.body.style.animationDirection = 'alternate'
  }

  const createNodes = () => {
    // let osc = audioContext.createOscillator()
    // let gain = audioContext.createGain()

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.type = 'square'
    osc.frequency.value = 220
    gain.gain.value = 0.05

    osc.start()

    canvas.addEventListener('mousemove', (event) => {
      console.log(event);
      osc.frequency.value = Math.abs(350 - event.clientX) / 100 * 1300
      gain.gain.value = (370 - event.clientY) / 100 * .5
      // document.body.style.backgroundColor = `#${event.clientX}`
    })
  }

  const muteAll = () => {
    audioContainer.innerHTML = ''
  }

  const muteOne = (id) => {
    let audio = audioContainer.querySelector(`audio[data-id="${id}"]`)
    audio.remove()
  }

  dropdownMenu.addEventListener('change', (event) => {
    muteAll()
    document.body.style.animationDuration = '0s'
    getOneSoundscape(event.target.value)
  })

  buttonContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      if (event.target.dataset.playing == 0) {
        event.target.dataset.playing = 1
        getOneSound(event.target.dataset.id)
      } else if (event.target.dataset.playing == 1) {
        event.target.dataset.playing = 0
        muteOne(event.target.dataset.id)
      }
    }
  })

  onOffButton.addEventListener('click', (event) => {
    if (event.target.dataset.on === 'first') {
      event.target.dataset.on = 1
      createNodes()
    } else if (event.target.dataset.on == 1) {
      event.target.dataset.on = 0
      gain.disconnect(audioContext.destination)
    } else if (event.target.dataset.on == 0) {
      event.target.dataset.on = 1
      gain.connect(audioContext.destination)
    }
  })

  waveSpan.addEventListener('click', (event) => {
    if (event.target.id === 'sine-wave') {
      osc.type = 'sine'
    } else if (event.target.id === 'square-wave') {
      osc.type = 'square'
    } else if (event.target.id === 'saw-wave') {
      osc.type = 'sawtooth'
    }
  })


  getSoundscapes()
});
