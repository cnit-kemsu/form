import { Composer } from './Composer';
import { transit } from './transit';
import { noUndefined, firstElement } from './_shared';

export class Composite extends Composer {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate) {
    super();

    this.handleBlur = this.handleBlur.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.forceUpdate = forceUpdate;
    transit(this, composer, name);
    this.validate = validate;

    this.currentError = error => error[this.name];
    this.testValidation();
  }

  testValidation() {
    const errors = this.composer.transitErrors.map(this.currentError)
      |> this.validate && [ this.validate(this.values), ...# ] || #
      |> #.filter(noUndefined);

    this.transitErrors = errors.map(firstElement).filter(noUndefined);

    const error = errors[0]?.[1];
    if (error !== undefined) this.composer.form.hasErrors = true;
    if (this.error !== error) {
      this.error = error;
      return true;
    }
    return false;
  }

  makeDirty() {
    if (!this.dirty) {
      this.dirty = true;
      return true;
    }
    return false;
  }

  update(callers) {
    this.composer.update([this, ...callers]);
  }

  handleBlur({ currentTarget, relatedTarget }) {
    const shoudUpdate = !this.touched
      && !relatedTarget?.attributes['data-control']
      && !currentTarget.contains(relatedTarget);
    if (shoudUpdate) {
      this.touched = true;
      this.forceUpdate();
    }
  }

  handleUpdate([caller, ...callers]) {
    const shoudUpdate = this.testValidation()
      |> (caller === this && (this.makeDirty() || callers.length === 0)) || #;
    this.updateEvent.publish(callers);
    if (shoudUpdate) this.forceUpdate();
    return shoudUpdate;
  }

  handleReset(prevValues) {
    const shoudUpdate = this.testValidation() || this.dirty || this.touched;
    this.dirty = false;
    this.touched = false;
    this.resetEvent.publish(prevValues?.[this.name]);
    if (shoudUpdate) this.forceUpdate();
    return shoudUpdate;
  }

  handleSubmit() {
    const shoudUpdate = this.error && (!this.dirty || !this.touched);
    this.submitEvent.publish();
    if (shoudUpdate) {
      this.dirty = true;
      this.touched = true;
      this.forceUpdate();
    }
    return shoudUpdate;
  }
}