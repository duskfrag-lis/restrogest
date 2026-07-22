interface PencilIconProps{ className?: string }

export function PencilIcon({ className }: PencilIconProps) {

    return (

        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M4 20l1-4L15 6l3 3L8 19l-4 1z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
        </svg>
    )
}