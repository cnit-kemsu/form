import React, { createElement } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from '@hooks/useForm';
import { useField } from '@hooks/useField';
import { useComposite } from '@hooks/useComposite';
import { useFieldArray } from '@hooks/useFieldArray';
// import { useFormStatus } from '@hooks/useFormStatus';
import Fields from '@components/Fields';

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

function validatePasswords({ password, confirmPassword } = {}) {
  if (password && confirmPassword) {
    if (password !== confirmPassword) return [
      undefined,
      'Passwords must be identical'
    ];
  }
  return undefined;
}

function validatePassword(password) {
  if (password && password.length < 5) return 'Password must contain more than 5 characters';
  return undefined;
}

function validateFirends(friends) {
  if (friends?.length < 2) return [undefined, 'There must be at least 2 friends'];
  return undefined; 
}

function TextInput({ of: composer, name, validate, label }) {

  console.log('render TextInput:', name);
  const { value, error, touched, dirty, onChange, onBlur } = useField(composer, name, validate);
  
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

function Passwords({ of: form }) {

  console.log('render Passwords');
  const [passwords, { error, touched, dirty, onBlur }] = useComposite(form, 'data.passwords', validatePasswords);

  return (
    <div onBlur={onBlur} style={{ padding: '5px', margin: '5px', width: 'fit-content', border: '2px solid black' }}>
      <div>
        touched: {touched ? 'true' : 'false'}, dirty: {dirty ? 'true' : 'false'}
      </div>
      <div>
        <TextInput label="Password" of={passwords} name="password" validate={validatePassword}/>
        <TextInput label="Confirm password" of={passwords} name="confirmPassword" />
      </div>
      <div>
        {error && <div style={touched && dirty ? { color: 'red' } : {}}>{error}</div>}
      </div>
    </div>
  );
}
Passwords = React.memo(Passwords);

function Friend({ of: friend }) {

  console.log('render Friend:', friend.props.name);
  
  return (
    <div style={{ padding: '5px', margin: '5px', border: '2px solid black', width: 'fit-content' }}>
      <div style={{ display: 'flex' }}>
        <TextInput label="Firstname" of={friend} name="firstname" />
        <TextInput label="Lastname" of={friend} name="lastname" />
      </div>
      <button data-control onClick={friend.delete}>Delete</button>
    </div>
  );
}
Friend = React.memo(Friend);

function Friends({ of: composer }) {

  console.log('render Friends');
  const [firends, { map, push, error, dirty, touched, onBlur }] = useFieldArray(composer, 'friends', validateFirends);

  return (
    <div onBlur={onBlur} style={{ padding: '10px', border: '3px solid black', width: 'fit-content' }}>
      <div>
        touched: {touched ? 'true' : 'false'}, dirty: {dirty ? 'true' : 'false'}
      </div>
      <div>
        {map((key, friend) => (
            <Friend key={key} of={friend} />
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

// function ResetButton({ comp }) {

//   console.log('render ResetButton');
//   const { dirty } = useFormStatus(comp);
  
//   return (
//     <button data-control disabled={!dirty} onClick={comp.reset}>Reset</button>
//   );
// }
// ResetButton = React.memo(ResetButton);

// function SubmitButton({ comp }) {

//   console.log('render SubmitButton');
//   const { hasErrors, touched } = useFormStatus(comp);
  
//   return (
//     <button data-control disabled={hasErrors && touched} onClick={comp.submit}>Submit</button>
//   );
// }
// SubmitButton = React.memo(SubmitButton);

// function SubmitErrors({ comp }) {

//   console.log('render SubmitButton');
//   const { submitErrors } = useFormStatus(comp);
  
//   return <div style={{ color: 'red' }}>{submitErrors}</div>;
// }
// SubmitErrors = React.memo(SubmitErrors);

 function ResetButton({ comp }) {
  
  return (
    <button data-control onClick={comp.reset}>Reset</button>
  );
}
ResetButton = React.memo(ResetButton);

function SubmitButton({ comp }) {
  
  return (
    <button data-control onClick={comp.submit}>Submit</button>
  );
}
SubmitButton = React.memo(SubmitButton);

async function handleSubmit(values) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log(values);
  if (values.firstname === 'John') return 'John is invalid firstname';
}

const initValues = {
  firstname: 'John',
  friends: [
    {
      firstname: 'John',
      lastname: 'Cooper'
    }
  ]
};

function App() {

  console.log('render App');
  const form = useForm(handleSubmit, initValues, validateForm);

  return (
    <div><Fields of={form}>
      <div>
        <TextInput label="Firstname" name="firstname" validate={validateFirstname}/>
      </div>
      <div>
        <TextInput label="City" name="data.address.city" validate={validateCity}/>
      </div>
      <div>
       <Passwords/>
      </div>
      <div>
        <Friends/>
      </div>
      {/* <div>
        <SubmitErrors comp={form} />
      </div> */}
      <div style={{ display: 'flex', padding: '10px' }}>
        <ResetButton style={{ margin: '5px' }} comp={form} />
        <SubmitButton style={{ margin: '5px' }} comp={form} />
      </div>
      </Fields></div>
  );
}

const root = () => (
  <App />
);

ReactDOM.render(
  createElement(root),
  document.getElementById('root')
);
