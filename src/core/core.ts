import JSZip from 'jszip'
import EventEmitter from 'events'
import fs from 'fs/promises'
import { Readable } from 'stream'

const eventEmitter = new EventEmitter()

const ensureLBRYSDK = async () => {
	// Check if the LBRY SDK for this platform is installed in the cwd.
	// If not, download it and save to the correct location.
	// The LBRY SDK is lbrynet for Linux and macOS, and lbrynet.exe for Windows.

	const path = 'lbrynet' + (process.platform === 'win32' ? '.exe' : '')
	const file = Bun.file(path)
	if (!(await file.exists())) {
		eventEmitter.emit('lbrynet exists', false)
		const lbrynetBuffer = await (
			await fetch(
				`https://github.com/lbryio/lbry-sdk/releases/latest/download/lbrynet-${process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'mac' : 'linux'}.zip`
			)
		).arrayBuffer()
		const zip = new JSZip()
		await zip.loadAsync(lbrynetBuffer)
		const lbrynet = zip.file(path)?.nodeStream()
		eventEmitter.emit('lbrynet downloaded')
		if (!lbrynet) throw new Error('Failed to download the LBRY SDK.')

		await new Promise<void>((resolve, reject) => {
			const chunks: Buffer[] = []
			lbrynet.on('data', (chunk) => chunks.push(chunk))
			lbrynet.on('end', async () => {
				await Bun.write(file, Buffer.concat(chunks))
				await fs
					.chmod(path, 0o755)
					.catch(() => console.log('Failed to make the LBRY SDK executable.'))
				eventEmitter.emit('lbrynet installed')
				resolve()
			})
		})
	} else eventEmitter.emit('lbrynet exists', true)
}

const start = async () => {
	await ensureLBRYSDK()

	eventEmitter.emit('lbrynet starting')

	// Run the LBRY SDK
	const sdkInstance = Bun.spawn([`./lbrynet`, 'start'], {
		stderr: 'pipe'
	})
	if (!sdkInstance.stderr)
		throw new Error('Failed to start the LBRY SDK: no stderr pipe')

	const outputDecoder = new TextDecoder()
	// @ts-ignore
	for await (const line of sdkInstance.stderr) {
		const lineString = outputDecoder.decode(line).trim()
		if (lineString.includes('RPC server failed to bind TCP')) {
			eventEmitter.emit('lbrynet start error', true)
			break
		}
		if (lineString.includes('on-demand fetching height 0')) {
			eventEmitter.emit('lbrynet start', true)
			break
		}
	}
}

export { eventEmitter as coreEvents, start }
