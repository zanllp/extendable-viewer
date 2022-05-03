
// Optional frames per second argument.

export const videoRecordFromCanvas = (canvas = document.querySelector('canvas')) => {
  const stream = canvas!.captureStream(25)
  const recordedChunks: any[] = []

  console.log(stream)
  const options = { mimeType: 'video/webm; codecs=vp9' }
  const mediaRecorder = new MediaRecorder(stream, options)

  mediaRecorder.ondataavailable = handleDataAvailable
  mediaRecorder.start()

  function handleDataAvailable (this: MediaRecorder, event: BlobEvent) {
    console.log('data-available')
    if (event.data.size > 0) {
      recordedChunks.push(event.data)
      console.log(recordedChunks)
      download()
    } else {
      // ...
    }
  }
  function download () {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style.display = 'none'
    a.href = url
    a.download = 'test.webm'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return {
    mediaRecorder,
    recordedChunks,
    download
  }
}
