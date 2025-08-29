// constants/clubLogoMap.js
const clubLogoMap = {
  // Premier League
  "Manchester City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Man City": "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",
  "Manchester United": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Man United": "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
  "Liverpool": "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
  "Arsenal": "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",
  "Chelsea": "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg",
  "Tottenham Hotspur": "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  "Spurs": "https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg",
  "Everton": "https://upload.wikimedia.org/wikipedia/en/7/7c/Everton_FC_logo.svg",
  "Leicester City": "https://upload.wikimedia.org/wikipedia/en/2/2d/Leicester_City_crest.svg",
  "Wolverhampton Wanderers": "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",
  "Wolves": "https://upload.wikimedia.org/wikipedia/en/f/fc/Wolverhampton_Wanderers.svg",

  // La Liga
  "FC Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "Barcelona": "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",
  "Real Madrid": "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",
  "Atlético Madrid": "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",
  "Sevilla FC": "https://upload.wikimedia.org/wikipedia/en/3/3b/Sevilla_FC_logo.svg",
  "Real Sociedad": "https://upload.wikimedia.org/wikipedia/en/f/f1/Real_Sociedad_logo.svg",
  "Real Betis": "https://upload.wikimedia.org/wikipedia/en/1/13/Real_betis_logo.svg",
  "Valencia CF": "https://upload.wikimedia.org/wikipedia/en/c/ce/Valenciacf.svg",
  "Getafe CF": "https://upload.wikimedia.org/wikipedia/en/7/7b/Getafe_CF_logo.svg",
  "RC Celta": "https://upload.wikimedia.org/wikipedia/en/1/12/RC_Celta_de_Vigo_logo.svg",

  // Serie A
  "Juventus": "https://upload.wikimedia.org/wikipedia/commons/1/15/Juventus_FC_2017_logo.svg",
  "Inter": "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg",
  "Milan": "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg",
  "Napoli": "https://upload.wikimedia.org/wikipedia/commons/2/28/S.S.C._Napoli_logo_2017.svg",
  "Roma": "https://upload.wikimedia.org/wikipedia/en/f/f7/AS_Roma_logo_%282017%29.svg",
  "Lazio": "https://upload.wikimedia.org/wikipedia/en/e/e4/SS_Lazio_badge_2022.svg",
  "Atalanta": "https://upload.wikimedia.org/wikipedia/en/6/62/Atalanta_BC_logo_2014.svg",
  "Torino": "https://upload.wikimedia.org/wikipedia/en/2/2e/Torino_FC_Logo.svg",
  "Cagliari": "https://upload.wikimedia.org/wikipedia/en/c/c1/Cagliari_Calcio_2015.svg",

  // Bundesliga
  "FC Bayern München": "https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_München_logo_%282017%29.svg",
  "Borussia Dortmund": "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  "Dortmund": "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
  "RB Leipzig": "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
  "Bayer 04 Leverkusen": "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
  "Borussia Mönchengladbach": "https://upload.wikimedia.org/wikipedia/commons/8/81/Borussia_Mönchengladbach_logo.svg",
  "Eintracht Frankfurt": "https://upload.wikimedia.org/wikipedia/commons/0/04/Eintracht_Frankfurt_Logo.svg",
  "VfL Wolfsburg": "https://upload.wikimedia.org/wikipedia/commons/f/f3/VfL_Wolfsburg_Logo.svg",

  // Ligue 1
  "Paris Saint-Germain": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  "PSG": "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",
  "AS Monaco": "https://upload.wikimedia.org/wikipedia/en/b/ba/AS_Monaco_FC.svg",
  "Olympique Lyonnais": "https://upload.wikimedia.org/wikipedia/en/c/c6/Olympique_Lyonnais.svg",
  "LOSC Lille": "https://upload.wikimedia.org/wikipedia/en/4/41/Lille_OSC_logo.svg",

  // Other Leagues
  "Ajax": "https://upload.wikimedia.org/wikipedia/en/7/79/Ajax_Amsterdam.svg",
  "FC Porto": "https://upload.wikimedia.org/wikipedia/en/f/f1/FC_Porto.svg",
  "SL Benfica": "https://upload.wikimedia.org/wikipedia/en/a/a2/SL_Benfica_logo.svg",
  "Grêmio": "https://upload.wikimedia.org/wikipedia/en/f/f1/Gremio.svg",
  "Guangzhou Evergrande Taobao FC": "https://upload.wikimedia.org/wikipedia/en/3/3b/Guangzhou_Evergrande_Taobao_F.C._logo.svg",
  "Shanghai SIPG FC": "https://upload.wikimedia.org/wikipedia/en/8/83/Shanghai_SIPG_FC_logo.svg",
};

function normalizeKey(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\w]/g, "");
}

/**
 * Try to resolve a club name to a logo URL.
 * resolution order:
 * - exact match in map
 * - normalized exact match
 * - fuzzy includes (club contains map key or vice versa)
 */
export function getClubLogo(name) {
  if (!name) return null;

  // Exact match
  if (clubLogoMap[name]) return clubLogoMap[name];

  // normalized exact match
  const norm = normalizeKey(name);
  for (const k of Object.keys(clubLogoMap)) {
    if (normalizeKey(k) === norm) return clubLogoMap[k];
  }

  // fuzzy includes
  for (const k of Object.keys(clubLogoMap)) {
    const nk = normalizeKey(k);
    if (norm.includes(nk) || nk.includes(norm)) return clubLogoMap[k];
  }

  return null;
}

export default clubLogoMap;