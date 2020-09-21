export interface CardRefType {
  show: ({
    target,
    sid,
    position,
  }: {
    target: EventTarget | null;
    sid: string;
    position: object;
    params: object;
  }) => void;
}

export interface IUser {
  avatar: string;
  client_id: string;
  created_time: string;
  email: string;
  id: string;
  name: string;
  phone: string | null;
  role: string[] | undefined;
  username: string;
  bind: string;
  raw_info: {
    addr?: string;
    bind?: string;
    org?: string;
    gender: number;
    phone?: string[] | null;
    src: string;
    sub: boolean;
    title: string;
  };
}

export interface IUserInfo {
  avatar: string;
  client_id: string;
  created_time: string;
  email: string;
  id: string;
  name: string;
  fname: string;
  lname: string;
  phone: string | null;
  role: string[] | undefined;
  username: string;
  addr?: string;
  bind?: string;
  org?: string;
  gender: number;
  src: string;
  sub: boolean;
  title: string;
  influence?: number;
  popularity?: number;
  socialstat: {
    fc_total?: number;
    fc_experts?: number;
    fc_jconf?: number;
    fc_pubs?: number;
    fc_topics?: number;
    fc_mustreadings?: number;
    fc_channels?: number;
    fc_institutes?: number;
    fc_user?: number;
    followers?: number;
  };
}

export interface IMatch<Params extends { [K in keyof Params]?: string } = {}> {
  params: Params;
  isExact: boolean;
  path: string;
  url: string;
}

// FIXME: xenaluo
export interface IInstitution {
  title: string;
}

// FIXME: xenaluo
export interface IJconf {
  title: string;
  id: string;
}

export interface IChannelItem {
  display_name: {
    cn: string;
    en: string;
  };
  domain_id: number;
  id: string;
  stats: {
    paperCount: number;
    jconfTotal: number;
  };
}

export interface IKeyword {
  count: number;
  id: string;
  label: string;
  topic: string;
  topic_zh: string;
}
export interface IKeywordSuggest {
  graph?: object;
  payload?: {
    text?: string;
    id?: string;
  };
  score?: number;
  text: string;
  type?: string;
}
export interface IKeywordSocial {
  id: string;
  name: string;
  input_name: string;
  name_zh?: string;
}
export interface IRecommondExpert {
  avatar: string;
  count: number;
  id: string;
  label: string;
  name_zh: string | null;
  value: string;
}

export enum ICategoryTtpe {
  PUB = 'p',
}
export interface IFollowCategory {
  color: string;
  f_type: ICategoryTtpe;
  id: string;
  name: string;
  uid: string;
}

export interface IAuthorBase {
  id: string;
  name: string;
  name_zh: string;
  img: string;
}
