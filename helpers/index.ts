export const combineDocuments = (docs: any) => {
    return docs.map((doc: any)=>doc.pageContent).join('\n\n')
}

export const formatConvHistory = (messages: any) => {
    return messages.map((message: string, i: number) => {
        if (i % 2 === 0){
            return `Human: ${message}`
        } else {
            return `AI: ${message}`
        }
    }).join('\n')
}

export function addSecondsToISOString(dateISOString, seconds) {
    const date = new Date(dateISOString);
    date.setSeconds(date.getSeconds() + seconds);
    return date.toISOString();
}
