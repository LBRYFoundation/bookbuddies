import JSZip from 'jszip'
import EventEmitter from 'events'

const eventEmitter = new EventEmitter()
const start = async () => {
	// Check if the LBRY SDK for this platform is installed in the cwd.
	// If not, download it and save to the correct location.
	// The LBRY SDK is lbrynet for Linux and macOS, and lbrynet.exe for Windows.

	const file = Bun.file(
		process.platform === 'win32' ? 'lbrynet.exe' : 'lbrynet'
	)
	if (!(await file.exists())) {
		eventEmitter.emit('lbrynet exists', false)
		const lbrynetBuffer = await (
			await fetch(
				`https://github.com/lbryio/lbry-sdk/releases/latest/download/lbrynet-${process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'mac' : 'linux'}.zip`
			)
		).arrayBuffer()
		const zip = new JSZip()
		await zip.loadAsync(lbrynetBuffer)
		const lbrynet = zip
			.file('lbrynet' + (process.platform === 'win32' ? '.exe' : ''))
			?.nodeStream()
		if (!lbrynet) throw new Error('Failed to download the LBRY SDK.')

		const chunks: Buffer[] = []
		lbrynet.on('data', (chunk) => chunks.push(chunk))
		lbrynet.on('end', async () => {
			await Bun.write(file, Buffer.concat(chunks))
			eventEmitter.emit('lbrynet installed')
		})
	} else eventEmitter.emit('lbrynet exists', true)
}

export { eventEmitter as coreEvents, start }
