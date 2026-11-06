import type { ComponentPropsWithoutRef } from "react";

type IconProps = ComponentPropsWithoutRef<"svg">;

function SvgIcon(props: IconProps) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export function MenuIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M4 6h16M4 12h16M4 18h16" /></SvgIcon>;
}

export function CloseIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="m6 6 12 12M6 18 18 6" /></SvgIcon>;
}

export function MailIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </SvgIcon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3a1 1 0 0 0-.8-1l-3.2-.6a1 1 0 0 0-1 .4l-1.3 1.8a14.5 14.5 0 0 1-7.3-7.3l1.8-1.3a1 1 0 0 0 .4-1L8 3.8A1 1 0 0 0 7 3Z" />
    </SvgIcon>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="m6 9 6 6 6-6" /></SvgIcon>;
}

export function ArrowRightIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M4 12h16m-6-6 6 6-6 6" /></SvgIcon>;
}

export function ArrowUpRightIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M6 18 18 6M6 6h12v12" /></SvgIcon>;
}

export function HeatingIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M8 8v12m4-12v12m4-12v12M2 11h2m16 6h2M8 2v2m4-2v2m4-2v2M7 20v2m10-2v2" />
    </SvgIcon>
  );
}

export function PipelineIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M2 7h10a5 5 0 0 1 5 5v10M2 13h8a1 1 0 0 1 1 1v8M5 5v10m-3-10h6m5 12h6m-7 3h6M14 2v5m-3-5h6" />
      <circle cx="14" cy="9" r="2" />
    </SvgIcon>
  );
}

export function ElectricalIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="m13 6-5 7h4l-1 5 5-7h-4l1-5ZM7 2v-1m10 1v-1M7 22v1m10-1v1" />
    </SvgIcon>
  );
}

export function InsulationIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <ellipse cx="12" cy="7" rx="9" ry="4" />
      <ellipse cx="12" cy="7" rx="4" ry="1.5" />
      <path d="M3 7v10c0 2.2 4 4 9 4s9-1.8 9-4V7M7 11v8m10-8v8M3 13c0 2.2 4 4 9 4s9-1.8 9-4" />
    </SvgIcon>
  );
}

export function MaintenanceIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M14.5 3.5a6 6 0 0 0-7.8 7.8L2.6 16a3.2 3.2 0 0 0 4.5 4.5l4.7-4.1a6 6 0 0 0 7.7-7.9L16 12l-4-4 2.5-4.5Z" />
      <circle cx="5.5" cy="17.5" r=".7" />
    </SvgIcon>
  );
}

export function DrainageIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 3v9a6 6 0 0 0 6 6h12M9 3v8a1 1 0 0 0 1 1h11M1 5h10m8 5v10M14 2c0 2-2 2.7-2 4a2 2 0 0 0 4 0c0-1.3-2-2-2-4Z" />
      <path d="m13 15 2 1.5-2 1.5" />
    </SvgIcon>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <SvgIcon fill="currentColor" stroke="none" {...props}>
      <path d="M21.3 3.1 2.9 10.2c-1.3.5-1.3 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.6c.9.5 1.6.2 1.8-.9L23 4.4c.3-1.3-.5-1.8-1.7-1.3ZM9 12.9l10.7-6.7c.5-.3.9-.1.5.2l-8.9 8-.3 3.5-2-5Z" />
    </SvgIcon>
  );
}

export function MaxIcon(props: IconProps) {
  return (
    <SvgIcon viewBox="0 0 48 48" fill="currentColor" stroke="none" {...props}>
      <path fillRule="evenodd" d="M24 0a24 24 0 1 1 0 48 24 24 0 0 1 0-48Zm.23 12.5c-6.36 0-11.74 4.93-11.74 11.47 0 2.74.51 4.64.96 6.33.37 1.38.7 2.65.7 4.14.16 1.99 3.83.83 4.99-.66 1.83 1.32 2.88 1.65 5.15 1.65 6.27-.03 11.32-5.13 11.3-11.4 0-6.36-4.99-11.53-11.36-11.53Zm.16 5.66a5.82 5.82 0 0 1 5.56 6.13 5.82 5.82 0 0 1-6.18 5.5 5.62 5.62 0 0 1-2.8-1c-.5.5-1.31 1.15-1.63 1.07-.66-.17-1.45-3.57-1.01-6.35.54-3.36 2.95-5.51 6.16-5.35Z" />
    </SvgIcon>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.8a8.5 8.5 0 1 1 16.1-4.1Z" />
      <path fill="currentColor" stroke="none" d="M8.3 6.8h.8c.2 0 .4.1.5.4l1 2.2c.1.3.1.5-.1.7l-.8 1a7.7 7.7 0 0 0 3.3 3l.8-1c.2-.2.4-.3.7-.1l2.1 1c.3.1.4.3.3.6-.2 1.1-1.2 1.9-2.3 1.8-1.6-.1-3.7-1.2-5.4-2.9-1.6-1.6-2.7-3.5-2.8-4.8-.1-.8.4-1.5 1-1.9.3-.1.6-.1.9 0Z" />
    </SvgIcon>
  );
}

export function SunIcon(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></SvgIcon>;
}

export function MoonIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z" /></SvgIcon>;
}
