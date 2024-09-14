import TranscriptionItem from './TranscriptionItem'

export default function TranscriptionEditor({
    awsTranscriptionItems,
    setAwsTranscriptionItems
}) {

    function updateTranscriptionItems(index, prop, value) {
        const newItems = [...awsTranscriptionItems]
        newItems[index][prop] = value
        setAwsTranscriptionItems(newItems)
    }

    return (
        <>
            <div className="grid grid-cols-3 sticky top-0 bg-violet-800/80 p-2 rounded-md text-center">
                <div>From</div>
                <div>End</div>
                <div>Content</div>
            </div>
            {awsTranscriptionItems.length > 0 && (
                <div className="h-48 sm:h-auto overflow-y-scroll sm:overflow-auto">
                    {awsTranscriptionItems.map((item, key) => (
                        <TranscriptionItem
                            key={key}
                            item={item}
                            handleContentChange={(e) => updateTranscriptionItems(key, 'content', e.target.value)}
                            handleEndTimeChange={(e) => updateTranscriptionItems(key, 'end_time', e.target.value)}
                            handleStartTimeChange={(e) => updateTranscriptionItems(key, 'start_time', e.target.value)}
                        />
                    ))}
                </div>
            )}
        </>
    )
}