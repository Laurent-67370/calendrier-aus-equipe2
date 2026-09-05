const admin = require('firebase-admin');

// --- Les données initiales pour l'ÉQUIPE 2 ---
// MODIFICATION : L'effectif est maintenant de 8 joueurs
const playersData = [ 
    { id: 1, name: 'Joueur 1' }, { id: 2, name: 'Joueur 2' }, { id: 3, name: 'Joueur 3' }, 
    { id: 4, name: 'Joueur 4' }, { id: 5, name: 'Joueur 5' }, { id: 6, name: 'Joueur 6' },
    { id: 7, name: 'Joueur 7' }, { id: 8, name: 'Joueur 8' }
];
const getDefaultComposition = () => ({ available: [], unavailable: [], noresponse: playersData.map(p => p.id), selected: [] });
const getDefaultScore = () => ({ alsatia: 0, opponent: 0 });

const initialMatchesData = [
    // Saison 2026-2027 — HONNEUR poule D, 1ère phase (J1-J7)
    // Source : PDF A6R "Saison 2026-2027 - Calendrier de 1ère Phase" (impression du 25-08-2026)
    // Les matchs 2025-2026 restent en base avec season: '2025-2026'.
    { id: 'N1', journee: 1, homeTeam: 'ILLKIRCH GRAFFENSTADEN AP 2', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-09-11', time: '20h15', venue: 'away', month: 'september', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'N2', journee: 2, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'OBERNAI CA 2', date: '2026-09-24', time: '20h15', venue: 'home', month: 'september', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'N3', journee: 3, homeTeam: 'STBG RACING CLUB 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-10-09', time: '20h15', venue: 'away', month: 'october', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'N4', journee: 4, homeTeam: 'ENT. LINGOLSHEIM/CH.STRASBOURG 1', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-10-27', time: '20h15', venue: 'away', month: 'october', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'N5', journee: 5, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'VENDENHEIM ENVOLEE 2', date: '2026-11-12', time: '20h15', venue: 'home', month: 'november', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'N6', journee: 6, homeTeam: 'DORLISHEIM SD 3', awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', date: '2026-11-27', time: '20h', venue: 'away', month: 'november', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'N7', journee: 7, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'LA WANTZENAU ST PAUL 2', date: '2026-12-17', time: '20h15', venue: 'home', month: 'december', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },

    // --- 2ème phase (RETOUR, J8-J14) — PDF AGR Secteur Départemental, ajoutée
    // le 05-09-2026 (ids M8-M14 nouveaux) ; le seed préservant composition/score
    // des matchs existants, les M8-M14 seront créés à vide puis remplis ---
    { id: 'M8',  journee: 8,  homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'ILLKIRCH GRAFFENSTADEN AP 2',      date: '2027-01-07', time: '20h15', venue: 'home', month: 'january',  season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'M9',  journee: 9,  homeTeam: 'OBERNAI CA 2',                  awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2',     date: '2027-01-29', time: '20h',   venue: 'away', month: 'january',  season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'M10', journee: 10, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'STBG RACING CLUB 1',                date: '2027-02-11', time: '20h15', venue: 'home', month: 'february', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'M11', journee: 11, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'ENT. LINGOLSHEIM/CH.STRASBOURG 1', date: '2027-02-18', time: '20h15', venue: 'home', month: 'february', season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'M12', journee: 12, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'VENDENHEIM ENVOLEE 2',             date: '2027-03-03', time: '20h',   venue: 'home', month: 'march',    season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'M13', journee: 13, homeTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2', awayTeam: 'DORLISHEIM SD 3',                  date: '2027-04-15', time: '20h15', venue: 'home', month: 'april',    season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() },
    { id: 'M14', journee: 14, homeTeam: 'LA WANTZENAU ST PAUL 2',        awayTeam: 'ALSATIA UNITAS SCHILTIGHEIM 2',    date: '2027-04-28', time: '20h',   venue: 'away', month: 'april',    season: '2026-2027', composition: getDefaultComposition(), score: getDefaultScore() }
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

    // Migration saison : les anciens matchs (J1-J14, 2025-2026) n'ont pas de champ
    // 'season' — on le rajoute pour que l'app puisse filtrer la saison en cours.
    try {
      const allSnapshot = await matchesCollection.get();
      const tagBatch = db.batch();
      let tagged = 0;
      allSnapshot.forEach(doc => {
        if (!doc.data().season) { tagBatch.update(doc.ref, { season: '2025-2026' }); tagged++; }
      });
      if (tagged > 0) { await tagBatch.commit(); console.log(`Migration saison : ${tagged} ancien(s) match(s) tagué(s) 2025-2026.`); }
    } catch (e) { console.error('Tag anciens matchs:', e); }

    // Récupérer tous les matchs existants
    const matchesSnapshot = await matchesCollection.get();
    const existingMatches = {};
    matchesSnapshot.forEach(doc => {
      existingMatches[doc.id] = doc.data();
    });

    // Ajouter ou mettre à jour les matchs
    const matchesBatch = db.batch();
    let addedCount = 0;
    let updatedCount = 0;

    initialMatchesData.forEach(match => {
      const existingMatch = existingMatches[match.id];

      if (existingMatch) {
        // Match existe déjà : préserver composition et score
        match.composition = existingMatch.composition || match.composition;
        match.score = existingMatch.score || match.score;
        updatedCount++;
      } else {
        // Nouveau match
        addedCount++;
      }

      matchesBatch.set(matchesCollection.doc(match.id), match);
    });

    await matchesBatch.commit();

    // Gérer les joueurs (comme avant)
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
      body: JSON.stringify({
        message: "Base de données mise à jour avec succès.",
        matchesAdded: addedCount,
        matchesUpdated: updatedCount,
        totalMatches: initialMatchesData.length
      }),
    };
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la base : ", error);
    return { statusCode: 500, body: error.toString() };
  }
};