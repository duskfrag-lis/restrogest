interface WarningIconProps { className?: string }

export function WarningIcon({ className }: WarningIconProps) {

    return (

       <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M12 3l10 18H2L12 3z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="17" r="0.9" fill="currentColor" />
        </svg> 
    )
}