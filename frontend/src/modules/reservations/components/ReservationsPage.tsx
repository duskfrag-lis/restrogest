import { useEffect, useState } from "react"
import { useAuth } from "../../auth/hooks/useAuth"
import { useRestaurantInfo } from "../../restaurant-info/hooks/useRestaurantInfo"
import { ModalOverlay } from "../../../shared/components/ModalOverlay"
import { LoginRequiredNotice } from "../../../shared/components/LoginRequiredNotice/LoginRequiredNotice"
import { EmptySection } from "../../../shared/components/EmptySection"
import { ReservationForm, type ReservationDraft } from "./ReservationForm/ReservationForm"
import { ConfirmReservation } from "./ConfirmReservation/ConfirmReservation"
import { ReservationSuccess } from "./ReservationSuccess/ReservationSuccess"
import type { Reservation, ReservationDraftValues } from "../types/reservations.types"
import styles from './ReservationsPage.module.css'

const DRAFT_STORAGE_KEY = 'reservationDraftValues'

type Step = 'form' | 'confirm' | 'success'

function loadStoredDraft(): ReservationDraftValues | null {

    const stored = sessionStorage.getItem(DRAFT_STORAGE_KEY)

    if (!stored) return null

    sessionStorage.removeItem(DRAFT_STORAGE_KEY)

    try {

        return JSON.parse(stored)

    } catch {

        return null
    }
}

export function ReservationsPage() {

    const { user } = useAuth()
    const { info, isLoading: isLoadingInfo } = useRestaurantInfo()

    const [step, setStep] = useState<Step>('form')
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [initialValues, setInitialValues] = useState<ReservationDraftValues | null>(null)
    const [draft, setDraft] = useState<ReservationDraft | null>(null)
    const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null)

    useEffect(() => {

        const stored = loadStoredDraft()

        if (stored) setInitialValues(stored)

    }, [])

    function handleContinue(values: ReservationDraft) {

        if (!user) {

            sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({

                date: values.date,
                time: values.time,
                partySize: values.partySize,
            }))

            setShowLoginModal(true)
            return
        }

        setDraft(values)
        setStep('confirm')
    }

    function handleReset() {

        setDraft(null)
        setConfirmedReservation(null)
        setStep('form')
    }

    if (isLoadingInfo) return null

    if (!info?.schedule) {

        return (
            <div className={styles.page}>
                <EmptySection message="Las reservas no están disponibles hasta que se configure el horario del restaurante." />
            </div>
        )
    }

    return (

        <div className={styles.page}>

            {step === 'form' && (
                <ReservationForm initialValues={initialValues} schedule={info.schedule} onContinue={handleContinue} />
            )}

            {step === 'confirm' && draft && (
                <ConfirmReservation
                    draft={draft}
                    onConfirmed={(r) => { setConfirmedReservation(r); setStep('success') }}
                    onBack={() => setStep('form')}
                />
            )}

            {step === 'success' && confirmedReservation && (
                <ReservationSuccess reservation={confirmedReservation} onReset={handleReset} />
            )}

            {showLoginModal && (
                <ModalOverlay onClose={() => setShowLoginModal(false)}>
                    <LoginRequiredNotice onClose={() => setShowLoginModal(false)} />
                </ModalOverlay>
            )}
        </div>
    )
}