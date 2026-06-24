const checkBrokenLinks = require('../utils/checkBrokenLinks')

const urls = [
    "https://google.com",
    "https://github.com",
    "https://fakeurl123456.com"
]

checkBrokenLinks(urls).then(console.log)