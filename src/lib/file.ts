function readFile(read: (reader: FileReader) => void): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(reader.result as string)
		reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))
		read(reader)
	})
}

export function readFileAsText(file: File): Promise<string> {
	return readFile((reader) => reader.readAsText(file))
}

export function readFileAsDataUrl(file: File): Promise<string> {
	return readFile((reader) => reader.readAsDataURL(file))
}

export function downloadBlob(blob: Blob, fileName: string) {
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = fileName
	link.click()
	// Revoking synchronously can cancel the download in some browsers
	setTimeout(() => URL.revokeObjectURL(url), 0)
}
