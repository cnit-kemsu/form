import { useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';

export function useArrayElement(arrayElement) {
  arrayElement._forceUpdate = useForceUpdate();
  
  useEffect(arrayElement.handleForceUpdateAssignment, []);

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
