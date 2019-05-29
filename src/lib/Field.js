import { Subscriber } from './Subscriber';
import { transit } from './transit';

export class Field extends Subscriber {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate, getValue) {
    super(forceUpdate, ...transit(composer, name), validate);

    this.props.getValue = getValue;
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  get value() {
    return this.props.composer.values?.[this.props.name];
  }

  set value(value) {
    if (!this.props.composer.values) this.props.composer.values = {};
    this.props.composer.values[this.props.name] = value;
  }

  handleChange(event) {
    this.value = this.props.getValue(event);
    this.dirty = true;
    this.props.composer.dispatchValuesChangeEvent(this);
  }

  handleBlur({ relatedTarget }) {
    if (!this.touched
      && !relatedTarget?.attributes['data-control']
    ) {
      this.touched = true;
      this.props.forceUpdate();
    }
  }

  handleValidation() {
    return this.validate(this.value)[0];
  }

  shouldUpdateOnValuesChange(error, caller) {
    return this.error !== error || caller === this;
  }

  shouldUpdateOnReset(error, prevValue) {
    return this.error !== error || this.dirty || this.touched || prevValue !== this.value;
  }

  shouldUpdateOnSubmit() {
    return this.error && (!this.dirty || !this.touched);
  }

  handleValuesChange(error, caller) {
    this.error = error;
    if (caller === this) this.dirty = true;
  }

  handleReset(error) {
    this.error = error;
    this.dirty = false;
    this.touched = false;
  }

  handleSubmit() {
    if (this.error) {
      this.dirty = true;
      this.touched = true;
    }
  }
}