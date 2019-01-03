document.addEventListener('DOMContentLoaded', () => {
  const soundscapeURL = 'http://localhost:3000/api/v1/soundscapes/'
  const soundURL = 'http://localhost:3000/api/v1/sounds/'
  const dropdownMenu = document.getElementById('dropdown')
  const buttonContainer = document.getElementById('button-container')
  const audioContainer = document.getElementById('audio-container')
  const onOffButton = document.getElementById('on-off-button')
  const canvas = document.getElementById('audio-canvas')
  // const colorButton = document.getElementById('color-changer')

  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  const getSoundscapes = () => {
    fetch(soundscapeURL)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        fillMenu(data)
      })
  }

  const getOneSoundscape = (id) => {
    buttonContainer.innerHTML = ''
    fetch(soundscapeURL + id)
      .then(response => response.json())
      .then(scape => {
        console.log(scape);
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
    newSound.dataset.playing = true
    audioContainer.appendChild(newSound)
    console.log(newSound);
    newSound.play()
  }

  const createNodes = () => {
    let osc = audioContext.createOscillator()
    let gain = audioContext.createGain()

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.type = 'square'
    osc.frequency.value = 220
    gain.gain.value = 0.05

    osc.start()

    canvas.addEventListener('mousemove', (event) => {
      console.log(event);
      osc.frequency.value = event.clientX / 210 * 1000
      gain.gain.value = (110 - event.clientY) / 110 * .05
    })
  }

  const muteAll = () => {
    audioContainer.innerHTML = ''
    // let playing = document.getElementsByTagName("AUDIO")
    //   console.log(playing);
  }

  const muteOne = (id) => {
    let audio = audioContainer.querySelector(`audio[data-id="${id}"]`)
    audio.remove()
  }

  dropdownMenu.addEventListener('change', (event) => {
    muteAll()
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
    // console.log('clicked');
    createNodes()
  })

  // colorButton.addEventListener('click', (event) => {
  //   let body = document.getElementsByTagName('BODY')
  //   body.setAttribute('animation-name', 'background')
    // body.animation-name = 'background;'
    // body.animation-iteration-count = 'infinite;'
  // })


  getSoundscapes()
});
