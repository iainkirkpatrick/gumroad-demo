// N.B. refer to https://github.com/ElMassimo/jumpstart-vite/blob/master/app/javascript/controllers/index.js and more generally https://vite-ruby.netlify.app/guide/rails.html for mixing vite-ruby with stimulus

import { Application } from "@hotwired/stimulus"
import { registerControllers } from 'stimulus-vite-helpers'

// Start the Stimulus application.
const application = Application.start()

// Controller files must be named *_controller.js.
const controllers = import.meta.glob("./**/*_controller.js", { eager: true });
registerControllers(application, controllers)