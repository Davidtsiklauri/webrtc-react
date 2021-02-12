export enum TagEnum {
  LOSER = 'LOSER',
  GOOD_GUY = 'GOOD GUY',
  MAN = 'MAN',
  WOMAN = 'WOMAN',
  SIDE_CHARACTER = 'SIDE CHARACTER',
  MAIN_CHARACTER = 'MAIN CHARACTER',
  GOD = 'GOD',
  GOD_HAND = 'GOD HAND',
}

export interface IActiveUsers {
  id: string;
  tag: TagEnum;
  address: string;
}

export type CallState = 'PENING' | 'DONE' | 'REQUEST' | 'START';

export interface IStatusState {
  status: CallState;
}
