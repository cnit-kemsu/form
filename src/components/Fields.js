import React from 'react';

export const FieldContext = React.createContext();

function Fields({ of: composer, children }) {

  return <FieldContext.Provider value={composer}>
    {children}
  </FieldContext.Provider>;
}

export default React.memo(Fields);