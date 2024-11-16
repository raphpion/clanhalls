export const CLAN_RANKS = [
  'GUEST',
  'CLAN_RANK_1', // 0
  'CLAN_RANK_2', // 10
  'CLAN_RANK_3', // 20
  'CLAN_RANK_4', // 30
  'CLAN_RANK_5', // 40
  'CLAN_RANK_6', // 50
  'CLAN_RANK_7', // 60
  'CLAN_RANK_8', // 70
  'CLAN_RANK_9', // 80
  'CLAN_RANK_10', // 90
  'CLAN_RANK_11', // 95
  'CLAN_RANK_12',
  'CLAN_RANK_13',
  'CLAN_RANK_14',
  'ADMINISTRATOR', // 100
  'DEPUTY_OWNER', // 125
  'OWNER', // 126
  'JMOD', // 127
] as const;

export type Rank = (typeof CLAN_RANKS)[number];

export default CLAN_RANKS;
