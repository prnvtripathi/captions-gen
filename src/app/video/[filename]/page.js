"use client"

import { cleanTranscriptionItems } from "@/lib/awsTranscriptionHelpers"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import ResultVideo from "@/components/ResultVideo"
import TranscriptionEditor from "@/components/TranscriptionEditor"

export default function FilePage({ params }) {
    const filename = params?.filename
    const [isFetching, setIsFetching] = useState(false)
    const [isTranscribing, setIsTranscribing] = useState(false)
    const [awsTranscriptionItems, setAwsTranscriptionItems] = useState([])
    const { data: session } = useSession()
    const userId = session?.user?.id

    useEffect(() => {
        // console.log(filename)
        getTranscription()
    }, [filename])

    async function getTranscription() {
        setIsFetching(true)
        const response = await fetch(`/api/transcribe?filename=${filename}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        setIsFetching(false)
        const status = data?.status
        const transcription = data?.transcription
        if (status === 'IN_PROGRESS') {
            setIsTranscribing(true)
            setTimeout(getTranscription, 3000)
        } else {
            setIsTranscribing(false)
            setAwsTranscriptionItems(cleanTranscriptionItems(transcription?.results?.items))
        }
    }



    if (isFetching) {
        return <div>Fetching Information</div>
    }

    if (isTranscribing) {
        return <div>Transcribing...</div>
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h1 className="text-2xl mb-2 text-white/60">Transcription</h1>
                <TranscriptionEditor
                    awsTranscriptionItems={awsTranscriptionItems}
                    setAwsTranscriptionItems={setAwsTranscriptionItems}
                />
            </div>
            <div>
                <h1 className="text-2xl mb-2 text-white/60">Result</h1>
                <ResultVideo userId={userId} filename={filename} transcriptionItems={awsTranscriptionItems} />
            </div>
        </div>
    )
}