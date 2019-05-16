import React, { useMemo } from 'react';

export function useInitialize(form, initialize, deps) {
  useMemo(
    () => {
      form._initialize = initialize;
      form.values = form.initialize();
    },
    deps
  );
}