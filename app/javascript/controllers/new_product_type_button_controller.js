import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [ "selectedProductType" ]

  setValue(event) {
    const value = event.currentTarget.dataset.value
    this.selectedProductTypeTarget.value = value
  }
}
