export function cleanTranscriptionItems(items) {
    items.forEach((item, key) => {
        if (!item.start_time) {
            const prevItem = items[key - 1]
            prevItem.alternatives[0].content += item.alternatives[0].content
            delete items[key]
        }
    });
    return items.map((item) => {
        const { start_time, end_time } = item
        const content = item.alternatives[0].content
        return { start_time, end_time, content }
    })
}

function secondsToSRTTime(seconds) {
    const date = new Date(parseFloat(seconds) * 1000)
    return date.toISOString().slice(11, -1).replace('.', ',')
}

export function transcriptionItemsToSRT(items) {
    let srt = ''
    let i = 1
    items.forEach(item => {
        // seq
        srt += i + '\n'
        // timestamps
        const { start_time, end_time } = item // in seconds (eg. 12.232s)
        srt +=
            secondsToSRTTime(start_time)
            + ' --> '
            + secondsToSRTTime(end_time)
            + '\n'
        // content
        srt += item.content + '\n'
        // blank line
        srt += '\n'
        i++
    })
    return srt
}