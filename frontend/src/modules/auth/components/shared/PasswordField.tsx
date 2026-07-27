import { useState, forwardRef, type InputHTMLAttributes } from 'react'
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react'
import { Icon } from '../../../../shared/icons/Icon'
import styles from './PasswordField.module.css'

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement>

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(props, ref) {

    const [visible, setVisible] = useState(false)

    return (

        <div className={styles.wrapper}>
                <input
                    {...props}
                    ref={ref}
                    type={visible ? 'text' : 'password'}
                    className={styles.input}
                />
                <button
                    type="button"
                    className={styles.toggle}
                    onClick={() => setVisible((current) => !current)}
                    aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    <Icon icon={visible ? EyeSlashIcon : EyeIcon}  className={styles.icon} weight="bold" />
                </button>
            </div>
    )
}) 