import { useMemo, useEffect } from 'react';
import { UIBlocker } from '../classes/ui-blocker';

export function useUIBlocker(composer) {

  const uiBlocker = useMemo(() => new UIBlocker(composer), []);

  useEffect(uiBlocker.handleSubscriptions, []);
}