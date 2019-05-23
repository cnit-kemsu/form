import { Publisher } from '@kemsu/publisher';

function copyObject(target) {
  const newObject = {};
  for (const key of Object.keys(target)) newObject[key] = copy(target[key]);
  return newObject;
}

function copy(target) {
  if (target instanceof Array) return target.map(copy);
  if (target instanceof Object) return copyObject(target);
  return target;
}

export class Form {
  submitErrors = undefined;
  updateEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();
  completeEvent = new Publisher();
  validateEvent = new Publisher();

  constructor(handleSubmit, validate, initialize, onSubmitted) {
    this.handleSubmit = handleSubmit;
    this._initialize = initialize;
    this._validate = validate;
    this.values = this.initialize();
    this.validate();
    this.onSubmitted = onSubmitted;

    this.reset = this.reset.bind(this);
    this.submit = this.submit.bind(this);
  }

  get form() {
    return this;
  }

  initialize() {
    if (this._initialize) return this._initialize() |> copy(#);
    return {};
  }

  validate() {
    this.errorStack = this._validate?.(this.values)
    |> # !== undefined && [#] || [];
  }

  update(...args) {
    this.hasErrors = false;
    this.validate();
    this.updateEvent.publish(...args);
    this.validateEvent.publish(false);
    //console.log('values:', this.values); //DEBUG
    //console.log('hasErrors:', this.hasErrors); //DEBUG
  }

  async submit() {
    this.submitEvent.publish();
    if (!this.hasErrors) {
      this.submitErrors = await this.handleSubmit?.(this.values);
      this.completeEvent.publish();
      if (this.onSubmitted !== undefined && this.submitErrors === undefined) this.onSubmitted();
    }
  }

  reset() {
    const prevValues = this.values;
    this.values = this.initialize();
    this.validate();
    this.resetEvent.publish(prevValues);
    this.validateEvent.publish(true);
  }

}