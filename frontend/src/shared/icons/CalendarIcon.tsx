interface CalendarIconProps { className?: string }

export function CalendarIcon({ className }: CalendarIconProps) {

    return (

        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.8" />
            <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="currentColor" strokeWidth="1.8" />
            <line x1="7.5" y1="3" x2="7.5" y2="6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="16.5" y1="3" x2="16.5" y2="6.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    )
}