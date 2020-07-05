import { useMemo } from 'react';
import { Form } from '../lib/Form';

// export function useForm(handleSubmit, initialValues, validate, { deserialize, onSubmitted, onSubmitErrors } = {}) {
//   const form = useMemo(() => new Form(handleSubmit, validate, deserialize, onSubmitted, onSubmitErrors), []);
//   useMemo(() => form.initialize(initialValues), [initialValues]);
//   return form;
// }

export function useForm(handleSubmit, initialValues, validate, { deserialize, onSubmitted, onSubmitErrors, mapValues } = {}) {
  const form = useMemo(() => new Form(handleSubmit, validate, deserialize, onSubmitted, onSubmitErrors, mapValues), []);
  useMemo(() => form.initialize(initialValues), [initialValues]);
  return form;
}