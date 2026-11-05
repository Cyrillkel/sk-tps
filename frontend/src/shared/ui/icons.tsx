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

export function SunIcon(props: IconProps) {
  return <SvgIcon {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></SvgIcon>;
}

export function MoonIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z" /></SvgIcon>;
}
