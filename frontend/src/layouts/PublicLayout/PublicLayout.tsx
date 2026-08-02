import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader/PublicHeader";
import { Footer } from "./Footer/Footer";
import styles from './PublicLayout.module.css'

export function PublicLayout() {

    return (

        <div className={styles.page}>
            <PublicHeader />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}