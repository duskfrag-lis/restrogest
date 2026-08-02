interface EmptySectionProps {

    message: string
}

export  function EmptySection({ message }: EmptySectionProps) {

    return (

        <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--color-text-muted)'}}>
            <p style={{ margin: 0, fontSize: 'var(--fs-base)' }}>{message}</p>
        </div>
    )
}