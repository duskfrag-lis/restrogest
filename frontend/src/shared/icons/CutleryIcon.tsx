interface CutleryIconProps {

    className?: string
}

export function CutleryIcon({ className }: CutleryIconProps) {

    return (

        <svg
        
            className={className}
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >

            <circle cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="4" />
            <circle cx="60" cy="60" r="24" stroke="currentColor" strokeWidth="2.5" opacity="0.6" />

            <g>
                <rect x="16" y="14" width="4" height="46" rx="2" fill="currentColor" />
                <rect x="24" y="14" width="4" height="30" rx="2" fill="currentColor" />
                <rect x="32" y="14" width="4" height="30" rx="2" fill="currentColor" />
                <path d="M16 44 h20 v6 a10 10 0 0 1 -20 0 z" fill="currentColor" />
                <rect x="24" y="50" width="4" height="56" rx="2" fill="currentColor" />
            </g>

            <g>
                <path d="M100 14 c10 0 14 10 14 20 s-4 20 -14 24 v48 h-4 V58 c-10 -4 -14 -14 -14 -24 s4 -20 14 -20 z" fill="currentColor" />
            </g>
            
        </svg>
    )
}