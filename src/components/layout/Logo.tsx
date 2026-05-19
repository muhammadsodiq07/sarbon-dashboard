export function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7"
        aria-hidden
      >
        <rect width="32" height="32" rx="8" fill="#10b981" />
        <path
          d="M9 12C9 10.343 10.343 9 12 9H20C21.657 9 23 10.343 23 12V12C23 13.657 21.657 15 20 15H12C10.343 15 9 16.343 9 18V18C9 19.657 10.343 21 12 21H20C21.657 21 23 22.343 23 24"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
