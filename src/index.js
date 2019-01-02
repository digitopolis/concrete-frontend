document.addEventListener('DOMContentLoaded', () => {
  const soundscapeURL = 'http://localhost:3000/api/v1/soundscapes/'
  const soundURL = 'http://localhost:3000/api/v1/sounds/'
  const dropdownMenu = document.getElementById('dropdown')
  const buttonContainer = document.getElementById('button-container')
  const onOffButton = document.getElementById('on-off-button')
  const canvas = document.getElementById('audio-canvas')

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
        <button type="button" data-id="${sound.id}">${sound.name}</button>
      `
    })
  }

  const getOneSound = (id) => {
    fetch(soundURL + id)
      .then(response => response.json())
      .then(sound => {
        playSound(sound.source)
      })
  }

  const playSound = (src) => {
    let sound = new Audio(`sounds/${src}`)
    sound.dataset.source = `${src}`
    console.log(sound);
    sound.play()
  }

  const createNodes = () => {
    let osc = audioContext.createOscillator()
    let gain = audioContext.createGain()

    osc.connect(gain)
    gain.connect(audioContext.destination)

    osc.type = 'square'
    osc.frequency.value = 220
    gain.gain.value = 0.02

    osc.start()

    canvas.addEventListener('mousemove', (event) => {
      console.log(event);
      osc.frequency.value = event.clientX / 210 * 1000
    })
  }

  // const muteAll = () => {
  //   let sounds = document.getElementsByTagName('audio')
  //   for (let i = 0; i < sounds.length; i++) {
  //     sounds[i].pause()
  //   }
  // }

  dropdownMenu.addEventListener('change', (event) => {
    // muteAll()
    getOneSoundscape(event.target.value)
  })

  buttonContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      getOneSound(event.target.dataset.id);
    }
  })

  onOffButton.addEventListener('click', (event) => {
    // console.log('clicked');
    createNodes()
  })


  getSoundscapes()
});
