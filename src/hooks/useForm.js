import { useMemo } from 'react';
import { Form } from '../lib/Form';

export function useForm(handleSubmit, initialValues, validate, options) {
  const form = useMemo(() => new Form(handleSubmit, initialValues, validate, options), []);
  return form;
}
