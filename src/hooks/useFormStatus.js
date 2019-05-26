import { useMemo, useEffect } from 'react';
import { useForceUpdate } from '@kemsu/force-update';
import { FormStatus } from '@lib/FormStatus';

export function useFormStatus(composer) {

  const forceUpdate = useForceUpdate();
  const formStatus = useMemo(() => new FormStatus(forceUpdate, composer), []);

  useEffect(formStatus.handleSubscriptions, []);
  
  return {
    hasErrors: formStatus.hasErrors,
    dirty: formStatus.dirty,
    touched: formStatus.touched,
    submitErrors: formStatus.submitErrors
  };
}