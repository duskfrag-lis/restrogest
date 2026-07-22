interface PhoneIconProps{ className?: string } 

export function PhoneIcon({ className }: PhoneIconProps) {

    return (

        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M6 3h2.5l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5V16a2 2 0 0 1-2 2C11 18 4 11 4 5a2 2 0 0 1 2-2z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    )
}