import { Composite } from './Composite';

export class ArrayElement extends Composite {
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
    const { composer, name } = this.props;
    this.unsubscribeFromEvents();
    composer.elements.splice(name, 1);
    composer.values.splice(name, 1);
    for (let index = name; index < composer.elements.length; index++) {
      composer.elements[index].props.name = index;
    }
    composer.props.composer.dispatchValuesChangeEvent(composer);
  }

  handleChange(values) {
    this.values = values;
    this.props.composer.dispatchValuesChangeEvent(this);
  }

  handleForceUpdateAssignment() {
    this.props.forceUpdate = this._forceUpdate;
    delete this._forceUpdate;
    return () => { this.props.forceUpdate = null; };
  }
}