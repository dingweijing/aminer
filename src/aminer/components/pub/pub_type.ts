export interface PubInfo {
  title: string;
  title_zh?: string;
  abstract?: string;
  abstract_zh?: string;
  headline?: string;
  picture?: string;
  imgs?: Array<string>;
  have_method?: boolean;
  have_result?: boolean;
  pdf?: string;
  id: string;
  conf_id?: string;
  year?: number;
  num_citation?: number;
  num_viewed?: number;
  pages: { end: string; start: string };
  authors: PubAuthor[];
  venue?: {
    issue: string;
    volume: string;
    info: {
      name: string;
    };
  };
}

export interface MarkPubInfo extends PubInfo {
  t: Date;
  nt?: Date;
  comments?: string;
}

export interface PubListZoneType {
  [zonename: string]: Array<({ paper, id }: { paper: PubInfo; id: string }) => JSX.Element>;
}

export interface PubAuthor {
  name: string;
  id: string;
  name_zh: string;
}
