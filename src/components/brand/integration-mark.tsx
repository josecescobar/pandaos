import { cn } from "@/lib/utils";

/** Brand-faithful marks for the integration grid (ad-matching). */
export function IntegrationMark({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const common = cn("h-5 w-5 shrink-0", className);

  switch (id) {
    case "supabase":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#3ECF8E"
            d="M13.8 2.3c-.6-.9-1.9-.5-1.9.6v7.3h6.6c1.3 0 2 1.6 1.1 2.6l-8.6 10.3c-.6.7-1.8.3-1.8-.7v-7.3H2.6c-1.3 0-2-1.6-1.1-2.6L13.8 2.3z"
          />
        </svg>
      );
    case "vercel":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path fill="#fff" d="M12 3 22 20H2L12 3z" />
        </svg>
      );
    case "gmail":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#EA4335"
            d="M2 6.5V18a2 2 0 0 0 2 2h2.5V10.2L12 15l5.5-4.8V20H20a2 2 0 0 0 2-2V6.5L12 14 2 6.5z"
          />
          <path
            fill="#4285F4"
            d="M2 6.5 12 14l10-7.5V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v1.5z"
            opacity=".9"
          />
          <path fill="#34A853" d="M6.5 20V10.2L2 6.5V18a2 2 0 0 0 2 2h2.5z" />
          <path
            fill="#FBBC04"
            d="M17.5 20H20a2 2 0 0 0 2-2V6.5l-4.5 3.7V20z"
          />
        </svg>
      );
    case "google-calendar":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <rect x="3" y="4" width="18" height="17" rx="2" fill="#fff" />
          <path fill="#4285F4" d="M3 4h18v5H3z" />
          <path
            fill="#EA4335"
            d="M7 2v4M17 2v4"
            stroke="#EA4335"
            strokeWidth="1.5"
          />
          <rect x="7" y="12" width="3" height="3" rx=".5" fill="#4285F4" />
          <rect x="11" y="12" width="3" height="3" rx=".5" fill="#34A853" />
          <rect x="15" y="12" width="3" height="3" rx=".5" fill="#FBBC04" />
          <rect x="7" y="16" width="3" height="3" rx=".5" fill="#EA4335" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#fff"
            d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.3 9.3 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 4-2.3 4.8-4.6 5.1.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z"
          />
        </svg>
      );
    case "hubspot":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <circle cx="12" cy="12" r="3.2" fill="#FF7A59" />
          <circle cx="12" cy="5" r="1.6" fill="#FF7A59" />
          <circle cx="12" cy="19" r="1.6" fill="#FF7A59" />
          <circle cx="5" cy="12" r="1.6" fill="#FF7A59" />
          <circle cx="19" cy="12" r="1.6" fill="#FF7A59" />
          <path
            stroke="#FF7A59"
            strokeWidth="1.4"
            d="M12 8.2v2.2M12 13.6v2.2M8.2 12h2.2M13.6 12h2.2"
          />
        </svg>
      );
    case "notion":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#fff"
            d="M5 4.5h11.2c.4 0 .8.1 1.1.4l2.2 2.3c.2.2.3.5.3.8V19c0 .8-.7 1.5-1.5 1.5H6.5C5.7 20.5 5 19.8 5 19V4.5zm3.2 3.2v9.6h1.6V9.5l4.4 7.8h1.7V7.7h-1.6v7.6L9.9 7.7H8.2z"
          />
        </svg>
      );
    case "slack":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#E01E5A"
            d="M6.5 14.5a2 2 0 1 1-2-2h2v2zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5z"
          />
          <path
            fill="#36C5F0"
            d="M9.5 6.5a2 2 0 1 1 2-2v2h-2zm0 1a2 2 0 1 1 0 4h-5a2 2 0 1 1 0-4h5z"
          />
          <path
            fill="#2EB67D"
            d="M17.5 9.5a2 2 0 1 1 2 2h-2v-2zm-1 0a2 2 0 1 1-4 0v-5a2 2 0 1 1 4 0v5z"
          />
          <path
            fill="#ECB22E"
            d="M14.5 17.5a2 2 0 1 1-2 2v-2h2zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5z"
          />
        </svg>
      );
    case "jira":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#2684FF"
            d="M12.3 3H21v.3A8.7 8.7 0 0 1 12.3 12L12 12.3 11.7 12A8.7 8.7 0 0 1 3 3.3V3h9.3z"
          />
          <path
            fill="#2684FF"
            d="M12.3 12H21v.3A8.7 8.7 0 0 1 12.3 21L12 21.3 11.7 21A8.7 8.7 0 0 1 3 12.3V12h9.3z"
            opacity=".85"
          />
        </svg>
      );
    case "postgresql":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <ellipse cx="12" cy="12" rx="8" ry="9" fill="#336791" />
          <path
            fill="#fff"
            d="M10 7.5h2.2c1.6 0 2.6.8 2.6 2.1 0 1.1-.6 1.8-1.5 2.1l1.8 4.8h-1.7l-1.6-4.5H11v4.5H9.5V7.5H10zm1.5 1.3v2.4h.6c.7 0 1.1-.3 1.1-1.2s-.4-1.2-1.1-1.2h-.6z"
          />
        </svg>
      );
    case "stripe":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <rect width="24" height="24" rx="6" fill="#635BFF" />
          <path
            fill="#fff"
            d="M12.4 9.6c0-.7.6-1 1.5-1 1.3 0 3 .4 4.2 1.1V6.5c-1.4-.5-2.8-.8-4.2-.8-3.4 0-5.7 1.8-5.7 4.8 0 4.7 6.5 3.9 6.5 5.9 0 .8-.7 1.1-1.7 1.1-1.5 0-3.3-.6-4.8-1.4v3.3c1.6.7 3.3 1 4.8 1 3.6 0 6-1.7 6-4.8 0-5-6.6-4.1-6.6-6z"
          />
        </svg>
      );
    case "salesforce":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#00A1E0"
            d="M10.2 7.2c.6-1.1 1.8-1.8 3.1-1.8 1.2 0 2.3.6 2.9 1.5.6-.3 1.3-.4 2-.4 2.2 0 4 1.7 4 3.9 0 2.1-1.7 3.8-3.8 3.9h-9.1C6.7 14.3 5 12.6 5 10.5c0-2 1.5-3.6 3.4-3.8.4-1.2 1.5-2.1 2.8-2.3.4 0 .7.1 1 .2z"
          />
        </svg>
      );
    case "linear":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#5E6AD2"
            d="M3.5 14.8 14.8 3.5c.4-.4 1-.5 1.5-.3A9.5 9.5 0 0 1 20.8 7.7c.2.5.1 1.1-.3 1.5L9.2 20.5c-.4.4-1 .5-1.5.3A9.5 9.5 0 0 1 3.2 16.3c-.2-.5-.1-1.1.3-1.5z"
          />
        </svg>
      );
    case "discord":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#5865F2"
            d="M19.3 5.2A16 16 0 0 0 15.2 4l-.2.4c1.5.4 2.9 1.1 4.2 2-1.6-.8-3.3-1.3-5-1.6-1.2-.2-2.4-.2-3.6 0-1.7.3-3.4.8-5 1.6 1.3-.9 2.7-1.6 4.2-2L9.6 4A16 16 0 0 0 5.5 5.2C2.7 9.3 2 13.3 2.3 17.2c1.8 1.3 3.6 2.1 5.3 2.6l.7-1.1c-.7-.3-1.4-.6-2-1 1.5.7 3.1 1.1 4.7 1.3 1.6.2 3.2.1 4.8-.2.1 0 .1 0 .2 0 1.6-.3 3.2-.8 4.7-1.4-.7.4-1.3.8-2 1l.7 1.1c1.8-.5 3.5-1.3 5.3-2.6.4-4.5-.7-8.5-3.4-12zM9 14.5c-.9 0-1.7-.8-1.7-1.8S8.1 11 9 11s1.7.8 1.7 1.8-.8 1.7-1.7 1.7zm6 0c-.9 0-1.7-.8-1.7-1.8S14.1 11 15 11s1.7.8 1.7 1.8-.8 1.7-1.7 1.7z"
          />
        </svg>
      );
    case "figma":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <circle cx="12" cy="12" r="3.2" fill="#1ABCFE" />
          <path fill="#0ACF83" d="M8.8 15.2a3.2 3.2 0 0 0 0 6.4H12v-6.4H8.8z" />
          <path fill="#A259FF" d="M12 2.4H8.8a3.2 3.2 0 0 0 0 6.4H12V2.4z" />
          <path fill="#F24E1E" d="M12 8.8H8.8a3.2 3.2 0 0 0 0 6.4H12V8.8z" />
          <path fill="#FF7262" d="M12 2.4h3.2a3.2 3.2 0 1 1 0 6.4H12V2.4z" />
        </svg>
      );
    case "aws":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path
            fill="#FF9900"
            d="M7 15.5c2.2 1.3 5.4 2 8.2 2 1.6 0 3.3-.2 4.8-.7.4-.1.7.2.3.5-1.5 1.3-4.4 2.2-7 2.2-3.3 0-6.3-.9-8.4-2.2-.3-.2-.1-.5.3-.4.6.2 1.2.4 1.8.6z"
          />
          <path
            fill="#fff"
            d="M14.6 13.2c0 .3-.2.4-.5.5l-.7.2v1.3h-1.1v-4.8h1.9c1 0 1.7.6 1.7 1.4 0 .6-.3 1.1-.9 1.3l1.1 1.9h-1.3l-.9-1.6h-.3v1.6h1zm-1.2-2.3h.7c.4 0 .6-.2.6-.5s-.2-.5-.6-.5h-.7v1zM9.8 15.2l-1.1-3.6h-1.2l-1.1 3.6H5.2l1.7-4.8h1.6l1.7 4.8H9.8z"
          />
        </svg>
      );
    case "ga":
    case "google-ads":
    case "google-drive":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden>
          <path fill="#4285F4" d="M12 12v8.5a8.5 8.5 0 0 0 0-17V12z" />
          <path fill="#34A853" d="M12 12H3.5a8.5 8.5 0 0 0 8.5 8.5V12z" />
          <path fill="#FBBC04" d="M12 12V3.5A8.5 8.5 0 0 0 3.5 12H12z" />
          <path fill="#EA4335" d="M18.5 7.2 12 12l6.5 4.8A8.5 8.5 0 0 0 18.5 7.2z" />
        </svg>
      );
    default:
      return (
        <span
          className={cn(
            "grid h-5 w-5 place-items-center rounded text-[9px] font-bold text-white/90",
            className,
          )}
        >
          {id.slice(0, 1).toUpperCase()}
        </span>
      );
  }
}
