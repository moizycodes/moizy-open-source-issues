async function checkBrokenLinks(urls) {
    const result = [];


    for (let url of urls) {
        try {
            const res = await fetch(url);
            result.push({
                url: url,
                statusCode: res.status,
                status: res.status === 200 ? "valid" : "Broken"
            });
        } catch (err) {
            result.push({
                url: url,
                status: "broken",
            });
        }

    }
    return result
}

module.exports = checkBrokenLinks;