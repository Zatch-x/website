"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { ChevronDown, RotateCcw, Send } from "lucide-react";
import { site } from "@/data/site";
import Magnetic from "@/components/ui/Magnetic";
import RollText from "@/components/ui/RollText";
import CopyEmailButton from "@/components/ui/CopyEmailButton";

const topics = ["A project", "An opportunity", "Just saying hi"] as const;
const MESSAGE_MAX = 1200;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Field = "name" | "email" | "message";
type Values = Record<Field, string> & { topic: (typeof topics)[number] };
type Errors = Partial<Record<Field, string>>;

const initial: Values = { name: "", email: "", message: "", topic: topics[0] };

function compose(v: Values) {
  const name = v.name.trim() || "Your name";
  return {
    subject: `${v.topic} — from ${name}`,
    body: `${v.message.trim() || "Your message…"}\n\n— ${name}\n${v.email.trim() || "your@email"}`,
  };
}

function validate(v: Values): Errors {
  const errors: Errors = {};
  const name = v.name.trim();
  if (!name) errors.name = "Please tell me your name.";
  else if (name.length < 2) errors.name = "That name looks a little short.";
  if (!v.email.trim()) errors.email = "I’ll need an email to reply to.";
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = "That email address doesn’t look right.";
  const msg = v.message.trim();
  if (!msg) errors.message = "Add a short message.";
  else if (msg.length < 20) errors.message = `A little more detail, please (${20 - msg.length} more characters).`;
  else if (msg.length > MESSAGE_MAX) errors.message = `Please keep it under ${MESSAGE_MAX} characters.`;
  return errors;
}

/**
 * Contact form. There is no backend: a valid form opens the visitor's email app
 * with the message pre-filled (mailto:). Nothing is stored or sent anywhere else.
 * Includes a live preview of the email and a completion meter.
 */
export default function ContactForm() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");
  const successRef = useRef<HTMLHeadingElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Keep keyboard/screen-reader focus in place when the form is swapped for the success message.
  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const next = { ...values, [name]: value } as Values;
    setValues(next);
    if (touched[name as Field]) setErrors(validate(next));
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const name = e.target.name as Field;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(values));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      setStatus("error");
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    const { subject, body } = compose(values);
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus("sent");
  };

  const reset = () => {
    setValues(initial);
    setErrors({});
    setTouched({});
    setStatus("idle");
  };

  const fieldProps = (name: Field) => ({
    id: `${uid}-${name}`,
    name,
    value: values[name],
    onChange,
    onBlur,
    "aria-invalid": Boolean(touched[name] && errors[name]) || undefined,
    "aria-describedby": touched[name] && errors[name] ? `${uid}-${name}-error` : undefined,
  });

  const errorFor = (name: Field) =>
    touched[name] && errors[name] ? (
      <span className="field-error" id={`${uid}-${name}-error`}>
        {errors[name]}
      </span>
    ) : null;

  const errorCount = Object.keys(errors).length;
  const fieldsValid = (["name", "email", "message"] as Field[]).filter((f) => !validate(values)[f]).length;
  const preview = compose(values);

  return (
    <div className="contact-form-wrap">
      {status === "sent" ? (
        <div className="form-success" role="status">
          <span className="form-success-mark" aria-hidden>
            ✳
          </span>
          <h3 ref={successRef} tabIndex={-1}>
            Your email app should be open.
          </h3>
          <p>
            The message is ready to send from your own email account. If nothing opened, copy the address instead —
            {" "}
            <strong>{site.email}</strong>.
          </p>
          <div className="contact-direct-actions">
            <CopyEmailButton />
            <button type="button" className="copy-btn" onClick={reset}>
              <RotateCcw size={15} aria-hidden />
              <span>Write another</span>
            </button>
          </div>
        </div>
      ) : (
        <form ref={formRef} className="contact-form" noValidate onSubmit={onSubmit}>
          <div className="form-meter" aria-hidden>
            <span className="form-meter-label">
              {fieldsValid === 3 ? "Ready to send" : `${fieldsValid} / 3 fields ready`}
            </span>
            <span className="form-meter-track">
              <span className="form-meter-fill" style={{ transform: `scaleX(${fieldsValid / 3})` }} />
            </span>
          </div>
          <fieldset className="topic-field">
            <legend>I’m reaching out about</legend>
            <div className="topic-options">
              {topics.map((t) => (
                <label key={t} className="topic-option">
                  <input
                    type="radio"
                    name="topic"
                    value={t}
                    checked={values.topic === t}
                    onChange={() => setValues((v) => ({ ...v, topic: t }))}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field-row">
            <div className="field">
              <label htmlFor={`${uid}-name`}>Your name</label>
              <input type="text" autoComplete="name" {...fieldProps("name")} />
              {errorFor("name")}
            </div>
            <div className="field">
              <label htmlFor={`${uid}-email`}>Email</label>
              <input type="email" autoComplete="email" inputMode="email" {...fieldProps("email")} />
              {errorFor("email")}
            </div>
          </div>

          <div className="field">
            <label htmlFor={`${uid}-message`}>Message</label>
            <textarea rows={5} maxLength={MESSAGE_MAX + 200} {...fieldProps("message")} />
            <span className="field-count" data-over={values.message.length > MESSAGE_MAX || undefined}>
              {values.message.length} / {MESSAGE_MAX}
            </span>
            {errorFor("message")}
          </div>

          <div className="form-preview" data-open={showPreview || undefined}>
            <button
              type="button"
              className="form-preview-toggle"
              aria-expanded={showPreview}
              aria-controls={`${uid}-preview`}
              onClick={() => setShowPreview((p) => !p)}
            >
              {showPreview ? "Hide email preview" : "Preview the email"}
              <ChevronDown size={16} aria-hidden />
            </button>
            <div className="form-preview-panel" id={`${uid}-preview`} inert={!showPreview}>
              <div className="form-preview-inner">
                <dl className="mail-card">
                  <div>
                    <dt>To</dt>
                    <dd>{site.email}</dd>
                  </div>
                  <div>
                    <dt>Subject</dt>
                    <dd>{preview.subject}</dd>
                  </div>
                  <div className="mail-card-body">
                    <dt className="sr-only">Message</dt>
                    <dd>{preview.body}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <p className="form-note" aria-live="polite">
              {status === "error" && errorCount > 0
                ? `Please fix ${errorCount} field${errorCount > 1 ? "s" : ""} above.`
                : "Opens your email app with the message ready — nothing is stored on this site."}
            </p>
            <Magnetic strength={0.25}>
              <button type="submit" className="btn btn--primary roll-host">
                <RollText>Send message</RollText>
                <span className="btn-icon">
                  <Send size={16} aria-hidden />
                </span>
              </button>
            </Magnetic>
          </div>
        </form>
      )}
    </div>
  );
}
