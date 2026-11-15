'use client';

import { useActionState, useState } from 'react';
import { saveProfile } from './actions';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function ProfileForm({ customer }) {
  const [state, action, pending] = useActionState(saveProfile, null);
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(customer.phone);
  const digits = phone.replace(/\D/g, '');
  const ready = name.trim().length >= 2 && digits.length === 10;

  return (
    <form action={action} className="card">
      <h2 className="display h2">Datos del cliente</h2>
      <input type="hidden" name="id" value={customer.id} />

      <div className="stack">
        <label className="label" htmlFor="name">Nombre</label>
        <input className="input" id="name" name="name" maxLength={80} value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="stack">
        <label className="label" htmlFor="phone">Número de celular</label>
        <input className="input" id="phone" name="phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} />
        {digits.length > 0 && digits.length !== 10 && <span className="error">Deben ser 10 dígitos.</span>}
      </div>

      <fieldset className="stack" style={{ border: 0, padding: 0, margin: 0 }}>
        <legend className="label" style={{ padding: 0, marginBottom: 6 }}>Fecha de nacimiento <span className="opt">(opcional)</span></legend>
        <div className="row">
          <select className="select" name="birth_day" aria-label="Día" defaultValue={customer.birth_day ?? ''}>
            <option value="">Día</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="select" name="birth_month" aria-label="Mes" defaultValue={customer.birth_month ?? ''}>
            <option value="">Mes</option>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </div>
      </fieldset>

      <div className="stack">
        <label className="label" htmlFor="address">Dirección <span className="opt">(opcional)</span></label>
        <input className="input" id="address" name="address" maxLength={200} defaultValue={customer.address ?? ''} />
      </div>

      {state?.error && <p className="error" role="alert">{state.error}</p>}
      <button className="btn wide" type="submit" disabled={!ready || pending}>{pending ? 'Guardando…' : 'Guardar cambios'}</button>
    </form>
  );
}
