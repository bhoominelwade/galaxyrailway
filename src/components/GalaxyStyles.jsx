export const PREFIXES = [
  'Aurora', 'Nebula', 'Cosmo', 'Galactica', 'Stellar', 'Lunar', 'Solar', 'Astral', 'Celestial', 'Ecliptica',
  'Quasar', 'Supernova', 'Pulsar', 'Meteor', 'Comet', 'Asteroid', 'Orbitron', 'Nova', 'Eon', 'Radiant',
  'Andromeda', 'Orion', 'Vega', 'Sirius', 'Lyra', 'Arcturus', 'Betelgeuse', 'Polaris', 'Proxima', 'Centauri',
  'Deneb', 'Rigel', 'Altair', 'Antares', 'Alcor', 'Mizar', 'Capella', 'Draco', 'Hercules', 'Phoenix',
  'Taurus', 'Virgo', 'Libra', 'Gemini', 'Leo', 'Pisces', 'Sagitta', 'Perseus', 'Hydra', 'Pegasus',
  'Zenith', 'Apex', 'Equinox', 'Solstice', 'Auriga', 'Cassiopeia', 'Cygnus', 'Ursa', 'Corvus', 'Crux',
  'Volans', 'Pavo', 'Carina', 'Horologium', 'Octans', 'Reticulum', 'Telescopium', 'Microscopium', 'Apus', 'Indus',
  'Lycaon', 'Sagittarius', 'Scorpio', 'Lupus', 'Camelopardalis', 'Eridanus', 'Fornax', 'Hydrus', 'Lynx', 'Monoceros'
];

