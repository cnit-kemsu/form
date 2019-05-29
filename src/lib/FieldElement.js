import { Composite } from './Composite';

export class FieldElement extends Composite {
  constructor(composer, name, validate, key) {
    super(null, composer, name, validate);

    this.props.key = key;
    this.delete = this.delete.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  get key() {
    return this.props.key;
  }

  delete() {
    this.props.composer.deleteElement(this);
  }

  handleChange(values) {
    this.values = values;
    this.props.composer.dispatchValuesChangeEvent(this);
  }

  handleForceUpdateAssignment() {
    this.props.forceUpdate = this.forceUpdate;
    delete this.forceUpdate;
    return () => { this.props.forceUpdate = null; };
  }
}