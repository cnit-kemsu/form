import { Subscriber } from './Subscriber';
import { transit } from './transit';
import { noUndefined } from './_shared';

export class Field extends Subscriber {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate, getValue) {
    super();

    this.forceUpdate = forceUpdate;
    transit(this, composer, name);
    this.validate = validate;
    this.getValue = getValue;

    this.currentError = error => error[this.name];
    this.testValidation();

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get value() {
    return this.composer.values?.[this.name];
  }

  set value(value) {
    if (!this.composer.values) this.composer.values = {};
    this.composer.values[this.name] = value;
  }

  testValidation() {
    const error = this.composer.transitErrors.map(this.currentError)
      |> this.validate && [ this.validate(this.values), ...# ] || #
      |> #.filter(noUndefined)
      |> #[0];
    
    if (error !== undefined) this.composer.form.hasErrors = true;
    if (this.error !== error) {
      this.error = error;
      return true;
    }
    return false;
  }

  handleChange(event) {
    this.value = this.getValue(event);
    this.dirty = true;
    this.composer.update(this);
  }

  handleBlur({ relatedTarget }) {
    const shoudUpdate = !this.touched && !relatedTarget?.attributes['data-control'];
    if (shoudUpdate) {
      this.touched = true;
      this.forceUpdate();
    }
  }

  handleUpdate(caller) {
    const shoudUpdate = this.testValidation() || caller === this;
    if (shoudUpdate) this.forceUpdate();
  }

  handleReset(prevValues) {
    const shoudUpdate = this.testValidation()
      || this.dirty 
      || this.touched
      || prevValues?.[this.name] !== this.value;
    if (shoudUpdate) {
      this.dirty = false;
      this.touched = false;
      this.forceUpdate();
    }
  }

  handleSubmit() {
    const shoudUpdate = this.error && (!this.dirty || !this.touched);
    if (shoudUpdate) {
      this.dirty = true;
      this.touched = true;
      this.forceUpdate();
    }
  }
}