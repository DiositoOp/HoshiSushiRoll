'use client';

import { useActionState } from 'react';
import { login } from '../actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="stack gap">
      <div className="stack">
        <label className="label" htmlFor="username">Usuario</label>
        <input className="input" id="username" name="username" autoComplete="username" autoCapitalize="none" required
          defaultValue={state?.username || ''} />
      </div>
      <div className="stack">
        <label className="label" htmlFor="password">Contraseña</label>
        <input className="input" id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      {state?.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn wide" type="submit" disabled={pending}>{pending ? 'Entrando…' : 'Entrar'}</button>
    </form>
  );
}
