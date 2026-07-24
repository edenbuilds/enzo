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
      <path className="enzo-puppy__tail" d="M240 174c35 3 58-13 57-38-1-15-14-23-25-15-8 6-5 18 3 19" />
      <path className="enzo-puppy__body" d="M101 124c28-30 92-34 128-5 27 22 30 63 14 91-12 22-37 31-72 29h-64c-39 0-61-21-55-54 5-27 22-48 49-61Z" />
      <path className="enzo-puppy__spot" d="M186 111c25 1 48 12 60 31-14 15-32 21-53 15-18-5-28-19-28-38 6-5 13-8 21-8Z" />
      <path className="enzo-puppy__head" d="M67 52c22-22 61-21 83 0 18 18 23 49 11 72-10 19-31 33-56 33-29 0-55-18-63-43-8-23 2-47 25-62Z" />
      <path className="enzo-puppy__ear enzo-puppy__ear--up" d="M74 57 84 12c2-9 12-12 19-6l25 39" />
      <path className="enzo-puppy__ear enzo-puppy__ear--fold" d="M135 52c19-17 42-9 41 11-1 19-15 33-33 37l-10-18" />
      <path className="enzo-puppy__face-patch" d="M59 75c14-16 36-17 47-2 10 14 4 36-13 47-17 10-38 3-43-14-4-11-1-22 9-31Z" />
      <path className="enzo-puppy__brow" d="M73 83c7-5 14-5 21-1" />
      <circle className="enzo-puppy__eye" cx="84" cy="94" r="6" />
      <circle className="enzo-puppy__eye" cx="126" cy="91" r="6" />
      <path className="enzo-puppy__nose" d="M96 109c9-6 20-1 18 8-2 8-12 13-20 8-8-5-5-11 2-16Z" />
      <path className="enzo-puppy__mouth" d="M104 125c-1 10-9 15-20 14m20-14c4 9 12 12 21 8" />
      <path className="enzo-puppy__collar" d="M70 148c24 13 55 14 80 2" />
      <path className="enzo-puppy__tag" d="m108 151 11 10-11 13-11-13 11-10Z" />
      <path className="enzo-puppy__leg" d="M93 210v29m63-27v27m68-39v39" />
      <path className="enzo-puppy__paw" d="M82 239h23m40 0h23m45 0h23" />
      <path className="enzo-puppy__ground" d="M48 239h207" />
    </svg>
  );
}

export function Chamber({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cx("chamber", className)} {...props} />;
}
