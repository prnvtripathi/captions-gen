"use client"

import { CloudUpload, LoaderPinwheel } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UploadButton() {

    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()

    async function upload(e) {
        e.preventDefault()
        const files = e.target.files
        if (files.length === 0) {
            toast.error("No file selected")
            return
        }
        const file = files[0]
        setIsUploading(true)
        const res = await axios.postForm(
            "/api/upload", {
            file
        })
        // console.log(res.data)
        setIsUploading(false)
        if (res.data.error) {
            toast.error(res.data.error)
            return
        }
        router.push(`/video/${res.data.newName}`)
    }

    return (
        <>
            <label className="flex items-center justify-center mx-auto gap-1 bg-green-600 hover:bg-green-700 shadow-xl w-36 px-1 py-1.5 rounded-lg">
                {isUploading
                    ? <LoaderPinwheel size={20} color="#fff" strokeWidth={2} className="spin" />
                    : <CloudUpload size={20} color="#fff" strokeWidth={2} />
                }
                <span>
                    {isUploading ? "Uploading" : "Upload"}
                </span>
                <input onChange={upload} type="file" className="hidden" />
            </label>
        </>

    )
}
