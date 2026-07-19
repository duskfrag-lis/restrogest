interface LockIconProps {

    className?: string
}

export function LockIcon({ className }: LockIconProps) {

    return (

        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
            <path
                d="M8 11V7a4 4 0 0 1 8 0v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    )
}