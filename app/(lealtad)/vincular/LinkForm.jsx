'use client';

import { useActionState } from 'react';
import { redeemLinkCode } from './actions';

export default function LinkForm() {
  const [state, action, pending] = useActionState(redeemLinkCode, null);
  return (
    <form action={action} className="stack gap">
      <div className="stack">
        <label className="label" htmlFor="code">Código de caja</label>
        <input className="input" id="code" name="code" inputMode="numeric" autoComplete="one-time-code"
          placeholder="4 dígitos" maxLength={4} required />
      </div>
      {state?.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn wide" type="submit" disabled={pending}>{pending ? 'Vinculando…' : 'Vincular'}</button>
    </form>
  );
}
