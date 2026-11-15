'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { register } from './actions';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function RegisterForm({ punto }) {
  const [state, action, pending] = useActionState(register, null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const digits = phone.replace(/\D/g, '');
  const ready = name.trim().length >= 2 && digits.length === 10;

  return (
    <form action={action} className="stack gap" style={{ flexGrow: 1 }}>
      <input type="hidden" name="punto" value={punto} />

      <div className="stack">
        <label className="label" htmlFor="name">Nombre</label>
        <input className="input" id="name" name="name" autoComplete="name" placeholder="Tu nombre" maxLength={80}
          value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="stack">
        <label className="label" htmlFor="phone">Número de celular</label>
        <input className="input" id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel-national"
          placeholder="10 dígitos" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {digits.length > 0 && digits.length < 10 && <span className="error">Faltan dígitos: deben ser 10.</span>}
        {digits.length > 10 && <span className="error">Sobran dígitos: deben ser 10.</span>}
      </div>

      <fieldset className="stack" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="label" style={{ padding: 0, marginBottom: 6 }}>
          Fecha de nacimiento <span className="opt">(opcional)</span>
        </legend>
        <div className="row">
          <select className="select" name="birth_day" aria-label="Día" defaultValue={state?.values?.day ?? ''}>
            <option value="">Día</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="select" name="birth_month" aria-label="Mes" defaultValue={state?.values?.month ?? ''}>
            <option value="">Mes</option>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
      </fieldset>

      <div className="stack">
        <label className="label" htmlFor="address">Dirección <span className="opt">(opcional)</span></label>
        <input className="input" id="address" name="address" autoComplete="street-address"
          placeholder="Para pedidos a domicilio" maxLength={200}
          defaultValue={state?.values?.address ?? ''} />
      </div>

      {state?.error && (
        <p className="error" role="alert">
          {state.error}{' '}
          {state.exists && <Link href="/vincular">Vincular este teléfono</Link>}
        </p>
      )}

      <div className="stack push" style={{ gap: 10 }}>
        <button className="btn wide" type="submit" disabled={!ready || pending}>
          {pending ? 'Guardando…' : 'Guardar'}
        </button>
        <p className="small muted center">
          Al guardar aceptas nuestro <Link href="/privacidad">aviso de privacidad</Link>.
        </p>
      </div>
    </form>
  );
}
