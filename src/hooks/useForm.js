import { useMemo } from 'react';
import { Form } from '../lib/Form';

export function useForm(handleSubmit, initialValues, validate, { onSubmitted, onSubmitErrors } = {}) {
  const form = useMemo(() => new Form(handleSubmit, validate, onSubmitted, onSubmitErrors), []);
  useMemo(() => form.initialize(initialValues), [initialValues]);
  return form;
}
