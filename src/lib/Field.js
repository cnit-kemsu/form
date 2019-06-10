import { Subscriber } from './Subscriber';
import { transit } from './transit';

export class Field extends Subscriber {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate, getValue, deserialize) {
    super(forceUpdate, ...transit(composer, name), validate, deserialize);

    this.props.getValue = getValue;
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  get value() {
    return this.props.composer.values?.[this.props.name];
  }

  set value(value) {
    if (this.props.composer.values == null) this.props.composer.values = {};
    this.props.composer.values[this.props.name] = value;
  }

  handleChange(event) {
    const { composer, name, getValue } = this.props;

    this.value = getValue(event);
    if (composer.diffValues != null) composer.diffValues[name] = this.value;
    this.dirty = true;
    composer.dispatchValuesChangeEvent(this);
  }

  handleBlur({ relatedTarget }) {
    if (!this.touched
      && !relatedTarget?.attributes['data-control']
    ) {
      this.touched = true;
      this.props.forceUpdate();
    }
  }

  deserialize() {
    if (this.props.deserialize) this.value = this.props.deserialize(this.value);
  }

  handleValidation() {
    this.deserialize();
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

  handleValuesChange(error) {
    this.error = error;
  }

  handleReset(error) {
    this.deserialize();
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