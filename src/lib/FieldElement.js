import { Composite } from './Composite';

export class FieldElement extends Composite {
  constructor(composer, name, validate, key) {
    super(null, composer, name, validate);

    this.key = key;
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  delete() {
    this.composer.deleteElement(this);
  }

  handleChange(values) {
    this.values = values;
    this.composer.dispatchValuesChangeEvent(this);
  }

  handleForceUpdateAssignment() {
    this.forceUpdate = this._forceUpdate;
    return () => {
      this.forceUpdate = null;
      delete this._forceUpdate;
    };
  }
}