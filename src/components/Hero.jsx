import PageHeaders from './PageHeaders';
import UploadButton from './UploadButton';

export default function Hero() {
    const heading = "Captions Generator"
    const subHeading = "Generate captions for your videos in a few clicks"
    return (
        <>
            <PageHeaders heading={heading} subHeading={subHeading} />
            <UploadButton />
        </>

    )
}