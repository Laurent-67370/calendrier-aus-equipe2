const admin = require('firebase-admin');

// --- Les données complètes pour l'ÉQUIPE 2 (14 matchs) ---
const playersData = [
    { id: 1, name: 'Joueur 1' }, { id: 2, name: 'Joueur 2' }, { id: 3, name: 'Joueur 3' },
    { id: 4, name: 'Joueur 4' }, { id: 5, name: 'Joueur 5' }, { id: 6, name: 'Joueur 6' },
    { id: 7, name: 'Joueur 7' }, { id: 8, name: 'Joueur 8' }
];
const getDefaultComposition = () => ({ available: [], unavailable: [], noresponse: playersData.map(p => p.id), selected: [] });
const getDefaultScore = () => ({ alsatia: 0, opponent: 0 });

const allMatchesData = [
    { id: 'J1', journee: 1, homeTeam: 'OBERNAI CA 2', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-09-19', time: '20h00', venue: 'away', month: 'september', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J2', journee: 2, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'ENT. LINGOLSHEIM/CH.STRASBOURG 1', date: '2025-10-02', time: '20h15', venue: 'home', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J3', journee: 3, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'LA WANTZENAU ST PAUL 1', date: '2025-10-16', time: '20h15', venue: 'home', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J4', journee: 4, homeTeam: 'TT-SOUFFEL 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-10-31', time: '20h30', venue: 'away', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J5', journee: 5, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'GERSTHEIM ST DENIS 3', date: '2025-11-20', time: '20h15', venue: 'home', month: 'november', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J6', journee: 6, homeTeam: 'STBG RACING CLUB 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-12-05', time: '20h15', venue: 'away', month: 'december', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J7', journee: 7, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'VENDENHEIM ENVOLEE 2', date: '2025-12-18', time: '20h15', venue: 'home', month: 'december', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J8', journee: 8, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'OBERNAI CA 2', date: '2026-01-22', time: '20h15', venue: 'home', month: 'january', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J9', journee: 9, homeTeam: 'ENT. LINGOLSHEIM/CH.STRASBOURG 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-01-28', time: '20h00', venue: 'away', month: 'january', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J10', journee: 10, homeTeam: 'LA WANTZENAU ST PAUL 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-02-11', time: '20h00', venue: 'away', month: 'february', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J11', journee: 11, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'TT-SOUFFEL 1', date: '2026-03-12', time: '20h15', venue: 'home', month: 'march', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J12', journee: 12, homeTeam: 'GERSTHEIM ST DENIS 3', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-04-03', time: '20h00', venue: 'away', month: 'april', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J13', journee: 13, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'STBG RACING CLUB 1', date: '2026-04-23', time: '20h15', venue: 'home', month: 'april', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J14', journee: 14, homeTeam: 'VENDENHEIM ENVOLEE 2', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-05-15', time: '20h00', venue: 'away', month: 'may', composition: getDefaultComposition(), score: getDefaultScore() }
];

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
    const matchesCollection = db.collection('matches-equipe2');

    // Récupérer tous les matchs existants pour préserver les compositions et scores
    const matchesSnapshot = await matchesCollection.get();
    const existingMatches = {};

    matchesSnapshot.forEach(doc => {
      existingMatches[doc.id] = doc.data();
    });

    // Mettre à jour ou créer tous les matchs
    const matchesBatch = db.batch();
    let addedCount = 0;
    let updatedCount = 0;

    allMatchesData.forEach(match => {
      const existingMatch = existingMatches[match.id];

      // Si le match existe déjà, préserver la composition et le score
      if (existingMatch) {
        match.composition = existingMatch.composition || match.composition;
        match.score = existingMatch.score || match.score;
        updatedCount++;
      } else {
        addedCount++;
      }

      matchesBatch.set(matchesCollection.doc(match.id), match);
    });

    await matchesBatch.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Base de données mise à jour avec succès.",
        addedMatches: addedCount,
        updatedMatches: updatedCount,
        totalMatches: allMatchesData.length
      }),
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la base : ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.toString(),
        message: "Erreur lors de la mise à jour de la base de données"
      })
    };
  }
};
