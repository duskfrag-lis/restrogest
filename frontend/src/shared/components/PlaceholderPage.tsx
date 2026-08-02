interface PlaceholderPageProps {

    title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {

    return (

        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <h1>{title} - pendiente de desarrollo</h1>
        </div>
    )
}