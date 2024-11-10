const verifySession = async (req, res, next) => {
    if (!req.headers.authorization) return res.status(401).send({ error: 'No autorizado' });

    const token = req.headers.authorization.split(' ')[1];

    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    const json = await response.json();
    if (json.code === 0) {
        res.send(json);
    } else {
        req.user = json;
        req.user.access_token = token;
        next();
    }
}

module.exports = { verifySession };