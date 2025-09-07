const admin = require('firebase-admin');

const playersData = [ { id: 1, name: 'Joueur 1' }, { id: 2, name: 'Joueur 2' }, { id: 3, name: 'Joueur 3' }, { id: 4, name: 'Joueur 4' }, { id: 5, name: 'Joueur 5' }, { id: 6, name: 'Joueur 6' }];
const getDefaultComposition = () => ({ available: [], unavailable: [], noresponse: playersData.map(p => p.id), selected: [] });
const getDefaultScore = () => ({ alsatia: 0, opponent: 0 }); // Ajout du score par défaut

const initialMatchesData = [
    { id: 'J1', journee: 1, homeTeam: 'OBERNAI CA 2', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-09-19', time: '20h', venue: 'away', month: 'september', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J2', journee: 2, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'ENT. LINGOLSHEIM/CH.STRASBOURG 1', date: '2025-10-02', time: '20h15', venue: 'home', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J3', journee: 3, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'LA WANTZENAU ST PAUL 1', date: '2025-10-16', time: '20h15', venue: 'home', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J4', journee: 4, homeTeam: 'TT-SOUFFEL 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-10-31', time: '20h30', venue: 'away', month: 'october', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J5', journee: 5, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'GERSTHEIM ST DENIS 3', date: '2025-11-20', time: '20h15', venue: 'home', month: 'november', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J6', journee: 6, homeTeam: 'STBG RACING CLUB 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2025-12-05', time: '20h15', venue: 'away', month: 'december', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'J7', journee: 7, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'VENDENHEIM ENVOLEE 2', date: '2025-12-18', time: '20h15', venue: 'home', month: 'december', composition: getDefaultComposition(), score: getDefaultScore() }
];

// ... (le reste du fichier seedDatabase-equipe2.js reste identique) ...

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
    const snapshot = await matchesCollection.get();
    if (!snapshot.empty) {
      return { statusCode: 200, body: JSON.stringify({ message: "La base de données pour l'équipe 2 contient déjà des données. Aucune action n'a été effectuée." }) };
    }
    const promises = initialMatchesData.map(match => matchesCollection.doc(match.id).set(match));
    await Promise.all(promises);
    return { statusCode: 200, body: JSON.stringify({ message: `Succès ! ${initialMatchesData.length} matchs ont été ajoutés pour l'équipe 2.` }) };
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base : ", error);
    return { statusCode: 500, body: error.toString() };
  }
};