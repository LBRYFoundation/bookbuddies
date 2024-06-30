import { coreEvents, start } from '../core/core.js'
import ora from 'ora'
import 'colors'
import readline from 'readline-sync'

console.log('bookbuddies'.bgMagenta.bold)
console.log(
	'Participate in the Community Reflector by the LBRY Foundation'.magenta
)

const settingsFile = Bun.file('settings.json')
if (!(await settingsFile.exists())) {
	console.log(
		"\nWelcome to bookbuddies! Let's get some initial settings sorted.\nYou can always change these while bookbuddies is running.\n"
			.yellow
	)
	const settings: {
		storageSpace: number
		username: string
		advanced: { rpcPort: number; udpPort: number; tcpPort: number }
	} = {
		storageSpace: 10,
		username: '',
		advanced: {
			rpcPort: 5279,
			udpPort: 4444,
			tcpPort: 4444
		}
	}
	settings.storageSpace = readline.questionInt(
		'How much storage should bookbuddies use? (in GB) '.blue +
			'[default: 10] '.gray,
		{
			defaultInput: '10'
		}
	)
	settings.username = readline.question(
		"Would you like to provide a name? This is only for the LBRY Foundation, to see who's contributing. "
			.blue + '[optional] '.gray,
		{
			defaultInput: ''
		}
	)
	if (
		readline.keyInYN(
			'Do you want to set advanced LBRY SDK settings? '.blue + '[y/n] '.gray,
			{
				guide: false
			}
		)
	) {
		settings.advanced.rpcPort = readline.questionInt(
			'What port should the LBRY SDK use for JSON-RPC? '.blue +
				'[default: 5279] '.gray,
			{
				min: 1024,
				max: 65535,
				defaultInput: '5279'
			}
		)
		settings.advanced.udpPort = readline.questionInt(
			'What port should the LBRY SDK use for UDP communication for seeding? '
				.blue + '[default: 4444] '.gray,
			{
				min: 1024,
				max: 65535,
				defaultInput: '4444'
			}
		)
		settings.advanced.tcpPort = readline.questionInt(
			'What port should the LBRY SDK use for TCP communication for seeding? '
				.blue + '[default: 4444] '.gray,
			{
				min: 1024,
				max: 65535,
				defaultInput: '4444'
			}
		)
	}

	console.log(settings)
}

let currentSpinner = ora({ text: 'Checking for the LBRY SDK', spinner: 'bouncingBar' }).start()

coreEvents.on('lbrynet exists', (exists) => {
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
	currentSpinner = ora({ text: 'Starting the LBRY SDK', spinner: 'bouncingBar' }).start()
})
coreEvents.on('lbrynet start', () => {
	currentSpinner.succeed('Started the LBRY SDK')
})
coreEvents.on('lbrynet start error', () => {
	currentSpinner.fail('Failed to start the LBRY SDK')
})

await start()
