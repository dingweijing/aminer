import { ProfileInfo } from 'aminer/components/person/person_type';
import { PubInfo } from 'aminer/components/pub/pub_type';
import { IInstitution, IJconf } from 'aminer/components/common_types';

export interface INotificationItem {
  relative_time_name: string;
  relative_time_name_zh: string;
  data: {
    data: any;
    e_pub: any[];
    e_person: any;
    et: string;
    id: string;
    img: string;
    mt: 0 | 3;
    n: number;
    name: string;
    name_zh: string;
    t: string;
    tid: string;
    uid: string;
  };
}

export interface ITopic {
  id: string;
  topic: string;
  topic_zh: string;
  score?: number;
  t?: Date;
}

export interface IFollow {
  person: ProfileInfo[];
  institutions: IInstitution[];
  jconfs: IJconf[];
  person_count: number;
  pub_count: number; // ？
  pubs_count: number; // ？
  pubs: PubInfo[];
}

export interface IRecommendEntity {
  data: any;
  e_pub: PubInfo[];
  e_person: ProfileInfo;
  et: string;
  id: string;
  img: string;
  mt: 10 | 11 | 12 | 13 | 14 | 15 | 0 | 3;
  n: number;
  name: string;
  name_zh: string;
  t: string;
  tid: string;
  uid: string;
}
