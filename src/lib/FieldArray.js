import { Composite } from './Composite';
import { Transistor } from './Transistor';

export class FieldArray extends Composite {
  elements = [];

  constructor(forceUpdate, composer, name, validate) {
    super(forceUpdate, composer, name, validate);

    this.push = this.push.bind(this);
    this.deleteElement = this.deleteElement.bind(this);

    this.resetElements();
  }

  handleReset(prevValues) {
    const shoudUpdate = this.resetElements();
    if (!super.handleReset(prevValues) && shoudUpdate) this.forceUpdate;
  }

  nextKey() {
    return this.elements.length ? this.elements[this.elements.length - 1].key + 1 : 0;
  }

  createElement() {
    const element = {
      key: this.nextKey(),
      composer: new Transistor(this, this.elements.length)
    };
    element.delete = () => this.deleteElement(element);
    this.elements.push(element);
    return element;
  }

  push(value) {
    if (this.values === undefined || this.values === null) this.values = [];
    this.values.push(value);
    const element = this.createElement();
    this.composer.update([this]);
    element.composer.subscribeToEvents();
  }

  deleteElement(element) {
    this.values.splice(element.composer.name, 1);
    this.elements.splice(element.composer.name, 1);
    element.composer.unsubscribeFromEvents();
    for (let index = element.composer.name; index < this.elements.length; index++) {
      this.elements[index].composer.name = index;
    }
    this.composer.update([this]);
  }

  resetElements() {
    const initialLength = this.values === undefined || this.values === null ? 0 : this.values.length;
    const difference = this.elements.length - initialLength;
    if (difference > 0) {
      for (let index = initialLength; index < this.elements.length; index++) {
        this.elements[index].composer.unsubscribeFromEvents();
      }
      this.elements.splice(initialLength, difference);
    } else if (difference < 0) {
      for (let index = -difference; index > 0; index--) {
        const element = this.createElement();
        element.composer.subscribeToEvents();
      }
    }
    if (difference !== 0) return true;
    return false;
  }
}