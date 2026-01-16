const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const refreshTokensDB = []; 

const JWT_SECRET = 'your_jwt_secret_key'; 
const ACCESS_TTL = '15min';
const REFRESH_TTL_SECS = 7 * 24 * 60 * 60; 

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function createJti() {
    return crypto.randomBytes(16).toString('hex');
}

function signAccessToken(user) {
    const payload = { username: user.username };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TTL });
}

function signRefreshToken(user, jti) {
    const payload = {
        username: user.username,
        jti: jti,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TTL_SECS });
}


function setRefreshCookie(res, refreshToken) {

    const isProd = false; 

    res.cookie('refresh_token', refreshToken, {
        httpOnly: true,
        secure: isProd, 
        sameSite: 'lax', 
        path: '/',       
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
}

async function persistRefreshToken({ user, refreshToken, jti, ip, userAgent }) {
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + REFRESH_TTL_SECS * 1000);

    const newTokenEntry = {
        user: user.username,
        jti: jti,
        tokenHash: tokenHash,
        ip: ip,
        userAgent: userAgent,
        expiresAt: expiresAt,
        revokedAt: null,
        replacedByJti: null
    };
    
    refreshTokensDB.push(newTokenEntry);
    return newTokenEntry;
}

async function rotateRefreshToken(oldTokenEntry, user, req, res) {
    oldTokenEntry.revokedAt = new Date();
    
    const newJti = createJti();
    oldTokenEntry.replacedByJti = newJti;

    const newAccess = signAccessToken(user);
    const newRefresh = signRefreshToken(user, newJti);

    await persistRefreshToken({
        user: user,
        refreshToken: newRefresh,
        jti: newJti,
        ip: req.ip,
        userAgent: req.get('User-Agent') || '',
    });

    setRefreshCookie(res, newRefresh);

    return { 
        accessToken: newAccess 
    };
}

function findTokenInDB(jti) {
    return refreshTokensDB.find(t => t.jti === jti);
}

module.exports = {
    refreshTokensDB,
    findTokenInDB,
    hashToken,
    createJti,
    signAccessToken,
    signRefreshToken,
    persistRefreshToken,
    rotateRefreshToken,
    setRefreshCookie 
};