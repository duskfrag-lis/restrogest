import { PASSWORD_RULES } from "../../../../shared/utils/passwordRules";
import { CheckIcon } from "../../../../shared/icons/CheckIcon"; 
import styles from './PasswordChecklist.module.css'

interface PasswordChecklistProps {

    password: string
}

export function PasswordChecklist({ password }: PasswordChecklistProps) {

    return (

        <ul className={styles.list}>
            {PASSWORD_RULES.map((rule) => {

                const met = rule.test(password)

                return (
                    <li key={rule.id} className={styles.item}>
                        <span className={`${styles.dot} ${met ? styles.dotMet : ''}`}>
                            {met && <CheckIcon className={styles.check} />}
                        </span>
                        <span className={met ? styles.labelMet : styles.label}>{rule.label}</span>
                    </li>
                )
            })}
        </ul>
    )
}