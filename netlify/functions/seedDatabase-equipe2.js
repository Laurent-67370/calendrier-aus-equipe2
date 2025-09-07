const admin = require('firebase-admin');

// --- Les données initiales pour l'ÉQUIPE 2 ---
// Cette liste sera utilisée pour créer la collection "players-equipe2" la première fois.
const playersData = [ 
    { id: 1, name: 'Joueur 1' }, { id: 2, name: 'Joueur 2' }, { id: 3, name: 'Joueur 3' }, 
    { id: 4, name: 'Joueur 4' }, { id: 5, name: 'Joueur 5' }, { id: 6, name: 'Joueur 6' }
];
const getDefaultComposition = () => ({ available: [], unavailable: [], noresponse: playersData.map(p => p.id), selected: [] });
const getDefaultScore = () => ({ alsatia: 0, opponent: 0 });

const initialMatchesData = [
    // CORRECTION APPLIQUÉE ICI : '20h' a été changé en '20h00'
    { id: 'J1', journee: 1, homeTeam: 'OBERNAI CA 2', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-09-19', time: '20h00', venue: 'away', month: 'september', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J2', journee: 2, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'ENT. LINGOLSHEIM/CH.STRASBOURG 1', date: '2025-10-02', time: '20h15', venue: 'home', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J3', journee: 3, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'LA WANTZENAU ST PAUL 1', date: '2025-10-16', time: '20h15', venue: 'home', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J4', journee: 4, homeTeam: 'TT-SOUFFEL 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-10-31', time: '20h30', venue: 'away', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J5', journee: 5, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'GERSTHEIM ST DENIS 3', date: '2025-11-20', time: '20h15', venue: 'home', month: 'november', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J6', journee: 6, homeTeam: 'STBG RACING CLUB 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-12-05', time: '20h15', venue: 'away', month: 'december', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J7', journee: 7, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'VENDENHEIM ENVOLEE 2', date: '2025-12-18', time: '20h15', venue: 'home', month: 'december', composition: getDefaultComposition(), score: getDefaultScore() }
];

// Initialisation de la connexion à Firebase
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}
const db = admin.firestore();

exports.handler = async function(event, context) {
  try {
    // Initialisation des matchs
    const matchesCollection = db.collection('matches-equipe2');
    const matchesSnapshot = await matchesCollection.get();
    if (matchesSnapshot.empty) {
        const matchesBatch = db.batch();
        initialMatchesData.forEach(match => {
            matchesBatch.set(matchesCollection.doc(match.id), match);
        });
        await matchesBatch.commit();
    }

    // Initialisation des joueurs
    const playersCollection = db.collection('players-equipe2');
    const playersSnapshot = await playersCollection.get();
    if (playersSnapshot.empty) {
        const playersBatch = db.batch();
        playersData.forEach(player => {
            playersBatch.set(playersCollection.doc(String(player.id)), player);
        });
        await playersBatch.commit();
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Base de données initialisée ou déjà existante." }),
    };
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base : ", error);
    return { statusCode: 500, body: error.toString() };
  }
};