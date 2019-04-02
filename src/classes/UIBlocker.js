// const blockerContainer = document.body;
// const blocker = document.createElement('div');
// blocker.style.position = 'fixed';
// blocker.style.top = '0px';
// blocker.style.left = '0px';
// blocker.style.width = '100%';
// blocker.style.height = '100%';
// blocker.style.backgroundColor = 'white';
// blocker.style.opacity = '0.25';
// blocker.style.zIndex = '1000000';
// blocker.style.cursor = 'progress';

// export class UIBlocker {

//   disabled = false;
//   static blockers = 0;

//   constructor(composer) {
//     this.composer = composer;

//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.handleComplete = this.handleComplete.bind(this);
//     this.unsubscribeFromEvents = this.unsubscribeFromEvents.bind(this);
//     this.handleSubscriptions = this.handleSubscriptions.bind(this);
//   }

//   enable() {
//     this.disabled = false;
//     UIBlocker.blockers--;
//     if (UIBlocker.blockers === 0) blockerContainer.removeChild(blocker);
//   }

//   disable() {
//     this.disabled = true;
//     if (UIBlocker.blockers === 0) blockerContainer.appendChild(blocker);
//     UIBlocker.blockers++;
//   }

//   get form() {
//     return this.composer.form;
//   }

//   handleSubmit() {
//     if (!this.form.hasErrors) this.disable();
//   }

//   handleComplete() {
//     if (this.disabled) this.enable();
//   }

//   subscribeToEvents() {
//     this.submitSub = this.form.submitEvent.subscribe(this.handleSubmit);
//     this.completeSub = this.form.completeEvent.subscribe(this.handleComplete);
//   }

//   unsubscribeFromEvents() {
//     this.submitSub.unsubscribe();
//     this.completeSub.unsubscribe();
//   }

//   handleSubscriptions() {
//     this.subscribeToEvents();
//     return this.unsubscribeFromEvents;
//   }
// }