import { WandSparkles } from 'lucide-react'
import { Button } from './ui/button'
import { useState, useRef, useEffect } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'
import { transcriptionItemsToSRT } from '@/lib/awsTranscriptionHelpers'
import { Input } from "@/components/ui/input"
import { Label } from './ui/label'
import { Progress } from './ui/progress'
import roboto from "@/fonts/Roboto-Regular.ttf"
import robotoBold from "@/fonts/Roboto-Bold.ttf"

export default function ResultVideo({ userId, filename, transcriptionItems }) {
    const videoUrl = `https://captions-generator.s3.amazonaws.com/${userId}/${filename}`;
    const [loaded, setLoaded] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
    const [outlineColor, setOutlineColor] = useState('#000000');
    const [progress, setProgress] = useState(1);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);

    useEffect(() => {
        videoRef.current.src = videoUrl;
        load();
    }, []);

    const load = async () => {
        const ffmpeg = ffmpegRef.current;
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd'
        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        await ffmpeg.writeFile('/tmp/roboto.ttf', await fetchFile(roboto));
        await ffmpeg.writeFile('/tmp/roboto-bold.ttf', await fetchFile(robotoBold));
        setLoaded(true);
    }

    function toFFmpegColor(rgb) {
        const bgr = rgb.slice(5, 7) + rgb.slice(3, 5) + rgb.slice(1, 3);
        return '&H' + bgr + '&';
    }

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        const srt = transcriptionItemsToSRT(transcriptionItems);
        await ffmpeg.writeFile(filename, await fetchFile(videoUrl));
        await ffmpeg.writeFile('subs.srt', srt);
        videoRef.current.src = videoUrl;
        await new Promise((resolve, reject) => {
            videoRef.current.onloadedmetadata = resolve;
        });
        const duration = videoRef.current.duration;
        ffmpeg.on('log', ({ message }) => {
            const regexResult = /time=([0-9:.]+)/.exec(message);
            if (regexResult && regexResult?.[1]) {
                const howMuchIsDone = regexResult?.[1];
                const [hours, minutes, seconds] = howMuchIsDone.split(':');
                const doneTotalSeconds = hours * 3600 + minutes * 60 + seconds;
                const videoProgress = doneTotalSeconds / duration;
                setProgress(videoProgress);
            }
        });
        await ffmpeg.exec([
            '-i', filename,
            '-preset', 'ultrafast',
            '-vf', `subtitles=subs.srt:fontsdir=/tmp:force_style='Fontname=Roboto Bold,FontSize=30,MarginV=70,PrimaryColour=${toFFmpegColor(primaryColor)},OutlineColour=${toFFmpegColor(outlineColor)}'`,
            'output.mp4'
        ]);
        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src =
            URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setProgress(1);
    }
    return (
        <>
            <Button
                onClick={transcode}
                className="bg-white/10 hover:bg-white/30 flex items-center gap-1 mb-2">
                <WandSparkles size={20} color="#fff" strokeWidth={1.25} />
                Apply Captions
            </Button>
            <div className="flex gap-2 items-center mb-2">
                <div>
                    <Label>Primary Color</Label>
                    <Input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="mr-2 p-0 border-none rounded-md"
                    />
                </div>
                <div>
                    <Label>Outline Color</Label>
                    <Input
                        type="color"
                        value={outlineColor}
                        onChange={(e) => setOutlineColor(e.target.value)}
                        className="mr-2 p-0 border-none rounded-md"
                    />

                </div>
            </div>
            {!loaded && <div>Loading...</div>}
            <div className="bg-white/20 p-2 rounded-xl overflow-hidden relative">
                {progress && progress < 1 && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div>
                            <p className="text-xl text-white/80 text-center mb-2">{parseInt(progress * 100)}%</p>
                            <Progress value={parseInt(progress * 100)} className="w-96"/>
                        </div>
                    </div>
                )}
                <video
                    ref={videoRef}
                    controls
                    className="w-full rounded-xl"
                />
            </div>
        </>
    )
}