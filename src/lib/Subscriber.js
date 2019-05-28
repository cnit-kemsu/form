export class Subscriber {
  constructor(forceUpdate, composer) {
    this.forceUpdate = forceUpdate;
    this.composer = composer;

    this.currentError = this.currentError.bind(this);
    this.shouldUpdateOnValuesChange = this.shouldUpdateOnValuesChange.bind(this);
    this.shouldUpdateOnReset = this.shouldUpdateOnReset.bind(this);
    this.shouldUpdateOnSubmit = this.shouldUpdateOnSubmit.bind(this);
    this.handleValuesChange = this.handleValuesChange.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.subscribeToEvents = this.subscribeToEvents.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  currentError(errors) {
    return errors[this.name];
  }

  shouldUpdateOnValuesChange() { return false; }
  shouldUpdateOnReset() { return false; }
  shouldUpdateOnSubmit() { return false; }

  handleValuesChange(...callers) {
    if (this.shouldUpdateOnValuesChange(...callers)) this?.forceUpdate();
  }

  handleReset(prevValues) {
    if (this.shouldUpdateOnReset(prevValues)) this?.forceUpdate();
  }

  handleSubmit() {
    if (this.shouldUpdateOnSubmit()) this?.forceUpdate();
  }

  subscribeToEvents() {
    if (this.composer.constructor.name === 'Transistor') this.composer.subscribeToEvents();
    this.valuesChangeSub = this.composer.valuesChangeEvent.subscribe(this.handleValuesChange);
    this.resetSub = this.composer.resetEvent.subscribe(this.handleReset);
    this.submitSub = this.composer.submitEvent.subscribe(this.handleSubmit);
  }

  unsubscribeFromEvents() {
    this.valuesChangeSub.unsubscribe();
    this.resetSub.unsubscribe();
    this.submitSub.unsubscribe();
    if (this.composer.constructor.name === 'Transistor') this.composer.unsubscribeFromEvents();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}