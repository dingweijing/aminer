export interface ProfileType {
  position?: string;
  position_zh?: string;
  affiliation?: string;
  affiliation_zh?: string;
  org?: string;
  org_zh?: string;
}
export interface ProfileInfo {
  avatar?: string;
  bind?: boolean;
  ctags?: number[];
  tags: string[];
  tags_zh: string[];
  tags_translated_zh: string[];
  id: string;
  is_downvoted?: boolean;
  is_upvoted?: boolean;
  is_following: boolean;
  num_followed?: number;
  num_upvoted?: number;
  num_viewed?: number;
  name: string;
  name_zh?: string;
  profile?: ProfileType;
  indices: {
    [key: string]: number;
  };
}

export interface IframeSpecialType {
  source: string;
  withTrajecotry: boolean;
  stype: string;
}

export interface PersonListZoneType {
  [zonename: string]: Array<({ person, id }: { person: ProfileInfo; id: string }) => JSX.Element>;
}
