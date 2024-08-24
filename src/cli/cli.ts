import { coreEvents, start } from '../core/core.js'
import getOrCreateConfig from './settings/settings.ts'
import ora from 'ora'
import 'colors'

console.clear()
console.log('bookbuddies'.bgMagenta.bold)
console.log(
	'Participate in the Community Reflector by the LBRY Foundation\n'.magenta
)

const config = await getOrCreateConfig()

import * as Sentry from '@sentry/bun'
import commitHash from '../common/commit-hash.ts' with { type: 'macro' }
import sentryDsn from '../common/sentry-dsn.ts' with { type: 'macro' }
if (config.sentry && typeof sentryDsn !== 'undefined' && sentryDsn !== null)
	Sentry.init({ dsn: sentryDsn, release: commitHash })

let currentSpinner = ora({
	text: 'Checking for the LBRY SDK',
	spinner: 'bouncingBar'
}).start()

coreEvents.on('lbrynet exists', (exists: boolean) => {
	if (exists) return currentSpinner.succeed('LBRY SDK exists')
	currentSpinner.text = 'Downloading the LBRY SDK'
})
coreEvents.on('lbrynet installed', () =>
	currentSpinner.succeed('Installed the LBRY SDK')
)
coreEvents.on('lbrynet downloaded', () => {
	currentSpinner.text = 'Unpacking the LBRY SDK'
	currentSpinner.color = 'yellow'
})
coreEvents.on('lbrynet starting', () => {
	currentSpinner = ora({
		text: `Starting the LBRY SDK${process.platform === 'win32' ? ', this may trigger a Windows Firewall prompt or take a long time!' : ''}`,
		spinner: 'bouncingBar'
	}).start()
})
coreEvents.on('lbrynet start', () => {
	currentSpinner.succeed('Started the LBRY SDK')
})
coreEvents.on('lbrynet start error', () => {
	currentSpinner.fail('Failed to start the LBRY SDK')
})

await start()
