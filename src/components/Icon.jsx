const ICON_PATHS = {
  mains: (
    <>
      <path d="M7 4v16" />
      <path d="M7 4c-1.6 1.5-2.4 3.1-2.4 4.8 0 1.8.8 3.2 2.4 4.2 1.6-1 2.4-2.4 2.4-4.2C9.4 7.1 8.6 5.5 7 4Z" />
      <path d="M16.5 4v16" />
      <path d="M13.5 4v6" />
      <path d="M19.5 4v6" />
      <path d="M13.5 10h6" />
    </>
  ),
  sides: (
    <>
      <path d="M7 7h10l-1 13H8L7 7Z" />
      <path d="M6 4h12" />
      <path d="M9 7 8.4 4" />
      <path d="M12 7V4" />
      <path d="M15 7l.6-3" />
    </>
  ),
  special: (
    <>
      <path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 16.5l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3Z" />
    </>
  ),
  dessert: (
    <>
      <path d="M5 12h14" />
      <path d="M6 12c0 4 2.7 7 6 7s6-3 6-7" />
      <path d="M8 10c.4-2.1 1.7-3.2 4-3.2s3.6 1.1 4 3.2" />
      <path d="M9 7c0-2 1-3 3-3s3 1 3 3" />
    </>
  ),
  skewer: (
    <>
      <path d="M12 3v18" />
      <path d="m12 21-2.2-2.8h4.4L12 21Z" />
      <path d="M8 7.2c0-1.4 1.8-2.6 4-2.6s4 1.2 4 2.6c0 1.2-1.1 2.1-2.6 2.5 1.4.4 2.4 1.2 2.4 2.3 0 1.5-1.8 2.7-4 2.7s-4-1.2-4-2.7c0-1.1 1-1.9 2.4-2.3C9.1 9.3 8 8.4 8 7.2Z" />
    </>
  ),
  baklava: (
    <>
      <path d="m6 14 6-4 6 4-6 4-6-4Z" />
      <path d="m8.2 10.6 3.8-2.6 3.8 2.6" />
      <path d="M7.4 16.3 12 19l4.6-2.7" />
      <path d="M5 14V9.8L12 5l7 4.8V14" />
    </>
  ),
  bottle: (
    <>
      <path d="M10 3h4" />
      <path d="M10.8 3v3.2l-2 2.8V19a2 2 0 0 0 2 2h2.4a2 2 0 0 0 2-2V9l-2-2.8V3" />
      <path d="M9.2 12h5.6" />
    </>
  ),
  drink: (
    <>
      <path d="M8 4h8l-1 16H9L8 4Z" />
      <path d="M7 8h10" />
      <path d="M11 4 10 2" />
      <path d="M14 4l2-2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4C11 4 5 8.5 5 15.2 5 18.2 7.1 20 10 20c6.8 0 9.8-7.4 10-16Z" />
      <path d="M4 20c3.6-5.5 8.1-8.8 13.5-10" />
    </>
  ),
  flame: (
    <>
      <path d="M12 21c4 0 7-2.6 7-6.6 0-2.6-1.2-4.6-3.6-6.4.1 2.4-.9 3.8-2.4 4.7.4-3.7-.8-6.7-3.8-9.7.2 4-1.1 5.7-2.5 7.2A6.3 6.3 0 0 0 5 14.4C5 18.4 8 21 12 21Z" />
    </>
  ),
  star: (
    <>
      <path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.9L12 16.5l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L12 3Z" />
    </>
  ),
  heart: (
    <>
      <path d="M20.4 5.6c-1.8-1.8-4.6-1.8-6.4 0L12 7.6l-2-2a4.5 4.5 0 0 0-6.4 6.4l2 2L12 20.4l6.4-6.4 2-2a4.5 4.5 0 0 0 0-6.4Z" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </>
  ),
  back: (
    <>
      <path d="M15 18 9 12l6-6" />
    </>
  ),
  play: (
    <>
      <path d="M8 5v14l11-7L8 5Z" />
    </>
  ),
  location: (
    <>
      <path d="M12 21s7-5.4 7-11a7 7 0 0 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  share: (
    <>
      <path d="M16 8a3 3 0 1 0-2.8-4" />
      <path d="M8 14a3 3 0 1 0 0 4" />
      <path d="M14 7.5 9.8 10" />
      <path d="m9.8 14 4.2 2.5" />
    </>
  )
};

export default function Icon({ name, className = "", size = 20 }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name] || ICON_PATHS.star}
    </svg>
  );
}
