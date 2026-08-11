"use server";

import { Resend } from "resend";

import { contact, rooms } from "@/lib/content";

export type BookingState = {
  status: "idle" | "sent" | "fallback" | "error";
  message?: string;
  /** populated when no mail provider is configured, so the client can hand off */
  mailto?: string;
  fieldErrors?: Record<string, string>;
};

const MAX = { name: 120, email: 160, phone: 40, note: 2000 };

function clean(value: FormDataEntryValue | null, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export async function submitBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  // Honeypot: real people leave this empty. Report success either way so a bot
  // learns nothing from the response.
  if (clean(formData.get("company"), 100)) {
    return { status: "sent" };
  }

  const name = clean(formData.get("name"), MAX.name);
  const email = clean(formData.get("email"), MAX.email);
  const phone = clean(formData.get("phone"), MAX.phone);
  const arrival = clean(formData.get("arrival"), 20);
  const departure = clean(formData.get("departure"), 20);
  const guests = clean(formData.get("guests"), 4);
  const roomId = clean(formData.get("room"), 60);
  const note = clean(formData.get("note"), MAX.note);

  const fieldErrors: Record<string, string> = {};
  if (name.length < 2) fieldErrors.name = "Uveďte prosím jméno.";
  if (!isEmail(email)) fieldErrors.email = "Zkontrolujte prosím e-mail.";
  if (!arrival) fieldErrors.arrival = "Vyberte datum příjezdu.";
  if (!departure) fieldErrors.departure = "Vyberte datum odjezdu.";
  if (arrival && departure && departure <= arrival) {
    fieldErrors.departure = "Odjezd musí být až po příjezdu.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Formulář se nepodařilo odeslat.",
      fieldErrors,
    };
  }

  const room = rooms.find((r) => r.id === roomId);
  const roomName = room ? `${room.name} (${room.price} Kč / os / noc)` : "Neurčeno";

  const lines = [
    `Jméno: ${name}`,
    `E-mail: ${email}`,
    phone && `Telefon: ${phone}`,
    `Příjezd: ${arrival}`,
    `Odjezd: ${departure}`,
    `Počet osob: ${guests || "neuvedeno"}`,
    `Pokoj: ${roomName}`,
    note && `\nPoznámka:\n${note}`,
  ]
    .filter(Boolean)
    .join("\n");

  const subject = `Poptávka ubytování — ${name}, ${arrival} až ${departure}`;
  const apiKey = process.env.RESEND_API_KEY;

  // No provider configured yet: hand the message back so the browser can open
  // the guest's mail client with everything already filled in. The form still
  // works on day one; wiring Resend later changes nothing the visitor sees.
  if (!apiKey) {
    return {
      status: "fallback",
      mailto: `mailto:${contact.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(lines)}`,
      message:
        "Otevřeli jsme vám e-mail s předvyplněnou poptávkou. Stačí ji odeslat.",
    };
  }

  try {
    const resend = new Resend(apiKey);
    const from = process.env.BOOKING_FROM ?? "Rezervace <onboarding@resend.dev>";

    const { error } = await resend.emails.send({
      from,
      to: [process.env.BOOKING_TO ?? contact.email],
      replyTo: email,
      subject,
      text: lines,
    });

    if (error) {
      console.error("Resend rejected the booking email:", error);
      return {
        status: "error",
        message: `Odeslání selhalo. Zavolejte prosím na ${contact.phone}.`,
      };
    }

    return {
      status: "sent",
      message: "Poptávka odeslána. Ozveme se vám co nejdřív.",
    };
  } catch (err) {
    console.error("Booking email threw:", err);
    return {
      status: "error",
      message: `Odeslání selhalo. Zavolejte prosím na ${contact.phone}.`,
    };
  }
}
