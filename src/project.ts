import { makeProject } from '@motion-canvas/core'

import example from './scenes/example?scene'

import audio from './output.wav'

export default makeProject({
  scenes: [example],
  audio,
})
