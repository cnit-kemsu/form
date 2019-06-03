import { Publisher } from '@kemsu/publisher';
import { copy } from './copy';

export class Form {
  submitErrors = undefined;
  initialValues = {};

  valuesChangeEvent = new Publisher();
  validateEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();
  completeEvent = new Publisher();

  constructor(handleSubmit, validate, onSubmitted, onSubmitErrors) {
    this.props = {
      handleSubmit,
      validate,
      onSubmitted,
      onSubmitErrors
    };

    this.reset = this.reset.bind(this);
    this.submit = this.submit.bind(this);
    this.submitOnEnterClick = this.submitOnEnterClick.bind(this);
  }

  get form() {
    return this;
  }

  initialize(values) {
    if (values != null) this.initialValues = values;
    this.values = copy(this.initialValues);
    this.hasErrors = false;
    this.validate();
  }

  validate() {
    this.errors = this.props.validate?.(this.values)
    |> # == null && [] || [#];
  }

  dispatchValuesChangeEvent(...callers) {
    this.hasErrors = false;
    this.validate();
    this.valuesChangeEvent.publish(...callers);
    this.validateEvent.publish(false);
  }

  async submit() {
    this.submitEvent.publish();
    if (!this.hasErrors) {
      this.submitErrors = await this.props.handleSubmit?.(this.values);
      this.completeEvent.publish();
      if (this.submitErrors == null) this.props.onSubmitted?.(this.values);
      else this.props.onSubmitErrors?.(this.submitErrors);
    }
  }

  reset() {
    const prevValues = this.values;
    this.initialize();
    this.resetEvent.publish(prevValues);
    this.validateEvent.publish(true);
  }

  submitOnEnterClick(event) {
    if (event.key === 'Enter') this.submit();
  }
}