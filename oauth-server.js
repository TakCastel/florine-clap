const express = require('express');
const { Octokit } = require('@octokit/rest');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REDIRECT_URI = process.env.REDIRECT_URI || `http://localhost:${PORT}/auth/callback`;

app.use(cors());
app.use(express.json());

// Route d'authentification
app.get('/auth', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=repo`;
  res.redirect(githubAuthUrl);
});

// Callback GitHub
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    return res.status(400).send('Code d\'autorisation manquant');
  }

  try {
    // Échanger le code contre un token d'accès
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description);
    }

    // Créer un JWT pour Decap CMS
    const jwtToken = jwt.sign(
      { 
        access_token: tokenData.access_token,
        token_type: 'bearer'
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Rediriger vers Decap CMS avec le token
    const cmsUrl = `http://localhost:3000/admin/#/collections?token=${jwtToken}`;
    res.redirect(cmsUrl);

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(500).send('Erreur d\'authentification: ' + error.message);
  }
});

// Route de vérification du token
app.get('/auth/verify', (req, res) => {
  const { token } = req.query;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, data: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur OAuth démarré sur le port ${PORT}`);
  console.log(`URL d'authentification: http://localhost:${PORT}/auth`);
});
