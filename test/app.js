import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from '../src/hooks/useForm';
import { useField } from '../src/hooks/useField';
import { useCompound } from '../src/hooks/useCompound';
import { useFieldArray } from '../src/hooks/useFieldArray';
import { useFormStatus } from '../src/hooks/useFormStatus';
import { useUIBlocker } from '../src/hooks/useUIBlocker';

function validateForm({ firstname, data }) {
  if (firstname && data?.address?.city)
  if (firstname === data.address.city) return {
    firstname: 'Firstname must be distinct from city',
    data: {
      address: {
        city: 'City must be distinct from firstname'
      }
    }
  };
  return undefined;
}

function validateFirstname(value) {
  if (!value) return 'Firstname must be defined';
  if (value && value.split(' ').length > 1) return 'Firstname must contain one word';
  return undefined;
}

function validateCity(value) {
  if (!value) return 'City must be defined';
  return undefined;
}

function validatePassword({ original, confirm } = {}) {
  if (original && confirm) {
    if (original !== confirm) return [
      undefined,
      'Passwords must be identical'
    ];
  }
  return undefined;
}

function validateOriginalPassword(originalPassword) {
  if (originalPassword && originalPassword.length < 5) return 'Password must contain more than 5 characters';
  return undefined;
}

function validateFirends(friends) {
  if (friends?.length < 2) return [undefined, 'There must be at least 2 friends'];
  return undefined; 
}

function TextInput({ comp, name, validate, label }) {

  console.log('render TextInput:', name);
  const { value, error, touched, dirty, onChange, onBlur } = useField(comp, name, validate);
  
  return (
    <div style={{ padding: '5px', margin: '5px', width: 'fit-content', border: '1px solid black' }}>
      <div>
        {label}
      </div>
      <div>
        touched: {touched ? 'true' : 'false'}, dirty: {dirty ? 'true' : 'false'}
      </div>
      <div>
        <input value={value || ''} onChange={onChange} onBlur={onBlur} />
      </div>
      {error && <div style={touched && dirty ? { color: 'red' } : {}}>{error}</div>}
    </div>
  );
}
TextInput = React.memo(TextInput);

function Password({ comp }) {

  const [composer, { error, touched, dirty, onBlur }] = useCompound(comp, 'data.password', validatePassword);

  return (
    <div onBlur={onBlur} style={{ padding: '5px', margin: '5px', width: 'fit-content', border: '2px solid black' }}>
      <div>
        touched: {touched ? 'true' : 'false'}, dirty: {dirty ? 'true' : 'false'}
      </div>
      <div>
        <TextInput label="Password" comp={composer} name="original" validate={validateOriginalPassword}/>
        <TextInput label="Confirm password" comp={composer} name="confirm" />
      </div>
      <div>
        {error && <div style={touched && dirty ? { color: 'red' } : {}}>{error}</div>}
      </div>
    </div>
  );
}
Password = React.memo(Password);

function Friend({ element }) {

  console.log('render Friend:', element.composer.name);
  
  return (
    <div style={{ padding: '5px', margin: '5px', border: '2px solid black', width: 'fit-content' }}>
      <div style={{ display: 'flex' }}>
        <TextInput label="Firstname" comp={element.composer} name="firstname" />
        <TextInput label="Lastname" comp={element.composer} name="lastname" />
        <TextInput label="Middlename" comp={element.composer} name="middlename" />
        <TextInput label="Middlename1" comp={element.composer} name="middlename1" />
        <TextInput label="Middlename2" comp={element.composer} name="middlename2" />
      </div>
      <button data-control onClick={element.delete}>Delete</button>
    </div>
  );
}
Friend = React.memo(Friend);

function Friends({ comp }) {

  console.log('render Friends');
  const [{ map, push }, { error, dirty, touched, onBlur }] = useFieldArray(comp, 'friends', validateFirends);

  return (
    <div onBlur={onBlur} style={{ padding: '10px', border: '3px solid black', width: 'fit-content' }}>
      <div>
        touched: {touched ? 'true' : 'false'}, dirty: {dirty ? 'true' : 'false'}
      </div>
      <div>
        {map(element => (
            <Friend key={element.key} element={element} />
        ))}
      </div>
      {error && <div style={touched && dirty ? { color: 'red' } : {}}>{error}</div>}
      <div>
        <button data-control onClick={() => push()}>Add friend</button>
      </div>
    </div>
  );
}
Friends = React.memo(Friends);

function ResetButton({ comp }) {

  console.log('render ResetButton');
  const { dirty } = useFormStatus(comp);
  
  return (
    <button data-control disabled={!dirty} onClick={comp.reset}>Reset</button>
  );
}
ResetButton = React.memo(ResetButton);

function SubmitButton({ comp }) {

  console.log('render SubmitButton');
  const { hasErrors, touched } = useFormStatus(comp);
  
  return (
    <button data-control disabled={hasErrors && touched} onClick={comp.submit}>Submit</button>
  );
}
SubmitButton = React.memo(SubmitButton);

function SubmitErrors({ comp }) {

  console.log('render SubmitButton');
  const { submitErrors } = useFormStatus(comp);
  
  return <div style={{ color: 'red' }}>{submitErrors}</div>;
}
SubmitErrors = React.memo(SubmitErrors);

async function handleSubmit(values) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(values);
  if (values.firstname === 'John') return 'John is invalid firstname';
}

const initialize = () => ({
  firstname: 'John',
  friends: [
    {
      firstname: 'John',
      lastname: 'Cooper'
    }
  ]
});

function App() {

  console.log('render App');
  const form = useForm(handleSubmit, validateForm, initialize);
  //useUIBlocker(form);

  return (
    <div>
      {/* <div>
        <TextInput label="Firstname" comp={form} name="firstname" validate={validateFirstname}/>
      </div>
      <div>
        <TextInput label="City" comp={form} name="data.address.city" validate={validateCity}/>
      </div>
      <div>
       <Password comp={form} />
      </div> */}
      <div>
        <Friends comp={form}/>
      </div>
      <div>
        <SubmitErrors comp={form} />
      </div>
      <div style={{ display: 'flex', padding: '10px' }}>
        <ResetButton style={{ margin: '5px' }} comp={form} />
        <SubmitButton style={{ margin: '5px' }} comp={form} />
      </div>
    </div>
  );
}

const root = () => (
  <App />
);

ReactDOM.render(
  createElement(root),
  document.getElementById('root')
);
