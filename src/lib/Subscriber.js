import { notNull } from './_shared';

export class Subscriber {
  error = undefined;

  constructor(forceUpdate, composer, name, validate) {
    this.props = {
      forceUpdate,
      composer,
      name,
      validate
    };

    this.currentError = this.currentError.bind(this);
    this.handleValuesChangeEvent = this.handleValuesChangeEvent.bind(this);
    this.handleResetEvent = this.handleResetEvent.bind(this);
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);

    this.error = this.handleValidation?.();
  }

  currentError(errors) {
    return errors[this.props.name];
  }

  validate(target) {
    return this.props.composer.errors.map(this.currentError)
    |> this.props.validate == null && # || [this.props.validate(target), ...#]
    |> #.filter(notNull);
  }

  handleValuesChangeEvent(...callers) {
    const error = this.handleValidation?.();
    if (error != null) this.props.composer.form.hasErrors = true;

    if (this.shouldUpdateOnValuesChange?.(error, ...callers)) {
      this.handleValuesChange?.(error, ...callers);
      this.props.forceUpdate?.();
    }
  }

  handleResetEvent(prevValues) {
    const error = this.handleValidation?.();
    if (error != null) this.props.composer.form.hasErrors = true;

    const currentValues = prevValues?.[this.props.name];
    if (this.shouldUpdateOnReset?.(error, currentValues)) {
      this.handleReset?.(error, currentValues);
      this.props.forceUpdate?.();
    }
  }

  handleSubmitEvent() {
    if (this.shouldUpdateOnSubmit?.()) {
      this.handleSubmit?.();
      this.props.forceUpdate?.();
    }
  }

  subscribeToEvents() {
    if (this.props.composer.constructor.name === 'Transistor') this.props.composer.subscribeToEvents();
    this.valuesChangeSub = this.props.composer.valuesChangeEvent.subscribe(this.handleValuesChangeEvent);
    this.resetSub = this.props.composer.resetEvent.subscribe(this.handleResetEvent);
    this.submitSub = this.props.composer.submitEvent.subscribe(this.handleSubmitEvent);
  }

  unsubscribeFromEvents() {
    this.valuesChangeSub.unsubscribe();
    this.resetSub.unsubscribe();
    this.submitSub.unsubscribe();
    if (this.props.composer.constructor.name === 'Transistor') this.props.composer.unsubscribeFromEvents();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}