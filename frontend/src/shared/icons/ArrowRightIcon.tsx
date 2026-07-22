interface ArrowRightIconProps { className?: string }

export function ArrowRightIcon({ className }: ArrowRightIconProps) {

    return (

        <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}