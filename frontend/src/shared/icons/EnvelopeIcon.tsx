interface EnvelopeIconProps {

    className?: string
}

export function EnvelopeIcon({ className }: EnvelopeIconProps) {

    return (

        <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" />
            <path
                d="M6 12l16 14a4 4 0 0 0 4 0l16-14"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}