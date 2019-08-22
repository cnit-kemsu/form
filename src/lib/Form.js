import { Publisher } from '@kemsu/publisher';
import { copy } from './copy';

export class Form {
  submitErrors = undefined;
  initialValues = {};
  serializedValues = {};

  valuesChangeEvent = new Publisher();
  validateEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();
  serializeEvent = new Publisher();
  completeEvent = new Publisher();

  constructor(handleSubmit, validate, deserialize, onSubmitted, onSubmitErrors, forceSerialize) {
    this.props = {
      handleSubmit,
      validate,
      onSubmitted,
      onSubmitErrors,
      deserialize,
      forceSerialize
    };

    this.reset = this.reset.bind(this);
    this.submit = this.submit.bind(this);
    this.submitOnEnterClick = this.submitOnEnterClick.bind(this);
  }

  get form() {
    return this;
  }

  initialize(initialValues) {
    if (initialValues != null) this.initialValues = initialValues;
    this.values = copy(this.initialValues);
    this.props.deserialize?.(this.values);
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
      this.serializeEvent.publish(this.props.forceSerialize);
      this.submitErrors = await this.props.handleSubmit?.(this.serializedValues);
      this.completeEvent.publish();
      if (this.submitErrors == null) this.props.onSubmitted?.(this.serializedValues);
      else this.props.onSubmitErrors?.(this.submitErrors, this.serializedValues);
      this.serializedValues = {};
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