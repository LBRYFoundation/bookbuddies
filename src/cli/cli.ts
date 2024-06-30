import { coreEvents, start } from '../core/core.ts'
import ora from 'ora'
import cliProgress from 'cli-progress'

let currentSpinner = ora('Checking for the LBRY SDK').start()

coreEvents.on('lbrynet exists', (exists) => {
	if (exists) return currentSpinner.succeed('LBRY SDK exists')
	currentSpinner.text = 'Downloading the LBRY SDK'
})
coreEvents.on('lbrynet installed', () =>
	currentSpinner.succeed('Downloaded the LBRY SDK')
)

await start()
