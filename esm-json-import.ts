// ESM cannot import JSON files directly as modules

// To overcome this limitation, we can use module.createRequire:
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const data = require('./data.json')
console.log(data)
