import { useMemo } from 'react';
import { Form } from '../classes/Form';

function defaultInitializeFn() { return {}; }
export function useForm(handleSubmit, validate, initialize = defaultInitializeFn, onSubmitted) {
  const form = useMemo(() => new Form(handleSubmit, validate, initialize, onSubmitted), []);
  return form;
}