export const SUFFIXES = [
  'Prime', 'Major', 'Minor', 'X', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta',
  'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi',
  'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'Hyperion', 'Ethereal',
  'Void', 'Matrix', 'Cluster', 'Nebula', 'Vortex', 'Cloud', 'System', 'Vanguard', 'Horizon', 'Eclipse',
  'Pioneer', 'Voyager', 'Endeavor', 'Discovery', 'Odyssey', 'Frontier', 'Infinity', 'Chronos', 'Spectra', 'Nexus',
  'Etherea', 'Genesis', 'Helix', 'Paradox', 'Zenith', 'Abyss', 'Beacon', 'Catalyst', 'Haven', 'Pinnacle',
  'Eon', 'Nova', 'Radiance', 'Vesper', 'Momentum', 'Nebulon', 'Astralis', 'Aurion', 'Celest', 'Equinox',
  'Solara', 'Eventide', 'Aether', 'Dominion', 'Apex', 'Celerity', 'Eminence', 'Vortex', 'Arcadia', 'Elysium'
];
export const GALAXY_COLORS = [
  { core: '#2e47a9', arms: ['#1c3471', '#1a4d72', '#4c7392', '#70b3cc'], dust: '#1a4d72' },
  { core: '#442fa7', arms: ['#6f37dd', '#442fa7', '#323f4e', '#5844e4'], dust: '#3c3c64' },
  { core: '#c72550', arms: ['#7F2E61', '#934481', '#fb3f16', '#5c1535'], dust: '#7F2E61' },
  { core: '#107276', arms: ['#11b3b4', '#10565a', '#305979', '#35DCF7'], dust: '#105555' },
  { core: '#6768CB', arms: ['#3c104e', '#613b68', '#3c104e', '#583990'], dust: '#3c104e' },
  { core: '#FF6743', arms: ['#D71049', '#A01C4F', '#FFD310', '#EAF7B6'], dust: '#681955' },
  { core: '#44596E', arms: ['#3C4E60', '#CDD3D7', '#F75C4C', '#AB69C6'], dust: '#2C3843' },
  { core: '#FF8922', arms: ['#E36410', '#F68E32', '#FFD41F', '#FEF5D0'], dust: '#CA5A10' },
  { core: '#26B095', arms: ['#2ACCAC', '#37BE70', '#3EDC81', '#B2E9DE'], dust: '#1E7665' },
  { core: '#3990C9', arms: ['#44A8EB', '#6DBEF2', '#95D1F9', '#BEE6FF'], dust: '#255370' },
  { core: '#8D4CA8', arms: ['#9E54BD', '#AB69C6', '#D3ABE3', '#F8EAFF'], dust: '#613E6F' },
  { core: '#3EDC81', arms: ['#37BE70', '#32A964', '#2E9459', '#E5FFF3'], dust: '#246542' },
  { core: '#F75C4C', arms: ['#D0493B', '#B94236', '#A23B31', '#FFEBE8'], dust: '#742E26' },
  { core: '#FFD41F', arms: ['#FFEC7F', '#FFC481', '#FF8922', '#FEF5E0'], dust: '#8E6119' },
  { core: '#58D9C0', arms: ['#2ACCAC', '#26B095', '#249F87', '#E1FFF5'], dust: '#1E7261' },
  { core: '#6DBEF2', arms: ['#44A8EB', '#3884B6', '#31719C', '#E6FAFF'], dust: '#255370' },
  { core: '#BF8AD5', arms: ['#AB69C6', '#9858B0', '#86549A', '#FBE4FF'], dust: '#613E6F' },
  { core: '#62CE90', arms: ['#37BE70', '#32A964', '#2E9459', '#E5FFF3'], dust: '#246542' },
  { core: '#FC8073', arms: ['#F75C4C', '#D0493B', '#B94236', '#FFEBE8'], dust: '#742E26' },
  { core: '#FFE04F', arms: ['#FFD41F', '#E4BC1D', '#C7A51B', '#FFFBDF'], dust: '#8D7618' },
  { core: '#64A9D7', arms: ['#3990C9', '#3481B3', '#2F719D', '#E6FAFF'], dust: '#255370' },
  { core: '#55C3AD', arms: ['#26B095', '#239D85', '#218A75', '#B3F4E7'], dust: '#1E7261' },
  { core: '#68E69D', arms: ['#38C473', '#33AB66', '#2D9358', '#BBFBD6'], dust: '#246542' },
  { core: '#F5A876', arms: ['#EC8643', '#DA7F2E', '#BF702A', '#FFE7B0'], dust: '#885222' },
  { core: '#6D7D8E', arms: ['#44596E', '#3E5063', '#384757', '#E5E8EC'], dust: '#2B3641' },
  { core: '#FFA49A', arms: ['#FC8073', '#DD7165', '#BF702A', '#FFEBE8'], dust: '#742E26' },
  { core: '#C04A3E', arms: ['#A44136', '#88382F', '#742E26', '#FFB7B1'], dust: '#5A336A' },
  { core: '#5B1092', arms: ['#7A1DBD', '#9A3BF2', '#A410E3', '#8B78FE'], dust: '#584D9B' },
  { core: '#901030', arms: ['#B53A3A', '#C23232', '#FF5510', '#EC244C'], dust: '#9B1010' },
  { core: '#205E9B', arms: ['#2EA0FF', '#5692C4', '#6FAEB0', '#74A5FD'], dust: '#104376' },
  { core: '#657B3F', arms: ['#7B9E33', '#909010', '#AADD42', '#BDFF3F'], dust: '#5F8952' },
  { core: '#584C42', arms: ['#6C5043', '#9B5523', '#B0623D', '#DD954F'], dust: '#9B6752' },
  { core: '#3F5F5F', arms: ['#3E9B67', '#4CC381', '#76DDBA', '#9FCC9F'], dust: '#329B32' },
  { core: '#292980', arms: ['#101090', '#10109B', '#1010DD', '#5179F1'], dust: '#37509B' },
  { core: '#7A6ADD', arms: ['#8B78FE', '#A380EB', '#9A3BF2', '#CA65C3'], dust: '#5B1092' },
  { core: '#9B1010', arms: ['#C23232', '#FF7357', '#FA9082', '#FF5510'], dust: '#B53A3A' },
  { core: '#5C5CFF', arms: ['#1010FF', '#2EA0FF', '#5692C4', '#97DAFA'], dust: '#1057BB' },
  { core: '#B53A3A', arms: ['#C23232', '#9B5523', '#DD954F', '#FFA470'], dust: '#6E3622' },
  { core: '#FFE710', arms: ['#FFB510', '#FF9C10', '#FF8F60', '#FFEAC9'], dust: '#F9A68A' },
  { core: '#6FAEB0', arms: ['#5692C4', '#10DDE1', '#58E1DC', '#50F0E0'], dust: '#3F5F5F' },
  { core: '#3E9B67', arms: ['#4CC381', '#30C2BA', '#10FAAA', '#8FFFD4'], dust: '#107410' },
];

