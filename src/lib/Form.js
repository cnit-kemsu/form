import { Publisher } from '@kemsu/publisher';
import { copy } from './copy';

export class Form {
  submitErrors = undefined;
  valuesChangeEvent = new Publisher();
  validateEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();
  completeEvent = new Publisher();

  constructor(handleSubmit, initialValues, validate, { onSubmitted, onSubmitErrors } = {}) {
    this.handleSubmit = handleSubmit;
    this.initialValues = initialValues;
    this.validate = validate;
    this.onSubmitted = onSubmitted;
    this.onSubmitErrors = onSubmitErrors;

    this.reset = this.reset.bind(this);
    this.submit = this.submit.bind(this);

    this.initialize();
    this._validate();
  }

  get form() {
    return this;
  }

  initialize() {
    this.values = this.initialValues ? copy(this.initialValues) : {};
  }

  _validate() {
    this.errors = this.validate?.(this.values)
      |> # == null && [] || [#];
  }

  dispatchValuesChangeEvent(...callers) {
    this.hasErrors = false;
    this._validate();
    this.valuesChangeEvent.publish(...callers);
    this.validateEvent.publish(false);

    //console.log('values:', this.values); //DEBUG
    //console.log('hasErrors:', this.hasErrors); //DEBUG
  }

  async submit() {
    this.submitEvent.publish();
    if (!this.hasErrors) {
      this.submitErrors = await this.handleSubmit?.(this.values);
      this.completeEvent.publish();
      if (this.submitErrors === undefined) this.onSubmitted?.(this.values);
      else this.onSubmitErrors?.(this.submitErrors);
    }
  }

  reset() {
    const prevValues = this.values;
    this.initialize();
    this._validate();
    this.resetEvent.publish(prevValues);
    this.validateEvent.publish(true);
  }

}