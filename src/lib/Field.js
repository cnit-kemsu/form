import { Subscriber } from './Subscriber';
import { transit } from './transit';
import { copy } from './copy';

export class Field extends Subscriber {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate, handleValue, serialize) {
    super(forceUpdate, ...transit(composer, name), validate);

    this.props.handleValue = handleValue;
    this.props.serialize = serialize;
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

  get initialValue() {
    return this.props.composer.initialValues?.[this.props.name];
  }
  setSerializedValue(serializedValue) {
    const { name, composer } = this.props;
    if (composer.serializedValues == null) composer.serializedValues = copy(composer.values);
    composer.serializedValues[name] = serializedValue;
  }

  handleChange(event) {
    const { composer, handleValue } = this.props;

    this.value = handleValue(event);
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

  handleValidation() {
    return this.validate(this.value)[0];
  }

  serialize() {
    if (this.props.serialize) {
      const serializedValue = this.props.serialize(this.value);
      this.setSerializedValue(serializedValue);
    }
    else this.setSerializedValue(this.value);
  }

  handleSerialize() {
    if (this.dirty && this.value !== this.initialValue) this.serialize();
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