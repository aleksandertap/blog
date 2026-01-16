const express = require("express");
const cookieParser = require("cookie-parser"); 
const app = express();
const jwt = require("jsonwebtoken");

const {
  createJti,
  signAccessToken,
  signRefreshToken,
  persistRefreshToken,
  rotateRefreshToken,
  setRefreshCookie,
  refreshTokensDB, 
  hashToken
} = require("./utils/token");

const authenticateToken = require("./middleware/auth");

app.use(express.json());
app.use(cookieParser()); 

const JWT_SECRET = 'your_jwt_secret_key';

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "admin" && password === "qwerty") {
      const user = { username }; 
      
      const accessToken = signAccessToken(user);
      const jti = createJti();
      const refreshToken = signRefreshToken(user, jti);
      
      await persistRefreshToken({
        user: user,
        refreshToken: refreshToken,
        jti: jti,
        ip: req.ip,
        userAgent: req.get("User-Agent") || "",
      });

      setRefreshCookie(res, refreshToken);

      res.json({ accessToken }); 
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/auth/refresh", async (req, res) => {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const doc = refreshTokensDB.find(t => t.jti === decoded.jti);
    
    if (!doc) return res.status(401).json({ message: "Token not found" });
    
    if (doc.revokedAt) {
        return res.status(401).json({ message: "Token revoked" });
    }

    const userObj = { username: doc.user };
    
    const result = await rotateRefreshToken(doc, userObj, req, res);
    
    res.json({ accessToken: result.accessToken });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/auth/logout", (req, res) => {
    try {
        const token = req.cookies.refresh_token;

        if (!token) {
            return res.status(400).json({ message: "Already logged out (No token found)" });
        }
        
        if (token) {
            const tokenHash = hashToken(token);
            const doc = refreshTokensDB.find(t => t.tokenHash === tokenHash);
            
            if (doc && !doc.revokedAt) {
                doc.revokedAt = new Date(); 
            }
        }

        res.clearCookie('refresh_token', { 
            path: '/', 
            httpOnly: true 
        });

        res.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/auth/verify", authenticateToken, (req, res) => {
    try {
        res.json({ 
        message: "You are authorized!", 
        user: req.user // Contains the data decoded by the middleware
    });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

const PORT = 5006;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});