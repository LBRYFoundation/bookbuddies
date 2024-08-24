import { number, input, confirm } from '@inquirer/prompts'
import colors from 'colors'
import type { Settings } from '../../types/settings'
import type { BunFile } from 'bun'

const theme = {
	prefix: '?',
	style: {
		message: colors.blue,
		defaultAnswer: (text: string) => `[${text}]`.gray
	}
}

const requestSettings = async (
	file: BunFile,
	configError: boolean
): Promise<Settings> => {
	console.log(
		configError
			? 'There was an error reading your settings file. Set them up again to start bookbuddies.'
					.red.bold
			: "Welcome to bookbuddies! Let's get some initial settings sorted.\nYou can always change these while bookbuddies is running.\n"
					.yellow
	)
	const settings: Settings = {
		version: 1,
		storageSpace: 10,
		username: null,
		sentry: false,
		advanced: {
			rpcPort: 5279,
			udpPort: 4444,
			tcpPort: 4444
		}
	}
	settings.storageSpace =
		(await number({
			message: 'How much storage space should bookbuddies use in GB?',
			default: 10,
			theme
		})) || 10
	settings.username = await input({
		message:
			"Provide a name if you want to. This is only for the LBRY Foundation, to see who's contributing.",
		theme
	})
	settings.sentry = await confirm({
		message:
			'Do you want to send error and performance reports to the LBRY Foundation? This will be done via Sentry, and will help us improve bookbuddies.',
		default: false,
		theme
	})
	if (
		await confirm({
			message: 'Do you want to set advanced LBRY SDK settings?',
			default: false,
			theme
		})
	) {
		settings.advanced.rpcPort =
			(await number({
				message: 'What port should the LBRY SDK use for JSON-RPC?',
				default: 5279,
				min: 1024,
				max: 65535,
				theme
			})) || 5279
		settings.advanced.udpPort =
			(await number({
				message:
					'What port should the LBRY SDK use for UDP communication for seeding?',
				default: 4444,
				min: 1024,
				theme
			})) || 4444
		settings.advanced.tcpPort =
			(await number({
				message:
					'What port should the LBRY SDK use for TCP communication for seeding?',
				default: 4444,
				min: 1024,
				max: 65535,
				theme
			})) || 4444
	}

	console.log(settings)
	await Bun.write(file, JSON.stringify(settings, null, 4))
	return settings
}

export default async (): Promise<Settings> => {
	const settingsFile = Bun.file('settings.json')
	return await requestSettings(settingsFile, true)
}
