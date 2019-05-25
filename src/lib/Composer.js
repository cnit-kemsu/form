import { Publisher } from '@kemsu/publisher';
import { Subscriber } from './Subscriber';

export class Composer extends Subscriber {
  updateEvent = new Publisher();
  resetEvent = new Publisher();
  submitEvent = new Publisher();

  get form() {
    return this.composer.form;
  }

  get values() {
    return this.composer.values?.[this.name];
  }

  set values(values) {
    if (this.composer.values === undefined || this.composer.values === null) this.composer.values = {};
    this.composer.values[this.name] = values;
  }
}