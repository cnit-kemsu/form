import { useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';

export function useFieldElement(fieldElement) {
  fieldElement._forceUpdate = useForceUpdate();
  useEffect(fieldElement.handleForceUpdateAssignment, []);
  return {
    name: fieldElement.name,
    values: fieldElement.values,
    error: fieldElement.error,
    dirty: fieldElement.dirty,
    touched: fieldElement.touched,
    onChange: fieldElement.handleChange,
    onBlur: fieldElement.handleBlur
  };
}
