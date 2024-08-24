import { randomUUID } from "node:crypto"

export const generateApiKey =  () => {
    const uuid = randomUUID().replaceAll("-", "")
    return `pdf_${uuid}`
}