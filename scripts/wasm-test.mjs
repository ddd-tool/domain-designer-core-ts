import { loadWasm, match_string } from '../dist/check/index.mjs'

await loadWasm()
console.log(match_string('a', 'a'))
