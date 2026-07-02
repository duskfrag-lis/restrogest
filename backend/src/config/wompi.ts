import crypto from 'crypto';

const WOMPI_API_URL = process.env.WOMPI_API_URL as string;
const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY as string;
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY as string;
const WOMPI_EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET as string;

interface CreateTransactionParams {
    amountInCents: number;
    currency?: string;
    reference: string; 
    redirectUrl: string;
}

const wompiClient = {

    generateIntegritySignature(reference: string, amountInCents: number, currency: string = 'COP') {

        const raw = `${reference}${amountInCents}${currency}${WOMPI_PRIVATE_KEY}`;
        return crypto.createHash('sha256').update(raw).digest('hex');
    },

    buildCheckoutData(params: CreateTransactionParams) {

        const signature = wompiClient.generateIntegritySignature(params.reference, params.amountInCents);

        return {
            public_key: WOMPI_PUBLIC_KEY,
            currency: 'COP',
            amount_in_cents: params.amountInCents,
            reference: params.reference,
            signature: { integrity: signature },
            redirect_url: params.redirectUrl,
        };
    },

    verifyWebhookSignature(payload: any): boolean {

        const { signature, timestamp, data } = payload;

        if (!signature || !timestamp || !data) return false;

        const propertiesToCheck = signature.properties as string[];
        let concatenated = '';

        for (const prop of propertiesToCheck) {

            const value = prop.split('.').reduce((obj: any, key: string) => obj?.[key], payload);
            concatenated += value;
        }

        concatenated += timestamp;
        concatenated += WOMPI_EVENTS_SECRET;

        const computedChecksum = crypto.createHash('sha256').update(concatenated).digest('hex');

        return computedChecksum === signature.checksum;
    },

    async getTransactionStatus(transactionId: string) {

        const response = await fetch(`${WOMPI_API_URL}/transactions/${transactionId}`);

        if (!response.ok) {
            throw { status: 502, message: 'No se pudo consultar el estado de la transacción en Wompi' };
        }

        const json = await response.json() as { data: any};
        return json.data;
    },
};

export default wompiClient;