export const PLANET_PREFIXES= [
  "CosmoPrime1", "CosmoAlpha1", "CosmoBeta1", "CosmoGamma1", "CosmoDelta1", "CosmoEpsilon1", "Cosmo1", "CosmoZeta1",
  "PulsarPrime1", "PulsarAlpha1", "PulsarBeta1", "PulsarGamma1", "PulsarDelta1", "PulsarEpsilon1", "Pulsar1", "PulsarZeta1",
  "SolsticePrime1", "SolsticeAlpha1", "SolsticeBeta1", "SolsticeGamma1", "SolsticeDelta1", "SolsticeEpsilon1", "Solstice1", "SolsticeZeta1",
  "CarinaPrime1", "CarinaAlpha1", "CarinaBeta1", "CarinaGamma1", "CarinaDelta1", "CarinaEpsilon1", "Carina1", "CarinaZeta1",
  "IndusPrime1", "IndusAlpha1", "IndusBeta1", "IndusGamma1", "IndusDelta1", "IndusEpsilon1", "Indus1", "IndusZeta1",
  "NovaPrime1", "NovaAlpha1", "NovaBeta1", "NovaGamma1", "NovaDelta1", "NovaEpsilon1", "Nova1", "NovaZeta1",
  "VegaPrime1", "VegaAlpha1", "VegaBeta1", "VegaGamma1", "VegaDelta1", "VegaEpsilon1", "Vega1", "VegaZeta1",
  "LyraPrime1", "LyraAlpha1", "LyraBeta1", "LyraGamma1", "LyraDelta1", "LyraEpsilon1", "Lyra1", "LyraZeta1",
  "HydraPrime1", "HydraAlpha1", "HydraBeta1", "HydraGamma1", "HydraDelta1", "HydraEpsilon1", "Hydra1", "HydraZeta1",
  "OrionPrime1", "OrionAlpha1", "OrionBeta1", "OrionGamma1", "OrionDelta1", "OrionEpsilon1", "Orion1", "OrionZeta1",
  "AndromedaPrime1", "AndromedaAlpha1", "AndromedaBeta1", "AndromedaGamma1", "AndromedaDelta1", "AndromedaEpsilon1", "Andromeda1", "AndromedaZeta1",
  "PhoenixPrime1", "PhoenixAlpha1", "PhoenixBeta1", "PhoenixGamma1", "PhoenixDelta1", "PhoenixEpsilon1", "Phoenix1", "PhoenixZeta1",
  "DracoPrime1", "DracoAlpha1", "DracoBeta1", "DracoGamma1", "DracoDelta1", "DracoEpsilon1", "Draco1", "DracoZeta1",
  "AquilaPrime1", "AquilaAlpha1", "AquilaBeta1", "AquilaGamma1", "AquilaDelta1", "AquilaEpsilon1", "Aquila1", "AquilaZeta1",
  "CentauriPrime1", "CentauriAlpha1", "CentauriBeta1", "CentauriGamma1", "CentauriDelta1", "CentauriEpsilon1", "Centauri1", "CentauriZeta1",
  "CosmoPrime2", "CosmoAlpha2", "CosmoBeta2", "CosmoGamma2", "CosmoDelta2", "CosmoEpsilon2", "Cosmo2", "CosmoZeta2",
  "PulsarPrime2", "PulsarAlpha2", "PulsarBeta2", "PulsarGamma2", "PulsarDelta2", "PulsarEpsilon2", "Pulsar2", "PulsarZeta2",
  "SolsticePrime2", "SolsticeAlpha2", "SolsticeBeta2", "SolsticeGamma2", "SolsticeDelta2", "SolsticeEpsilon2", "Solstice2", "SolsticeZeta2",
  "CarinaPrime2", "CarinaAlpha2", "CarinaBeta2", "CarinaGamma2", "CarinaDelta2", "CarinaEpsilon2", "Carina2", "CarinaZeta2",
  "IndusPrime2", "IndusAlpha2", "IndusBeta2", "IndusGamma2", "IndusDelta2", "IndusEpsilon2", "Indus2", "IndusZeta2",
  "NovaPrime2", "NovaAlpha2", "NovaBeta2", "NovaGamma2", "NovaDelta2", "NovaEpsilon2", "Nova2", "NovaZeta2",
  "VegaPrime2", "VegaAlpha2", "VegaBeta2", "VegaGamma2", "VegaDelta2", "VegaEpsilon2", "Vega2", "VegaZeta2",
  "LyraPrime2", "LyraAlpha2", "LyraBeta2", "LyraGamma2", "LyraDelta2", "LyraEpsilon2", "Lyra2", "LyraZeta2",
  "HydraPrime2", "HydraAlpha2", "HydraBeta2", "HydraGamma2", "HydraDelta2", "HydraEpsilon2", "Hydra2", "HydraZeta2",
  "OrionPrime2", "OrionAlpha2", "OrionBeta2", "OrionGamma2", "OrionDelta2", "OrionEpsilon2", "Orion2", "OrionZeta2",
  "AndromedaPrime2", "AndromedaAlpha2", "AndromedaBeta2", "AndromedaGamma2", "AndromedaDelta2", "AndromedaEpsilon2", "Andromeda2", "AndromedaZeta2",
  "PhoenixPrime2", "PhoenixAlpha2", "PhoenixBeta2", "PhoenixGamma2", "PhoenixDelta2", "PhoenixEpsilon2", "Phoenix2", "PhoenixZeta2",
  "DracoPrime2", "DracoAlpha2", "DracoBeta2", "DracoGamma2", "DracoDelta2", "DracoEpsilon2", "Draco2", "DracoZeta2",
  "AquilaPrime2", "AquilaAlpha2", "AquilaBeta2", "AquilaGamma2", "AquilaDelta2", "AquilaEpsilon2", "Aquila2", "AquilaZeta2",
  "CentauriPrime2", "CentauriAlpha2", "CentauriBeta2", "CentauriGamma2", "CentauriDelta2", "CentauriEpsilon2", "Centauri2", "CentauriZeta2",
  "CosmoPrime3", "CosmoAlpha3", "CosmoBeta3", "CosmoGamma3", "CosmoDelta3", "CosmoEpsilon3", "Cosmo3", "CosmoZeta3",
  "PulsarPrime3", "PulsarAlpha3", "PulsarBeta3", "PulsarGamma3", "PulsarDelta3", "PulsarEpsilon3", "Pulsar3", "PulsarZeta3",
  "SolsticePrime3", "SolsticeAlpha3", "SolsticeBeta3", "SolsticeGamma3", "SolsticeDelta3", "SolsticeEpsilon3", "Solstice3", "SolsticeZeta3",
  "CarinaPrime3", "CarinaAlpha3", "CarinaBeta3", "CarinaGamma3", "CarinaDelta3", "CarinaEpsilon3", "Carina3", "CarinaZeta3",
  "IndusPrime3", "IndusAlpha3", "IndusBeta3", "IndusGamma3", "IndusDelta3", "IndusEpsilon3", "Indus3", "IndusZeta3",
  "NovaPrime3", "NovaAlpha3", "NovaBeta3", "NovaGamma3", "NovaDelta3", "NovaEpsilon3", "Nova3", "NovaZeta3",
  "VegaPrime3", "VegaAlpha3", "VegaBeta3", "VegaGamma3", "VegaDelta3", "VegaEpsilon3", "Vega3", "VegaZeta3",
  "LyraPrime3", "LyraAlpha3", "LyraBeta3", "LyraGamma3", "LyraDelta3", "LyraEpsilon3", "Lyra3", "LyraZeta3",
  "HydraPrime3", "HydraAlpha3", "HydraBeta3", "HydraGamma3", "HydraDelta3", "HydraEpsilon3", "Hydra3", "HydraZeta3",
  "OrionPrime3", "OrionAlpha3", "OrionBeta3", "OrionGamma3", "OrionDelta3", "OrionEpsilon3", "Orion3", "OrionZeta3",
  "AndromedaPrime3", "AndromedaAlpha3", "AndromedaBeta3", "AndromedaGamma3", "AndromedaDelta3", "AndromedaEpsilon3", "Andromeda3", "AndromedaZeta3",
  "PhoenixPrime3", "PhoenixAlpha3", "PhoenixBeta3", "PhoenixGamma3", "PhoenixDelta3", "PhoenixEpsilon3", "Phoenix3", "PhoenixZeta3",
  "DracoPrime3", "DracoAlpha3", "DracoBeta3", "DracoGamma3", "DracoDelta3", "DracoEpsilon3", "Draco3", "DracoZeta3",
  "AquilaPrime3", "AquilaAlpha3", "AquilaBeta3", "AquilaGamma3", "AquilaDelta3", "AquilaEpsilon3", "Aquila3", "AquilaZeta3",
  "CentauriPrime3", "CentauriAlpha3", "CentauriBeta3", "CentauriGamma3", "CentauriDelta3", "CentauriEpsilon3", "Centauri3", "CentauriZeta3"
];