import { PASSWORD_RULES } from "../../../../shared/utils/passwordRules";
import { CheckIcon } from "@phosphor-icons/react";
import { Icon } from "../../../../shared/icons/Icon";
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
                            {met && <Icon icon={CheckIcon} className={styles.check} weight="bold"/>}
                        </span>
                        <span className={met ? styles.labelMet : styles.label}>{rule.label}</span>
                    </li>
                )
            })}
        </ul>
    )
}