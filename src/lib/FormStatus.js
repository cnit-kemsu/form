export class FormStatus {

  dirty = false;
  touched = false;
  submitErrors = undefined;

  constructor(forceUpdate, composer) {
    this.forceUpdate = forceUpdate;
    this.composer = composer;

    this.handleValidate = this.handleValidate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
    this.handleSubscriptions = this.handleSubscriptions.bind(this);
  }

  get form() {
    return this.composer.form;
  }

  handleValidate(resetEvent) {
    if (resetEvent) {
      if (this.hasErrors !== this.form.hasErrors || this.dirty || this.touched) {
        this.hasErrors = this.form.hasErrors;
        this.dirty = false;
        this.touched = false;
        this.forceUpdate();
      }
    } else if (this.hasErrors !== this.form.hasErrors || !this.dirty) {
      this.dirty = true;
      this.hasErrors = this.form.hasErrors;
      this.forceUpdate();
    }
  }

  handleSubmit() {
    if (!this.form.hasErrors) {
      this.touched = true;
      this.submitErrors = undefined;
      this.forceUpdate();
    } else if (!this.touched) {
      this.touched = true;
      this.hasErrors = this.form.hasErrors;
      this.forceUpdate();
    }
  }

  handleComplete() {
    if (this.form.submitErrors !== undefined) {
      this.submitErrors = this.form.submitErrors;
      this.forceUpdate();
    }
  }

  subscribeToEvents() {
    this.validateSub = this.form.validateEvent.subscribe(this.handleValidate);
    this.submitSub = this.form.submitEvent.subscribe(this.handleSubmit);
    this.completeSub = this.form.completeEvent.subscribe(this.handleComplete);
  }

  unsubscribeFromEvents() {
    this.validateSub.unsubscribe();
    this.submitSub.unsubscribe();
    this.completeSub.unsubscribe();
  }

  handleSubscriptions() {
    this.subscribeToEvents();
    return this.unsubscribeFromEvents;
  }
}