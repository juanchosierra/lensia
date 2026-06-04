"use client";

import type { CSSProperties, SVGProps } from "react";

export type IconName =
  | "list" | "plus" | "search" | "bell" | "check" | "chevron" | "chevL"
  | "clock" | "truck" | "eye" | "frame" | "camera" | "user" | "phone"
  | "tag" | "doc" | "repeat" | "alert" | "spark" | "pin" | "shield"
  | "x" | "filter" | "settings";

type Props = {
  name: IconName;
  size?: number;
  sw?: number;
  style?: CSSProperties;
};

export function Icon({ name, size = 20, sw = 1.8, style }: Props) {
  const p: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: sw,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };
  switch (name) {
    case "list":     return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1.3" fill="currentColor" stroke="none"/><circle cx="3.5" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="3.5" cy="18" r="1.3" fill="currentColor" stroke="none"/></svg>;
    case "plus":     return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case "search":   return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>;
    case "bell":     return <svg {...p}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>;
    case "check":    return <svg {...p}><path d="M20 6L9 17l-5-5"/></svg>;
    case "chevron":  return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case "chevL":    return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case "clock":    return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "truck":    return <svg {...p}><path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>;
    case "eye":      return <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "frame":    return <svg {...p}><circle cx="6.5" cy="13" r="3.5"/><circle cx="17.5" cy="13" r="3.5"/><path d="M10 12.2c.8-.6 3.2-.6 4 0M2 10l1.6 1M22 10l-1.6 1"/></svg>;
    case "camera":   return <svg {...p}><path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/></svg>;
    case "user":     return <svg {...p}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.3 3.6-5 8-5s8 1.7 8 5"/></svg>;
    case "phone":    return <svg {...p}><path d="M5 4h4l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v4a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1z"/></svg>;
    case "tag":      return <svg {...p}><path d="M3 3h8l10 10-8 8L3 11z"/><circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none"/></svg>;
    case "doc":      return <svg {...p}><path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/></svg>;
    case "repeat":   return <svg {...p}><path d="M3 11a6 6 0 0 1 6-6h9M3 11l3-3M3 11l3 3"/><path d="M21 13a6 6 0 0 1-6 6H6M21 13l-3 3M21 13l-3-3"/></svg>;
    case "alert":    return <svg {...p}><path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/></svg>;
    case "spark":    return <svg {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>;
    case "pin":      return <svg {...p}><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.4"/></svg>;
    case "shield":   return <svg {...p}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>;
    case "x":        return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "filter":   return <svg {...p}><path d="M3 5h18l-7 8v6l-4-2v-4z"/></svg>;
    case "settings": return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>;
    default:         return <svg {...p}/>;
  }
}
