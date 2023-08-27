function formatHomeTeamName(name) {
  const regExp = /\(([^)]+)\)/;
  const betweenParenteses = regExp.exec(name);

  if (name.includes('FC')) {
    name = name.replace('FC', '').trim();
  }
  if (name.includes('FK')) {
    name = name.replace('FK', '').trim();
  }
  if (name.includes('(') && name.includes(')')) {
    name = name.replace(`(${betweenParenteses})`, '').trim();
  }

  return name;

}

function getHomeTeamName(name) {
  // console.log('name', name);

  switch (name) {
    case 'Maidenhead United':
      return 'Maidenhead Utd';
    case 'Bengaluru FC':
      return 'Bengaluru';
    case 'Lech Poznań':
      return 'Lech Poznan';
    case 'Humaitá':
      return 'Humaita';
    case 'Ceilândia':
      return 'Ceilandia';
    case 'Man Utd':
      return 'Manchester United';
    case 'NK Domzale':
      return 'Domzale';
    case 'Domžale':
      return 'Domzale';
    case 'PSV Eindhoven':
      return 'PSV';
    case 'AS Roma':
      return 'Roma';
    case 'NAC':
      return 'NAC Breda';
    case 'Raith':
      return 'Raith Rovers';
    case 'Trem AP':
      return 'Trem';
    case 'Doxa Katokopia':
      return 'Doxa';
    case 'SV Zulte Waregem':
      return 'Zulte Waregem';
    case 'Zulte-Waregem':
      return 'Zulte Waregem';
    case 'Roda JC Kerkrade':
      return 'Roda JC';
    case 'Chennaiyin FC':
      return 'Chennaiyin';
    case 'Jagiellonia Białystok':
      return 'Jagiellonia';
    case 'Legia Warszawa':
      return 'Legia Warsaw';
    case 'Mainz 05':
      return 'Mainz';
    case 'FSV Mainz':
      return 'Mainz';
    case 'FSV Mainz 05':
      return 'Mainz';
    case 'LASK':
      return 'LASK Linz';
    case 'São Luiz':
      return 'Sao Luiz';
    case 'FC Basel 1893':
      return 'Basel';
    case 'FC Midtjylland':
      return 'Midtjylland';
    case 'Accrington ST':
      return 'Accrington Stanley';
    case 'Sheffield United':
      return 'Sheff Utd';
    case 'Hertha BSC II':
      return 'Hertha Berlin II';
    case 'Sheffield Utd':
      return 'Sheff Utd';
    case 'Tala\'ea El Gaish':
      return 'Tala Al Jaish';
    case 'ADO Den Haag':
      return 'Den Haag';
    case 'AEL':
      return 'AEL Larisa';
    case 'Al Shabab Ksa':
      return 'Al Shabab';
    case 'AZ II':
      return 'AZ Reserves';
    case 'FC Barcelona':
      return 'Barcelona';
    case 'Girona FC':
      return 'Girona';
    case 'Atl. Madrid':
      return 'Atletico Madrid';
    case 'Apoel':
      return 'Apoel Nicosia';
    case 'AC Ajaccio':
      return 'Ajaccio';
    case 'AGF Aarhus':
      return 'Aarhus';
    case 'Hannover 96':
      return 'Hannover';
    case 'TSG Hoffenheim':
      return 'Hoffenheim';
    case '1899 Hoffenheim':
      return 'Hoffenheim';
    case 'Academia Deportiva Cantolao':
      return 'Academia Cantolao';
    case 'Hertha BSC':
      return 'Hertha Berlin';
    case 'Angers SCO':
      return 'Angers';
    case 'FC Koln':
      return 'Cologne';
    case 'Köln':
      return 'Cologne';
    case 'Degerfors IF':
      return 'Degerfors';
    case 'Apollon':
      return 'Apollon Limassol';
    case 'Amiens SC':
      return 'Amiens';
    case 'Oxford Utd':
      return 'Oxford United';
    case 'Arema FC':
      return 'Arema';
    case 'FC Zurich':
      return 'Zurich';
    case 'FC Utrecht':
      return 'Utrecht';
    case 'Zürich':
      return 'Zurich';
    case 'FC Halifax':
      return 'Halifax';
    case 'Halifax Town':
      return 'Halifax';
    case 'Geylang International':
      return 'Geylang';
    case 'AaB':
      return 'Aalborg';
    case 'Leicester City':
      return 'Leicester';
    case 'Darmstadt 98':
      return 'Darmstadt';
    case 'AZ':
      return 'AZ Alkmaar';
    case 'PSV II':
      return 'PSV Reserves';
    case 'Swansea':
      return 'Swansea City';
    case 'Verona':
      return 'Hellas Verona';
    case 'Luton Town F.C.':
      return 'Luton';
    case 'Luton Town':
      return 'Luton';
    case 'Al-Duhail SC':
      return 'Al Duhail';
    case 'Al-Rayyan':
      return 'Al Rayyan';
    case 'Baniyas SC':
      return 'Baniyas';
    case 'Bani Yas':
      return 'Baniyas';
    case 'CFR 1907 Cluj':
      return 'CFR Cluj';
    case 'Al-Rayyan SC':
      return 'Al Rayyan';
    case 'Maringá':
      return 'Maringa';
    case 'Retrô':
      return 'Retro';
    case 'FC Rotkreuz':
      return 'Rotkreuz';
    case 'Graafschap':
      return 'De Graafschap';
    case 'Steaua Bucharest':
      return 'FCSB';
    case 'Universidad Chile':
      return 'Universidad de Chile';
    case 'Al-Duhail':
      return 'Al Duhail';
    case 'Al-Ain':
      return 'Al Ain';
    case 'Viktoria Köln':
      return 'Viktoria Cologne';
    case 'FC Viktoria Köln':
      return 'Viktoria Cologne';
    case 'Szeged 2011':
      return 'Szeged';
    case 'Sporting CP':
      return 'Sporting Lisbon';
    case 'Sporting CP':
      return 'Sporting Lisbon';
    case 'Seattle Sounders FC':
      return 'Seattle Sounders';
    case 'Jong PSV':
      return 'PSV Reserves';
    case 'MVV Maastricht':
      return 'Maastricht';
    case 'MVV':
      return 'Maastricht';
    case 'AFC Bournemouth':
      return 'Bournemouth';
    case 'Dortmund':
      return 'Borussia Dortmund';
    case 'Leverkusen':
      return 'Bayer Leverkusen';
    case 'Mazatlan FC':
      return 'Mazatlan';
    case 'Mazatlán':
      return 'Mazatlan';
    case 'KV Mechelen':
      return 'Mechelen';
    case 'Newry City AFC':
      return 'Newry City';
    case 'NorthEast United':
      return 'Northeast United';
    case 'Munchen 1860':
      return '1860 Munich';
    case 'SC Paderborn':
      return 'Paderborn';
    case 'Western United FC':
      return 'Western United';
    case 'RKC':
      return 'RKC Waalwijk';
    case 'Wehen SV':
      return 'Wehen Wiesbaden';
    case 'Widzew Łódź':
      return 'Widzew Lodz';
    case 'Aris Limassol':
      return 'Aris';
    case 'Derby':
      return 'Derby County';
    case 'Blackburn Rovers':
      return 'Blackburn';
    case 'Hyderabad FC':
      return 'Hyderabad';
    case 'Macarthur FC':
      return 'Macarthur';
    case 'Newcastle':
      return 'Newcastle United';
    case 'Nottingham':
      return 'Nottingham Forest';
    case 'Club América':
      return 'Club America';
    case 'Aswan Sc':
      return 'Aswan';
    case 'Oldham':
      return 'Oldham Athletic';
    case 'Dorking Wanderers':
      return 'Dorking';
    case 'Dagenham & Redbridge':
      return 'Dag Red';
    case 'Dag & Red':
      return 'Dag Red';
    case 'Bradford (Park Avenue)':
      return 'Bradford PA';
    case 'Jong Ajax':
      return 'Ajax Reserves';
    case 'Ajax II':
      return 'Ajax Reserves';
    case 'Aldershot Town':
      return 'Aldershot';
    case 'Fleetwood':
      return 'Fleetwood Town';
    case 'Hamilton':
      return 'Hamilton Academical';
    case 'Grimsby':
      return 'Grimsby Town';
    case 'Utrecht II':
      return 'Utrecht Reserves';
    case 'FC Utrecht Reserves':
      return 'Utrecht Reserves';
    case 'Al-Gharafa':
      return 'Al Gharafa';
    case 'Al-Garrafa':
      return 'Al Gharafa';
    case 'Perth Glory FC':
      return 'Perth Glory';
    case 'Inter':
      return 'Inter Milan';
    case 'Albion':
      return 'Albion Rovers';
    case 'Maidstone Utd':
      return 'Maidstone';
    case 'IFK Göteborg':
      return 'Goteborg';
    case 'Al-Ahli Doha':
      return 'Al Ahli Doha';
    case 'Maidstone United':
      return 'Maidstone';
    case 'Neroca FC':
      return 'Neroca';
    case 'Notts Co':
      return 'Notts County';
    case 'NEROCA':
      return 'Neroca';
    case 'Rotherham':
      return 'Rotherham United';
    case 'Viborg FF':
      return 'Viborg';
    case 'Málaga':
      return 'Malaga';
    case 'Bhayangkara FC':
      return 'Bhayangkara';
    case 'Bhayangkara Solo':
      return 'Bhayangkara';
    case 'Al-Ahli':
      return 'Al Ahli';
    case 'Borussia Mgladbach':
      return 'Borussia Monchengladbach';
    case 'Gladbach':
      return 'Borussia Monchengladbach';
    case 'Queen\'s Park':
      return 'Queens Park';
    case 'Anorthosis Famagusta':
      return 'Anorthosis';
    case 'Odisha':
      return 'Odisha FC';
    case 'São Francisco':
      return 'Sao Francisco';
    case 'São Raimundo':
      return 'Sao Raimundo';
    case 'Sao Raimundo RR':
      return 'Sao Raimundo';
    case 'Sudeva':
      return 'Sudeva Moonlight';
    case 'Marília':
      return 'Marilia';
    case 'Inter':
      return 'Inter Milan';
    case 'Municipal Grecia':
      return 'AD Grecia';
    case 'Nova Mutum EC':
      return 'Nova Mutum';
    case 'AZ':
      return 'AZ Alkmaar';
    case 'Alkmaar':
      return 'AZ Alkmaar';
    case 'Beşiktaş':
      return 'Besiktas';
    case 'Fenerbahçe':
      return 'Fenerbahce';
    case 'Fenerbahce (Tur)':
      return 'Fenerbahce';
    case 'Fenerbahce Istanbul':
      return 'Fenerbahce';
    case 'Twente (Ned)':
      return 'Twente';
    case 'Hacken':
      return 'BK Hacken';
    case 'Hobro I.K.':
      return 'Hobro';
    case 'Hobro IK':
      return 'Hobro';
    case 'KAA Gent':
      return 'Gent';
    case 'KRC Genk':
      return 'Genk';
    case 'KÍ':
      return 'KI Klaksvik';
    case 'Lille Osc':
      return 'Lille';
    case 'Ajax Amsterdam':
      return 'Ajax';
    case 'Ludogorets 1945 Razgrad':
      return 'Ludogorets';
    case 'Ludogorets Razgrad':
      return 'Ludogorets';
    default:
      return name;
  }
}

