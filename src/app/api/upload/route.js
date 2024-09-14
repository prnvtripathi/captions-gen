import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import uniqid from "uniqid"
import { auth } from "@/auth"

export async function POST(req) {
    const session = await auth()
    if (!session) {
        return Response.json({ error: "Please sign in to upload a video" }, { status: 401 })
    }
    const formData = await req.formData()
    const file = formData.get("file")

    const { name, type } = file
    const data = await file.arrayBuffer()

    if (!type.startsWith("video")) {
        return Response.json({ error: "Invalid file type" }, { status: 400 })
    }

    const s3client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    })

    const ext = name.split(".").slice(-1)[0]
    const id = uniqid()
    const userid = session.user.id

    const newName = `${id}.${ext}`

    const uploadCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Body: data,
        ACL: "public-read",
        ContentType: type,
        Key: `${userid}/${newName}`
    })

    try {
        await s3client.send(uploadCommand)
    }
    catch (error) {
        console.log(error)
        return Response.json({ error: "Failed to upload file" }, { status: 500 })
    }

    return Response.json({ name, type, newName, id, userid })
}