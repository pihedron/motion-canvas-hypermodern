import { makeProject } from '@motion-canvas/core'
import WebCodecsExporter from 'motion-canvas-webcodecs'

import example from './scenes/example?scene'

import audio from './output.wav'

export default makeProject({
  scenes: [example],
  plugins: [
    WebCodecsExporter(),
  ],
  audio,
  experimentalFeatures: true,
})
