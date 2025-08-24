import { makeProject } from '@motion-canvas/core'
import WebCodecsExporter from 'motion-canvas-webcodecs'

import example from './scenes/example?scene'
import algebra from './scenes/algebra?scene'

import audio from './output.wav'

export default makeProject({
  scenes: [example, algebra],
  plugins: [
    WebCodecsExporter(),
  ],
  audio,
  experimentalFeatures: true,
})
