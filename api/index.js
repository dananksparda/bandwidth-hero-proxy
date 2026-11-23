// Vercel Serverless Function — pembungkus untuk handler Netlify di
// functions/index.js. Logika kompresinya tetap di satu tempat, jadi repo ini
// tetap bisa dipakai di Netlify juga.
//
// Vercel memetakan file ini ke /api/index — path yang sama dengan yang
// diharapkan ekstensi Bandwidth Hero (…/api/index?url=…&l=40).

const { handler } = require("../functions/index");

module.exports = async (req, res) => {
    const event = {
        queryStringParameters: req.query || {},
        headers: req.headers || {},
        ip: (req.headers["x-forwarded-for"] || "").split(",")[0].trim(),
    };

    const result = await handler(event, {});

    res.status(result.statusCode || 200);
    for (const [key, value] of Object.entries(result.headers || {})) {
        res.setHeader(key, value);
    }
    if (result.isBase64Encoded && result.body) {
        res.send(Buffer.from(result.body, "base64"));
    } else if (result.body) {
        res.send(result.body);
    } else {
        res.end();
    }
};
