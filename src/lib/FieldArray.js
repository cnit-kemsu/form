import { Composite } from './Composite';
import { FieldElement } from './FieldElement';

export class FieldArray extends Composite {
  elements = [];

  constructor(forceUpdate, composer, name, validate, validateElement) {
    super(forceUpdate, composer, name, validate);

    this.props.validateElement = validateElement;
    this.push = this.push.bind(this);
    this.deleteElement = this.deleteElement.bind(this);

    if (this.values?.length) this.elements.push(
      ...this.values.map(
        (value, index) => {
          const element = new FieldElement(this, String(index), this.props.validateElement, index);
          element.subscribeToEvents();
          return element;
        }
      )
    );
  }

  get nextKey() {
    return this.elements.length ? this.elements[this.elements.length - 1].key + 1 : 0;
  }

  push(value) {
    if (this.values == null) this.values = [];
    this.values.push(value);
    this.props.composer.dispatchValuesChangeEvent(this);
  }

  deleteElement(element) {
    element.unsubscribeFromEvents();
    this.elements.splice(element.name, 1);
    this.values.splice(element.name, 1);
    for (let index = element.name; index < this.elements.length; index++) {
      this.elements[index].name = index;
    }
    this.props.composer.dispatchValuesChangeEvent(this);
  }

  shouldUpdateOnValuesChange(...args) {
    if (this.elements.length !== this.values.length) return true;
    return super.shouldUpdateOnValuesChange(...args);
  }

  shouldUpdateOnReset(...args) {
    if (this.elements.length !== (this.values?.length || 0)) return true;
    return super.shouldUpdateOnReset(...args);
  }

  handleValuesChange(...args) {
    let element;
    if (this.values.length !== this.elements.length) {
      element = new FieldElement(this, String(this.elements.length), this.props.validateElement, this.nextKey);
      this.elements.push(element);
    }
    super.handleValuesChange(...args);
    element?.subscribeToEvents();
  }

  handleReset(error, prevValues) {
    const initialLength = this.values?.length || 0;
    const difference = this.elements.length - initialLength;
    if (difference > 0) {
      for (let index = initialLength; index < this.elements.length; index++) this.elements[index].unsubscribeFromEvents();
      this.elements.splice(initialLength, difference);
    } else {
      for (let index = -difference; index > 0; index--) {
        const element = new FieldElement(this, String(this.elements.length), this.props.validateElement, this.nextKey);
        element.subscribeToEvents();
        this.elements.push(element);
      }
    }
    super.handleReset(error, prevValues);
  }
}