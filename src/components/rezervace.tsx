"use client";

import { useActionState, useEffect, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Send } from "lucide-react";

import { submitBooking, type BookingState } from "@/app/actions";
import { contact, rooms } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const INITIAL: BookingState = { status: "idle" };

const field =
  "w-full rounded-sm border border-ink-edge bg-ink-raised px-4 py-3 text-bone " +
  "placeholder:text-bone-faint transition-colors focus:border-teal focus:outline-none " +
  "[color-scheme:dark]";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-bone px-7 py-3.5 text-sm font-medium text-ink transition-opacity hover:opacity-85 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 size={15} className="animate-spin" />
          Odesílám…
        </>
      ) : (
        <>
          <Send size={15} />
          Odeslat poptávku
        </>
      )}
    </button>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <span className="mt-1.5 block text-xs text-bronze">{error}</span>}
    </label>
  );
}

export function Rezervace() {
  const [state, action] = useActionState(submitBooking, INITIAL);
  const [today, setToday] = useState("");
  const formId = useId();

  // Set on the client so the min date follows the visitor's own clock rather
  // than the build machine's.
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
  }, []);

  // No provider configured — hand off to the visitor's mail client.
  useEffect(() => {
    if (state.status === "fallback" && state.mailto) {
      window.location.href = state.mailto;
    }
  }, [state]);

  const errors = state.fieldErrors ?? {};

  return (
    <section
      id="rezervace"
      className="scroll-mt-24 border-t border-ink-edge py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Rezervace"
              title="Napište si o termín"
              lede="Poptávka je nezávazná. Ozveme se vám s potvrzením a domluvíme podrobnosti."
            />

            <Reveal delay={0.1}>
              <div className="mt-10 space-y-4 text-sm text-bone-dim">
                <p>
                  Spěcháte? Zavolejte na{" "}
                  <a
                    href={`tel:${contact.phoneHref}`}
                    className="text-bone underline decoration-bone-faint underline-offset-4 transition-colors hover:text-teal"
                  >
                    {contact.phone}
                  </a>
                  .
                </p>
                <p>
                  Nebo napište na{" "}
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-bone underline decoration-bone-faint underline-offset-4 transition-colors hover:text-teal"
                  >
                    {contact.email}
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <form action={action} className="space-y-5">
              {/* honeypot */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute h-0 w-0 overflow-hidden opacity-0"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Jméno a příjmení" error={errors.name}>
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Jana Nováková"
                    className={cn(field, errors.name && "border-bronze")}
                  />
                </Field>
                <Field label="E-mail" error={errors.email}>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="jana@email.cz"
                    className={cn(field, errors.email && "border-bronze")}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Telefon">
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+420 …"
                    className={field}
                  />
                </Field>
                <Field label="Počet osob">
                  <input
                    name="guests"
                    type="number"
                    min={1}
                    max={12}
                    defaultValue={2}
                    className={field}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Příjezd" error={errors.arrival}>
                  <input
                    name="arrival"
                    type="date"
                    required
                    min={today}
                    className={cn(field, errors.arrival && "border-bronze")}
                  />
                </Field>
                <Field label="Odjezd" error={errors.departure}>
                  <input
                    name="departure"
                    type="date"
                    required
                    min={today}
                    className={cn(field, errors.departure && "border-bronze")}
                  />
                </Field>
              </div>

              <Field label="Pokoj">
                <select name="room" defaultValue={rooms[0].id} className={field}>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id} className="bg-ink-raised">
                      {r.name} — {r.price} Kč / os / noc
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Poznámka">
                <textarea
                  name="note"
                  rows={4}
                  placeholder="Cokoliv, co bychom měli vědět předem."
                  className={cn(field, "resize-y")}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Submit />
                {state.message && (
                  <p
                    role="status"
                    aria-live="polite"
                    id={formId}
                    className={cn(
                      "text-sm",
                      state.status === "error" ? "text-bronze" : "text-teal"
                    )}
                  >
                    {state.message}
                  </p>
                )}
              </div>

              <p className="text-xs leading-relaxed text-bone-faint">
                Odesláním nám dáváte kontakt pouze pro vyřízení této poptávky.
                Nikam ho dál nepředáváme.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
