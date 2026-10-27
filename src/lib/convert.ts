export type ConversionResult = {
	output: string
	error: string | null
}

/** Runs a synchronous conversion and turns a thrown error into a result for the UI. */
export function runConversion(convert: () => string, fallbackMessage: string): ConversionResult {
	try {
		return { output: convert(), error: null }
	} catch (err) {
		return { output: '', error: err instanceof Error ? err.message : fallbackMessage }
	}
}
