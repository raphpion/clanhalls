export const CLAN_TITLES = [
  // Default Ranks
  'Jmod',
  'Owner',
  'Deputy Owner',
  'Administrator',
  'Guest',

  // Army ranks 1
  'Dogsbody',
  'Minion',
  'Recruit',
  'Pawn',
  'Private',
  'Corporal',
  'Novice',
  'Sergeant',
  'Cadet',

  // Army ranks 2
  'Page',
  'Noble',
  'Adept',
  'Legionnaire',
  'Lieutenant',
  'Proselyte',
  'Captain',
  'Major',
  'General',
  'Master',

  // Army ranks 3
  'Officer',
  'Commander',
  'Colonel',
  'Brigadier',
  'Admiral',
  'Marshal',

  // Gemstones
  'Opal',
  'Jade',
  'Red Topaz',
  'Sapphire',
  'Emerald',
  'Ruby',
  'Diamond',
  'Dragonstone',
  'Onyx',
  'Zenyte',

  // Non-human
  'Kitten',
  'Bob',
  'Wily',
  'Hellcat',
  'Skulled',
  'Goblin',
  'Beast',
  'Imp',
  'Gnome Child',
  'Gnome Elder',
  'Short Green Guy',

  // Regions
  'Misthalinian',
  'Karamjan',
  'Asgarnian',
  'Kharidian',
  'Morytanian',
  'Wild',
  'Kandarin',
  'Fremennik',
  'Tirannian',

  // Religions
  'Brassican',
  'Saradominist',
  'Guthixian',
  'Zamorakian',
  'Serenist',
  'Bandosian',
  'Zarosian',
  'Armadylean',
  'Xerician',

  // Rune symbols
  'Air',
  'Mind',
  'Water',
  'Earth',
  'Fire',
  'Body',
  'Cosmic',
  'Chaos',
  'Nature',
  'Law',
  'Death',
  'Astral',
  'Blood',
  'Soul',
  'Wrath',

  // Trees
  'Diseased',
  'Pine',
  'Wintumber',
  'Oak',
  'Willow',
  'Maple',
  'Yew',
  'Blisterwood',
  'Magic',

  // Skills
  'Attacker',
  'Enforcer',
  'Defender',
  'Ranger',
  'Priest',
  'Magician',
  'Runecrafter',
  'Medic',
  'Athlete',
  'Herbologist',
  'Thief',
  'Crafter',
  'Fletcher',
  'Miner',
  'Smith',
  'Fisher',
  'Cook',
  'Firemaker',
  'Lumberjack',
  'Slayer',
  'Farmer',
  'Constructor',
  'Hunter',
  'Skiller',
  'Competitor',

  // Capes
  'Holy',
  'Unholy',
  'Natural',
  'Sage',
  'Destroyer',
  'Mediator',
  'Legend',
  'Myth',
  'TzTok',
  'TzKal',
  'Maxed',

  // Skilling-focused
  'Anchor',
  'Apothecary',
  'Merchant',
  'Feeder',
  'Harpoon',
  'Carry',

  // Combat-focused
  'Archer',
  'Battlemage',
  'Artillery',
  'Infantry',
  'Smiter',
  'Looter',
  'Saviour',
  'Sniper',
  'Crusader',
  'Spellcaster',

  // Miscellaneous 1
  'Mentor',
  'Prefect',
  'Leader',
  'Supervisor',
  'Superior',
  'Executive',
  'Senator',
  'Monarch',
  'Scavenger',
  'Labourer',
  'Worker',
  'Forager',
  'Hoarder',
  'Prospector',
  'Gatherer',
  'Collector',
  'Bronze',
  'Iron',
  'Steel',
  'Gold',
  'Mithril',
  'Adamant',
  'Rune',
  'Dragon',
  'Protector',
  'Bulwark',
  'Justiciar',
  'Sentry',
  'Guardian',
  'Warden',
  'Vanguard',
  'Templar',
  'Squire',
  'Duellist',
  'Striker',
  'Ninja',
  'Inquisitor',
  'Expert',
  'Knight',
  'Paladin',
  'Goon',
  'Brawler',
  'Bruiser',
  'Scourge',
  'Fighter',
  'Warrior',
  'Barbarian',
  'Berserker',
  'Staff',
  'Crew',
  'Helper',
  'Moderator',
  'Sheriff',

  // Miscellaneous 2
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Purple',
  'Pink',
  'Grey',
  'Wizard',
  'Trickster',
  'Illusionist',
  'Summoner',
  'Necromancer',
  'Warlock',
  'Witch',
  'Seer',
  'Assassin',
  'Cutpurse',
  'Bandit',
  'Scout',
  'Burglar',
  'Rogue',
  'Smuggler',
  'Brigand',
  'Oracle',
  'Pure',
  'Champion',
  'Epic',
  'Mystic',
  'Hero',
  'Trialist',
  'Defiler',
  'Scholar',
  'Councillor',
  'Recruiter',
  'Learner',
  'Scribe',
  'Assistant',
  'Teacher',
  'Coordinator',
  'Walker',
  'Speed-Runner',
  'Wanderer',
  'Pilgrim',
  'Vagrant',
  'Record-chaser',
  'Racer',
  'Strider',
  'Doctor',
  'Nurse',
  'Druid',
  'Healer',
  'Zealot',
  'Cleric',
  'Shaman',
  'Therapist',
  'Gamer',
  'Adventurer',
  'Explorer',
  'Achiever',
  'Quester',
  'Raider',
  'Completionist',
  'Elite',
  'Firestarter',
  'Specialist',
  'Burnt',
  'Pyromancer',
  'Prodigy',
  'Ignitor',
  'Artisan',
  'Legacy',
] as const;

export type Title = (typeof CLAN_TITLES)[number];

export default CLAN_TITLES;
