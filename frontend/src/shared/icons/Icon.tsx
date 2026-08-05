import type { Icon as PhosphorIcon } from "@phosphor-icons/react"

interface IconProps {
    icon: PhosphorIcon
    className?: string
    size?: number
    weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone"
    color?: string
}

export function Icon({ icon: IconComponent, className, size, weight = "fill", color }: IconProps) {
    return <IconComponent className={className} size={size} weight={weight} color={color} />
}