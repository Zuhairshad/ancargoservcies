'use client'

import { useActionState, useRef, useState } from 'react'
import { destinations, modeLabels, type ServiceMode } from '@/data/rates'
import { createBooking, type BookingState } from '@/app/book/actions'

const modes: ServiceMode[] = ['door-to-door', 'sea-lcl', 'sea-fcl', 'air-cargo', 'courier']

const stepNames = ['Sender', 'Receiver', 'Shipment', 'Service']

/**
 * Four steps in one form: every field stays mounted so the browser keeps values
 * and the whole thing posts once to the server action. Stepping is presentation,
 * not state to lose.
 */
export default function BookingForm() {
  const [state, action, pending] = useActionState<BookingState, FormData>(createBooking, {})
  const [step, setStep] = useState(0)
  const steps = useRef<(HTMLFieldSetElement | null)[]>([])

  /** Check the step in front of the user before moving past it. Required fields
   *  in a hidden step cannot be reported by the browser — it refuses to focus
   *  them and blocks the submit with nothing on screen to explain why. */
  function next() {
    const fields = steps.current[step]?.querySelectorAll<HTMLInputElement>('input, select, textarea')
    for (const field of fields ?? []) {
      if (!field.checkValidity()) {
        field.reportValidity()
        return
      }
    }
    setStep((s) => s + 1)
  }

  /** Safety net: if anything invalid is left in a step that is not on screen,
   *  go to it rather than letting the submit die silently. */
  function guardSubmit(event: React.FormEvent<HTMLFormElement>) {
    const invalid = event.currentTarget.querySelector<HTMLInputElement>(':invalid')
    if (!invalid) return
    const owner = steps.current.findIndex((f) => f?.contains(invalid))
    if (owner >= 0 && owner !== step) {
      event.preventDefault()
      setStep(owner)
      requestAnimationFrame(() => invalid.reportValidity())
    }
  }

  return (
    <form className="form-card" action={action} onSubmit={guardSubmit}>
      {/* Honeypot: bots fill it, humans never see it. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 0, height: 0, overflow: 'hidden' }}>
        <label htmlFor="b0t_check">Leave blank</label>
        <input id="b0t_check" name="b0t_check" tabIndex={-1} autoComplete="new-password" />
      </div>

      <div className="steps">
        {stepNames.map((name, i) => (
          <div key={name} data-state={i === step ? 'current' : i < step ? 'done' : 'todo'}>
            {String(i + 1).padStart(2, '0')} {name}
          </div>
        ))}
      </div>

      <fieldset className="form-step" hidden={step !== 0} ref={(el) => { steps.current[0] = el }}>
        <legend className="sr-only">Sender details</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="senderName">Your name *</label>
            <input id="senderName" name="senderName" required />
          </div>
          <div className="field">
            <label htmlFor="senderPhone">Phone or WhatsApp *</label>
            <input id="senderPhone" name="senderPhone" required placeholder="+92 300 1234567" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="senderEmail">Email</label>
            <input id="senderEmail" name="senderEmail" type="email" placeholder="For your booking receipt" />
          </div>
          <div className="field">
            <label htmlFor="senderCity">City *</label>
            <input id="senderCity" name="senderCity" required placeholder="Faisalabad" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="senderAddress">Collection address *</label>
          <input id="senderAddress" name="senderAddress" required />
        </div>
      </fieldset>

      <fieldset className="form-step" hidden={step !== 1} ref={(el) => { steps.current[1] = el }}>
        <legend className="sr-only">Receiver details</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="receiverName">Receiver name *</label>
            <input id="receiverName" name="receiverName" required />
          </div>
          <div className="field">
            <label htmlFor="receiverPhone">Receiver phone *</label>
            <input id="receiverPhone" name="receiverPhone" required />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="receiverEmail">Receiver email</label>
            <input id="receiverEmail" name="receiverEmail" type="email" />
          </div>
          <div className="field">
            <label htmlFor="receiverCity">City and postcode *</label>
            <input id="receiverCity" name="receiverCity" required placeholder="Manchester M14 5TQ" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="receiverAddress">Delivery address *</label>
            <input id="receiverAddress" name="receiverAddress" required />
          </div>
          <div className="field">
            <label htmlFor="receiverCountry">Country *</label>
            <select id="receiverCountry" name="receiverCountry" required defaultValue={destinations[0]}>
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-step" hidden={step !== 2} ref={(el) => { steps.current[2] = el }}>
        <legend className="sr-only">What is in the shipment</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="pieces">Number of pieces *</label>
            <input id="pieces" name="pieces" type="number" min="1" defaultValue="1" required />
          </div>
          <div className="field">
            <label htmlFor="weightKg">Total weight (kg) *</label>
            <input id="weightKg" name="weightKg" type="number" min="0.1" step="0.1" required />
          </div>
        </div>
        <div className="field">
          <label htmlFor="contents">Contents *</label>
          <textarea
            id="contents"
            name="contents"
            required
            placeholder="Describe what is in the box — customs read this, so be specific."
          />
        </div>
        <div className="field">
          <label htmlFor="declaredValuePkr">Declared value (PKR)</label>
          <input id="declaredValuePkr" name="declaredValuePkr" type="number" min="0" />
        </div>
      </fieldset>

      <fieldset className="form-step" hidden={step !== 3} ref={(el) => { steps.current[3] = el }}>
        <legend className="sr-only">Service and collection</legend>
        <div className="form-row">
          <div className="field">
            <label htmlFor="mode">Service *</label>
            <select id="mode" name="mode" required defaultValue="door-to-door">
              {modes.map((m) => (
                <option key={m} value={m}>
                  {modeLabels[m]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="pickupDate">Preferred collection date</label>
            <input id="pickupDate" name="pickupDate" type="date" />
          </div>
        </div>
        <p className="form-note">
          Submitting this creates a booking reference. Our team weighs the consignment, confirms the freight charge and
          sends you the invoice — nothing is charged at this point.
        </p>
      </fieldset>

      {state.error && (
        <p className="form-note" role="alert" style={{ color: 'var(--accent)' }}>
          {state.error}
        </p>
      )}

      <div className="row">
        {step > 0 && (
          <button className="btn btn--outline btn--sm" type="button" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
        {step < stepNames.length - 1 && (
          <button className="btn btn--sm" type="button" onClick={next}>
            Next: {stepNames[step + 1]}
          </button>
        )}
        {step === stepNames.length - 1 && (
          <button className="btn" type="submit" disabled={pending}>
            {pending ? 'Submitting…' : 'Submit booking'}
          </button>
        )}
      </div>
    </form>
  )
}
