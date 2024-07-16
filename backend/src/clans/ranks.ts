export const CLAN_RANKS = [
  'GUEST',
  'CLAN_RANK_1',
  'CLAN_RANK_2',
  'CLAN_RANK_3',
  'CLAN_RANK_4',
  'CLAN_RANK_5',
  'CLAN_RANK_6',
  'CLAN_RANK_7',
  'CLAN_RANK_8',
  'CLAN_RANK_9',
  'CLAN_RANK_10',
  'CLAN_RANK_11',
  'CLAN_RANK_12',
  'CLAN_RANK_13',
  'CLAN_RANK_14',
  'ADMINISTRATOR',
  'DEPUTY_OWNER',
  'OWNER',
  'JMOD',
] as const;

export type Rank = (typeof CLAN_RANKS)[number];

export default CLAN_RANKS;
