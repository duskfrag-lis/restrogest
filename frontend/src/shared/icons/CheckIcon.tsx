interface CheckIconProps {

    className?: string
}

export function CheckIcon({ className }: CheckIconProps) {

    return (

        <svg viewBox="0 0 16 16" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3 8.5l3 3 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}