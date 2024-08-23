import { $ } from 'bun'
export default (await $`git rev-parse HEAD`.text()).trim()
