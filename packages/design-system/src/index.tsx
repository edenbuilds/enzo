import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <button className={cx("button", `button--${variant}`, className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("card", className)} {...props} />;
}

export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("tag", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx("input", className)} {...props} />;
}

export function Alert({
  tone = "info",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: "info" | "success" | "warning" | "error" }) {
  return <div role="status" className={cx("alert", `alert--${tone}`, className)} {...props} />;
}

export function EditorialHeading({
  eyebrow,
  children,
  className,
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("editorial-heading", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2>{children}</h2>
    </div>
  );
}

export function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="metric">
      <p className="eyebrow">{label}</p>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  );
}

export function EvidenceBlock({
  label,
  children,
  confidence,
}: {
  label: string;
  children: ReactNode;
  confidence: number;
}) {
  return (
    <article className="evidence-block">
      <div className="evidence-block__meta">
        <span className="tag">{label}</span>
        <span className="eyebrow">{Math.round(confidence * 100)}% confidence</span>
      </div>
      {children}
    </article>
  );
}

export type EnzoState =
  | "listening"
  | "investigating"
  | "bringing-evidence"
  | "challenging"
  | "warning"
  | "waiting"
  | "ready"
  | "reviewing";

export function EnzoPuppy({ state = "listening", className }: { state?: EnzoState; className?: string }) {
  return (
    <svg
      className={cx("enzo-puppy", `enzo-puppy--${state}`, className)}
      viewBox="0 0 320 260"
      role="img"
      aria-label={`Enzo is ${state.replace("-", " ")}`}
    >
      <path className="enzo-puppy__tail" d="M245 165c42-10 51-43 27-56" />
      <path className="enzo-puppy__body" d="M88 128c13-45 57-64 102-50 46 13 69 54 57 105-8 34-29 53-61 55H94c-31-2-48-22-43-52 4-24 17-43 37-58Z" />
      <path className="enzo-puppy__head" d="M55 46c29-28 82-22 102 12 19 33 6 78-28 96-35 19-80 3-94-33-10-26-2-55 20-75Z" />
      <path className="enzo-puppy__ear" d="M57 50C25 36 13 58 28 88c10 20 28 25 42 14" />
      <path className="enzo-puppy__ear" d="M137 53c31-20 49 0 40 31-6 21-23 29-38 21" />
      <circle className="enzo-puppy__eye" cx="75" cy="91" r="6" />
      <circle className="enzo-puppy__eye" cx="119" cy="87" r="6" />
      <path className="enzo-puppy__nose" d="M94 103c9-6 20 0 17 9-3 8-13 12-20 6-7-6-4-11 3-15Z" />
      <path className="enzo-puppy__mouth" d="M101 118c-1 11-10 16-21 15m21-15c3 10 12 13 21 10" />
      <path className="enzo-puppy__collar" d="M63 142c27 14 58 15 84 1" />
      <circle className="enzo-puppy__tag" cx="106" cy="151" r="10" />
      <path className="enzo-puppy__leg" d="M91 207v32m79-34v34m50-48v48" />
      <path className="enzo-puppy__ground" d="M57 239h186" />
    </svg>
  );
}

export function Chamber({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cx("chamber", className)} {...props} />;
}
