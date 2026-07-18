import { forwardRef, type InputHTMLAttributes } from "react";
import styles from './AuthTextInput.module.css'

type AuthTextInputProps = InputHTMLAttributes<HTMLInputElement>

export const AuthTextInput = forwardRef<HTMLInputElement, AuthTextInputProps>(
    function AuthTextInput(props, ref) {

        return <input { ...props} ref={ref} className={styles.input} />
    }
)