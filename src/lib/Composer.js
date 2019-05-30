import { Publisher } from '@kemsu/publisher';
import { Subscriber } from './Subscriber';

export class Composer extends Subscriber {
  valuesChangeEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();

  get form() {
    return this.props.composer.form;
  }

  get values() {
    return this.props.composer.values?.[this.props.name];
  }

  set values(values) {
    if (this.props.composer.values == null) this.props.composer.values = {};
    this.props.composer.values[this.props.name] = values;
  }

  dispatchValuesChangeEvent(...callers) {
    this.props.composer.dispatchValuesChangeEvent(this, ...callers);
  }

  handleValuesChange(error, caller, ...callers) {
    this.valuesChangeEvent.publish(...callers);
  }

  handleReset(error, prevValues) {
    this.resetEvent.publish(prevValues);
  }

  handleSubmit() {
    this.submitEvent.publish();
  }
}