function LCSubStr(X, Y, m, n) {
    
  var LCStuff = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  var result = 0;

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) LCStuff[i][j] = 0;
      else if (X[i - 1] === Y[j - 1]) {
        LCStuff[i][j] = LCStuff[i - 1][j - 1] + 1;
        result = Math.max(result, LCStuff[i][j]);
      } else LCStuff[i][j] = 0;
    }
  }
  return result;
}

function getFootyClubLink(name) {
  // console.log('name', name);

  switch (name) {
    case 'Ajax II':
      return 'afc-ajax-ii-400';
    case 'Chennaiyin':
      return 'chennaiyin-fc-5417';
    case 'Eibar':
      return 'sd-eibar-279';
    case 'Eindhoven':
      return 'fc-eindhoven-394';
    case 'Heracles':
      return 'heracles-almelo-370';
    case 'Karlsruher SC':
      return 'karlsruher-sc-547';
    case 'Jagiellonia':
      return 'ssa-jagiellonia-bialystok-1224';
    case 'LASK Linz':
      return 'lask-linz-595';
    case 'Lille':
      return 'lille-osc-metropole-441';
    case 'Mainz':
      return '1-fsv-mainz-05-34';
    case 'Raith Rovers':
      return 'raith-rovers-fc-1158';
    case 'Helmond Sport':
      return 'helmond-sport-395';
    case 'Legia Warsaw':
      return 'kp-legia-warszawa-112';
    case 'Fortuna Dusseldorf':
      return 'dusseldorfer-tus-fortuna-1895-545';
    case 'Odisha FC':
      return 'odisha-fc-5419';
    case 'Anderlecht':
      return 'rsc-anderlecht-61';
    case 'Basel':
      return 'fc-basel-1893-79';
    case 'Bengaluru':
      return 'bengaluru-fc-5425';
    case 'Ceilandia':
      return 'ceilandia-ec-2617';
    case 'Domzale':
      return 'nk-domzale-1972';
    case 'Fiorentina':
      return 'acf-fiorentina-471';
    case 'Napredak':
      return 'fk-napredak-krusevac-1932';
    case 'Ümraniyespor':
      return 'umraniyespor-345';
    case 'Sudeva':
      return 'sudeva-moonlight-fc-8162';
    case 'Olimpija Ljubljana':
      return 'nk-olimpija-ljubljana-115';
    case 'Nova Mutum':
      return 'nova-mutum-esporte-clube-677399';
    case 'Hertha Berlin II':
      return 'hertha-bsc-ii-6766';
    case 'Accrington Stanley':
      return 'accrington-stanley-fc-263';
    case 'Ajax Reserves':
      return 'afc-ajax-ii-400';
    case 'Dewa United':
      return 'dewa-united-fc-706876';
    case 'Al Ahli Doha':
      return 'al-ahli-sc-doha-4104';
    case 'Al-Gharafa':
      return 'al-gharafa-sc-4098';
    case 'Al Gharafa':
      return 'al-gharafa-sc-4098';
    case 'Atromitos':
      return 'pae-aps-atromitos-athens-1109';
    case 'Benfica':
      return 'sl-benfica-78';
    case 'Bhayangkara':
      return 'bhayangkara-surabaya-united-1535';
    case 'Getafe':
      return 'getafe-club-de-futbol-293';
    case 'Chaves':
      return 'gd-chaves-165';
    case 'Deportivo Municipal':
      return 'club-centro-deportivo-municipal-2805';
    case 'Nimes':
      return 'nimes-olympique-488';
    case 'Malaga':
      return 'malaga-cf-283';
    case 'Neroca':
      return 'neroca-fc-5432';
    case 'Pachuca':
      return 'cf-pachuca-1417';
    case 'Palestino':
      return 'cd-palestino-2193';
    case 'Watford':
      return 'watford-fc-155';
    case 'Aswan':
      return 'aswan-fc-1116';
    case 'Barnet':
      return 'barnet-fc-269';
    case 'Fleetwood Town':
      return 'fleetwood-town-fc-240';
    case 'Grimsby Town':
      return 'grimsby-town-fc-273';
    case 'Haras El Hodood':
      return 'haras-el-hodood-1133';
    case 'Koper':
      return 'fc-koper-1976';
    case 'Mura':
      return 'ns-mura-1991';
    case 'Real Kashmir':
      return 'real-kashmir-fc-8151';
    case 'Ballymena United':
      return 'ballymena-united-fc-2072';
   
    default:
      return '';
  }
}

module.exports = { getHomeTeamName, getFootyClubLink, LCSubStr, formatHomeTeamName };
// export default db;
