import { GetTranscriptionJobCommand, StartTranscriptionJobCommand, TranscribeClient } from "@aws-sdk/client-transcribe"
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { auth } from "@/auth"

export async function GET(req) {
    const url = new URL(req.url)
    const searchParams = new URLSearchParams(url.searchParams)
    const filename = searchParams.get("filename")

    const session = await auth()
    if (!session) {
        return Response.json({ error: "Please sign in to transcribe a video" }, { status: 401 })
    }
    const userId = session?.user?.id

    // check if ready transcription exists
    const transcription = await getTranscription(userId, filename)
    if (transcription) {
        return Response.json({
            status: 'COMPLETED',
            transcription,
        });
    }

    // check if job exists
    const existingJob = await getJob(userId, filename)


    if (!existingJob) {
        const job = await createTranscriptionCommandjob(userId, filename)
        return Response.json({
            status: job.TranscriptionJob.TranscriptionJobStatus,
        })
    } else {
        return Response.json({
            status: existingJob.TranscriptionJob.TranscriptionJobStatus,
        })
    }

}

function getTranscribeClient() {
    return new TranscribeClient({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    })
}

function createTranscriptionCommand(userId, filename) {
    return new StartTranscriptionJobCommand({
        TranscriptionJobName: `${userId}-${filename}-transcription`,
        OutputBucketName: process.env.S3_BUCKET_NAME,
        OutputKey: `${userId}/${filename}.json`,
        IdentifyLanguage: true,
        Media: {
            MediaFileUri: `s3://${process.env.S3_BUCKET_NAME}/${userId}/${filename}`
        }
    })
}

async function createTranscriptionCommandjob(userId, filename) {
    const transcribeClient = getTranscribeClient()
    const transcriptionCommand = createTranscriptionCommand(userId, filename)
    return await transcribeClient.send(transcriptionCommand)
}

async function getJob(userId, filename) {
    const transcribeClient = getTranscribeClient()
    let jobStatus = null
    try {
        const transcriptionJobStatus = new GetTranscriptionJobCommand({
            TranscriptionJobName: `${userId}-${filename}-transcription`
        })
        jobStatus = await transcribeClient.send(transcriptionJobStatus)
    } catch (error) {
        console.log("Job not found, creating new job")
    }

    return jobStatus
}

async function getTranscription(userId, filename) {
    const transcriptionFileName = `${userId}/${filename}.json`
    const s3client = new S3Client({
        region: "ap-south-1",
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY
        }
    })
    const getObjectCommand = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: transcriptionFileName
    })

    let transcriptionFileResponse = null;
    try {
        transcriptionFileResponse = await s3client.send(getObjectCommand);
    } catch (e) { }
    if (transcriptionFileResponse) {
        return JSON.parse(
            await streamToString(transcriptionFileResponse.Body)
        );
    }
    return null;
}

async function streamToString(stream) {
    const chunks = [];
    return new Promise((resolve, reject) => {
        stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on('error', reject);
    });
}