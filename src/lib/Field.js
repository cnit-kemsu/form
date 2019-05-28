import { Subscriber } from './Subscriber';
import { transit } from './transit';
import { notNull } from './_shared';

export class Field extends Subscriber {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate, getValue) {
    const [_composer, _name] = transit(composer, name);
    super(forceUpdate, _composer);
    this.name = _name;

    this.validate = validate;
    this.getValue = getValue;
    this.error = this._validate();

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  get value() {
    return this.composer.values?.[this.name];
  }

  set value(value) {
    if (!this.composer.values) this.composer.values = {};
    this.composer.values[this.name] = value;
  }

  _validate() {
    const error = [
      this.validate?.(this.value),
      ...this.composer.errors.map(this.currentError)
    ].filter(notNull)[0];

    if (error != null) this.composer.form.hasErrors = true;

    return error;
  }

  shoudUpdateError() {
    const error = this._validate();
    if (this.error !== error) {
      this.error = error;
      return true;
    }
    return false;
  }

  handleChange(event) {
    this.value = this.getValue(event);
    this.dirty = true;
    this.composer.dispatchValuesChangeEvent(this);
  }

  handleBlur({ relatedTarget }) {
    if (!this.touched
      && !relatedTarget?.attributes['data-control']
    ) {
      this.touched = true;
      this.forceUpdate();
    }
  }

  shouldUpdateOnValuesChange(caller) {
    return this.shoudUpdateError() || caller === this;
  }

  shouldUpdateOnReset(prevValues) {
    return this.shoudUpdateError() || this.dirty || this.touched || prevValues?.[this.name] !== this.value;
  }

  shouldUpdateOnSubmit() {
    if (this.error && (!this.dirty || !this.touched)) {
      this.dirty = true;
      this.touched = true;
      return true;
    }
    return false;
  }

  handleReset(prevValues) {
    this.dirty = false;
    this.touched = false;
    super.handleReset(prevValues);
  }
}