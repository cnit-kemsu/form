import { Composer } from './Composer';
import { transit } from './transit';
import { notNull, firstElement } from './_shared';

export class Composite extends Composer {
  dirty = false;
  touched = false;

  constructor(forceUpdate, composer, name, validate) {
    super(forceUpdate, ...transit(composer, name));

    this.handleBlur = this.handleBlur.bind(this);
    this.validate = validate;
    this.error = this._validate();
  }

  handleBlur({ currentTarget, relatedTarget }) {
    if (!this.touched
      && !relatedTarget?.attributes['data-control']
      && !currentTarget.contains(relatedTarget)
    ) {
      this.touched = true;
      this.forceUpdate();
    }
  }

  _validate() {
    const errors = [
      this.validate?.(this.values),
      ...this.currentErrors
    ].filter(notNull);

    this.errors = errors.map(firstElement).filter(notNull);
    const error = errors[0]?.[1];
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

  shouldUpdateOnValuesChange(caller, ...callers) {
    return this.shoudUpdateError() || (caller === this && (!this.dirty || callers.length === 0));
  }

  shouldUpdateOnReset() {
    return this.shoudUpdateError() || this.dirty || this.touched;
  }

  shouldUpdateOnSubmit() {
    if (this.error && (!this.dirty || !this.touched)) {
      this.dirty = true;
      this.touched = true;
      return true;
    }
    return false;
  }

  handleValuesChange(caller, ...callers) {
    if (caller === this) this.dirty = true;
    super.handleValuesChange(caller, ...callers);
  }

  handleReset(prevValues) {
    this.dirty = false;
    this.touched = false;
    super.handleReset(prevValues);
  }
}