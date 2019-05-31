import { useForceUpdate } from '@kemsu/force-update';

export function useArrayElement(arrayElement) {
  arrayElement.props.forceUpdate = useForceUpdate();

  return {
    name: arrayElement.name,
    values: arrayElement.values,
    error: arrayElement.error,
    dirty: arrayElement.dirty,
    touched: arrayElement.touched,
    onChange: arrayElement.handleChange,
    onBlur: arrayElement.handleBlur
  };
}
