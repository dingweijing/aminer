/* eslint-disable no-param-reassign */
import { mergeWith, isArray } from 'lodash';

/**
 *  Created by BoGao on 2017-10-25;
 *
 *  Note: Next API QueryBuilder
 */
class ParamError extends Error {
  constructor(message) {
    super();
    this.name = 'ParamError';
  }
}

function apiMerge(obj, source) {
  mergeWith(obj, source, (objValue, srcValue) => {
    if (isArray(objValue)) {
      return objValue.concat(srcValue);
    }
  });
}

// basic chains
const createBasicChains = api => {
  const chains = {
    api,
    param: (params, config) => {
      if (!config || config.when) {
        if (params) {
          if (!api.parameters) {
            api.parameters = {};
          }
          Object.keys(params).map(key => {
            api.parameters[key] = params[key];
            return false;
          });
        }
      }
      return chains;
    },
    addParam: (params, config) => {
      if (!config || config.when) {
        if (!api.parameters) {
          api.parameters = {};
        }
        apiMerge(api.parameters, params);
      }
      return chains;
    },
    filter: (params, config) => {
      if (!config || config.when) {
        if (!api.parameters) {
          api.parameters = {};
        }
        api.parameters.filters = params;
      }
      return chains;
    },
    addFilter: (filterType, params, config) => {
      if (!config || config.when) {
        if (!api.parameters) {
          api.parameters = {};
        }
        api.parameters.filters = api.parameters.filters || {};
        if (!api.parameters.filters[filterType]) {
          if (isArray(params)) {
            api.parameters.filters[filterType] = [];
          } else {
            api.parameters.filters[filterType] = {};
          }
        }
        apiMerge(api.parameters.filters[filterType], params);
      }
      return chains;
    },
    schema: (schema, config) => {
      if (!config || config.when) {
        if (!api.schema) {
          api.schema = {};
        }
        api.schema = schema;
      }
      return chains;
    },
    addSchema: (schema, config) => {
      if (!config || config.when) {
        if (!api.schema) {
          api.schema = {};
        }
        apiMerge(api.schema, schema);
      }
      return chains;
    },
    primarySchema: (primarySchema, config) => {
      if (!config || config.when) {
        if (!api.primarySchema) {
          api.primarySchema = {};
        }
        api.primarySchema = primarySchema;
      }
      return chains;
    },
    addPrimarySchema: (primarySchema, config) => {
      if (!config || config.when) {
        if (!api.primarySchema) {
          api.primarySchema = {};
        }
        apiMerge(api.primarySchema, primarySchema);
      }
      return chains;
    },
  };
  return chains;
};

// Query api-builder.
const query = (action, eventName) => {
  if (!action) {
    throw new ParamError("Parameter action can't be empty.");
  }

  const api = {
    // type: 'query',
    action,
    eventName,
  };

  const chains = createBasicChains(api);
  return chains;
};

// Alter api-builder.
const alter = (action, eventName) => {
  if (!action) {
    throw new ParamError("Parameter action can't be empty.");
  }
  return createBasicChains({ action, eventName });
};

const notify = (action, eventName) => {
  if (!action) {
    throw new ParamError("Parameter action can't be empty.");
  }
  return createBasicChains({ action, eventName });
};

const create = (action, eventName) => {
  if (!action) {
    throw new ParamError("Parameter action can't be empty.");
  }
  return createBasicChains({ action, eventName });
};

/**
 * NEXT-API Query Builder
 */
const apiBuilder = {
  //
  // Query
  //
  query,

  alter,

  notify,

  create,

  // alter: () => {},
  // run: () => {},
};

// ------------------ Builtin Fields --------------------------

const F = {
  // Helper Options.

  // Type: { Query: 'query', Alter: 'alter', Magic: 'magic' },

  // all available entities in system.
  Entities: {
    Person: 'person',
    Publication: 'pub',
    Venue: 'venue',
  },

  // available person's tags.
  Tags: { systag: 'systag' },

  // query related // TODO @xiaobei 这些都是啥呀？？？
  queries: {
    search: 'search',
    RevieweRreport: 'RevieweRreport', // TODO @xiaobei ?????????,
    ReviewerQuery: 'ReviewerQuery',
    ReviewerDownloadCSV: 'ReviewerDownloadCSV',
    ReviewerClickPersons: 'ReviewerClickPersons',
  }, // query actions.

  alter: {
    alter: 'alter',
    ReviewerProject: 'ReviewerProject',
  },

  notify: { feedback: 'feedback' },

  searchType: { all: 'all', ToBPerson: 'ToBPerson' },

  // 预置的一些默认词
  // TODO thu系统上加了一个参数
  params: {
    default_aggregation: ['gender', 'h_index', 'nation', 'lang'],
  },

  // all available alter operations.
  opts: { upsert: 'upsert', update: 'update', delete: 'delete' },
  // alter operations, TODO this will be replaced by opts.
  alterop: { upsert: 'upsert', update: 'update', delete: 'delete' },

  alters: { alter: 'alter', dims: 'dims' }, // alter actions.

  // Available Fields
};

// Person related.
const fseg = {
  basic_fields: ['id', 'name', 'title', 'titles', 'name_zh', 'avatar'],
  indices_all: [
    'hindex',
    'gindex',
    'pubs',
    'citations',
    'newStar',
    'risingStar',
    'activity',
    'diversity',
    'sociability',
  ],
  // 'id', 'name', 'name_zh', 'avatar', 'tags', 'tags_translated_zh',
  // 'tags_zh', 'org', 'org_zh', 'bio', 'email', 'edu' ', phone'
};

F.fields = {
  person: { indices_all: fseg.indices_all },
  person_in_PersonList: [
    ...fseg.basic_fields,
    'tags',
    { profile: ['position', 'position_zh', 'affiliation', 'affiliation_zh', 'org', 'org_zh'] },
    { indices: fseg.indices_all },
  ],
  person_in_SmallList: [
    ...fseg.basic_fields,
    { indices: ['hindex', 'pubs', 'citations'] },
    { profile: ['affiliation', 'position'] },
  ],
  person_profile: [
    ...fseg.basic_fields,
    'tags',
    'is_follow',
    'num_view',
    'num_follow',
    'bind',
    { profile: ['position', 'position_zh', 'affiliation', 'affiliation_zh', 'org', 'org_zh'] },
    { indices: fseg.indices_all },
  ],
  person_annotation: [
    ...fseg.basic_fields,
    'is_follow',
    'num_view',
    'num_follow',
    'bind',
    'updated_time',
    {
      profile: [
        'position',
        'position_zh',
        'affiliation',
        'affiliation_zh',
        'org',
        'org_zh',
        'email',
        'homepage',
      ],
    },
    { indices: fseg.indices_all },
  ],
  person_super: [
    ...fseg.basic_fields,
    'is_follow',
    'num_view',
    'num_follow',
    'bind',
    'updated_time',
    'names',
    'names_zh', // super mode
    'name_sorted',
    'name_zh_sorted', // super mode
    {
      profile: [
        'position',
        'position_zh',
        'affiliation',
        'affiliation_zh',
        'org',
        'org_zh',
        'email',
        'homepage',
      ],
    },
    { indices: fseg.indices_all },
  ],
  trend2_trend_projects: [
    'id',
    'name',
    'desc',
    'main_topic',
    'trend_type',
    'venues',
    'ebids',
    'keywords',
    'sub_setting',
    'created_time',
    'creator',
    'creator_id',
    'updated_time',
    'star',
  ],
};
const paperSearchFields = [
  'id',
  'year',
  'title',
  'title_zh',
  'abstract',
  'abstract_zh',
  'authors',
  'authors._id',
  'authors.name',
  'keywords',
  'authors.name_zh',
  'num_citation',
  'num_viewed',
  'num_starred',
  'num_upvoted',
  'is_starring',
  'is_upvoted',
  'is_downvoted',
  'venue.info.name',
  'venue.volume',
  'venue.info.name_zh',
  'venue.info.publisher',
  'venue.issue',
  'pages.start',
  'pages.end',
  'lang',
  'pdf',
  'ppt',
  'doi',
  'urls',
  'flags',
  'resources',
];
F.fields.paper = {
  forSearch: [...paperSearchFields],
  full: [...paperSearchFields, 'labels', 'versions', 'venue.info.id', 'venue.info.type'],
  pdfInfo: [
    'id',
    'url',
    'metadata',
    'sections',
    'participants',
    'keywords',
    'summary',
    'structured_summary',
    'reference_links',
    'findings',
    'top_statements',
    'headline',
  ],
};

F.fields.eb = {
  forTree: {
    expertbase: [
      'name',
      'name_zh',
      'logo',
      'order',
      'type',
      'stats',
      'parents',
      'is_deleted',
      'is_public',
      'price',
      'report_link',
      'order',
    ],
  },
  forSearch: {
    expertbase: [
      'name',
      'name_zh',
      'logo',
      'order',
      'type',
      'parents',
      'is_deleted',
      'is_public',
      'price',
      'desc_zh',
      'desc',
      'stats',
      'created_time',
      'updated_time',
    ],
  },
  full: {
    expertbase: [
      'name',
      'name_zh',
      'logo',
      'type',
      'stats',
      'is_deleted',
      'parents',
      'is_public',
      'price',
      'report_link',
      'order',
      'desc',
      'desc_zh',
      'created_time',
      'updated_time',
      'creator',
      'system',
      'related_venues',
      'labels',
    ],
    // 'related_venues' 张伟的字段，先不加上，等他上线以后在加上
  },
  fullOrder: {
    expertbase_order: [
      'ebid',
      'transaction_price',
      'transaction_time',
      'expiration_time',
      'buyer_name',
      'stats',
      'type',
      'note',
      'price',
      'creator',
      'created_time',
      'updated_time',
      'user',
      'email',
      'eb_name',
    ],
  },
  isPay: {
    expertbase_order: ['stats'],
  },
  forList: {
    expertbase: ['name', 'name_zh', 'logo', 'type', 'tags'],
  },
};

F.fields = {
  ...F.fields,
  ...{
    comments_full: {
      comments: [
        'id',
        'system',
        'user_id',
        'title',
        'text',
        'email',
        'type',
        'target_type',
        'target_id',
        'status',
        'like',
        'liker',
        'dislike',
        'disliker',
        'user_agent',
        'created_time',
        'updated_time',
        'is_deleted',
      ],
    },
    comments_in_list: {
      comments: [
        'user_id',
        'user_name',
        'title',
        'text',
        'target_id',
        'status',
        'like',
        'liker',
        'dislike',
        'disliker',
        'created_time',
        'updated_time',
      ],
    },
    comments: {
      comments: [
        'user_id',
        'title',
        'text',
        'email',
        'type',
        'target_type',
        'target_id',
        'status',
        'like',
        'dislike',
        'created_time',
        'updated_time',
      ],
    },
    org: {
      forTree: {
        organization: ['name', 'name_zh', 'logo', 'type', 'stats', 'parents', 'is_public'],
      },
      full: {
        organization: [
          'name',
          'name_zh',
          'logo',
          'desc',
          'type',
          'stats',
          'desc_zh',
          'created_time',
          'updated_time',
          'parents',
          'creator',
          'is_public',
        ],
      },
    },

    // ------- tobProfile -------------
    tobProfile: {
      forList: {
        tob_profile: [
          'aid',
          'sid',
          'name',
          'name_zh',
          'gender',
          'title',
          'level',
          'affiliation',
          'email',
          'phone',
        ],
        // tob_profile: ["name", "name_zh", "src", "sid", "gender", "title", "level", "affiliation", "bio", "email", "phone", "confidence", "aid", "educations", "experiences", "positions", "awards", "projects"],
      },
      full: {
        // pass no schema to get full.
      },
    },

    // ------------- awards ------------------
    awards_match_group: {
      forList: {
        award_match_group: ['id', 'name', 'project_id', 'type', 'updated_time', 'is_public'],
      },
      full: {
        award_match_group: [
          'id',
          'created_time',
          'updated_time',
          'is_public',
          'matches',
          'name',
          'project_id',
          'type',
        ],
      },
    },

    // ------------- topic ---------------
    topic: {
      full: ['def', 'def_zh', 'id', 'name', 'name_zh', 'alias'],
    },

    // domain/channel
    domain: {
      topAuthor: [
        'id',
        // "tags",
        // "tags_zh",
        'name',
        'name_zh',
        'avatar',
        'org',
        {
          profile: ['position', 'position_zh', 'affiliation', 'affiliation_zh', 'org'],
        },
        {
          indices: [
            'hindex',
            'gindex',
            'pubs',
            'citations',
            'newStar',
            'risingStar',
            'activity',
            'diversity',
            'sociability',
          ],
        },
      ],
    },
  },
};

const Action = {
  search: {
    search: 'search.search',
    SearchPubs: 'publication7.SearchPubs',
    SearchPubsCommon: 'searchapi.SearchPubsCommon',
  },
  person: {
    Get: 'search.Search',
    FindPath: 'person.FindPath',
    GetPersonDeepCoreInfo: 'person.GetPersonDeepCoreInfo',
    FollowPersonByUidAid: 'person.FollowPersonByUidAid',
    UnfollowPersonByUidAid: 'person.UnfollowPersonByUidAid',
    GetPersonPubs: 'person.GetPersonPubs',
    SearchPersonAgg: 'person.SearchPersonAgg',
    GetNoteFromPerson: 'person.GetNoteFromPerson',
    SetNoteToPerson: 'person.SetNoteToPerson',
    GetPersonPubsStats: 'person.GetPersonPubsStats',
    AffirmPubToPerson: 'person.AffirmPubToPerson',
    GetProfile: 'person.GetProfile',
    RemovePubsFromPerson: 'person.RemovePubsFromPerson',
    AddPubsToPerson: 'person.AddPubsToPerson',
    GetFundsByPersonID: 'person.GetFundsByPersonID',
  },
  personRelation: {
    GetPersonRelation: 'personRelation.GetPersonRelation',
  },
  person_eb: {
    alter: 'person_eb.alter',
  },
  comments: {
    GetPersonComments: 'comments.GetTopComments',
    GetComments: 'comments.GetComments',
    CreateComment: 'comments.Alter', // = Alter
    Alter: 'comments.Alter', // TODO change to comments.Alter.
    ChangeVoteByID: 'comments.ChangeVoteByID',
    ChangeScoringStars: 'comments.ChangeScoringStars',
    GetScoringStars: 'comments.GetScoringStars',
  },
  dm_intellwords: {
    expand: 'dm_intellwords.expand',
  },
  csrank: {
    GenCsRankData: 'csrank.GenCsRankData',
  },
  reviewer: {
    ListProject: 'reviewer.ListProject',
    GetProject: 'reviewer.GetProject',
    CreateProject: 'reviewer.CreateProject',
    UpdateProject: 'reviewer.UpdateProject',
    DeleteProject: 'reviewer.DeleteProject',
    UploadPDF: 'reviewer.UploadPDF',
    GetReport: 'reviewer.GetReport',
    GetClickPersons: 'reviewer.GetClickPersons',
    DownloadCSV: 'reviewer.DownloadCSV',
    RequestCrawlList: 'reviewer.RequestCrawlList',
    SendTestMail: 'reviewer.SendTestMail',
    ConfirmTestMail: 'reviewer.ConfirmTestMail',
    SendMail: 'reviewer.SendMail',
    StartCrawl: 'reviewer.StartCrawl',
    CountProject: 'reviewer.CountProject',
    GetCrawlProgress: 'reviewer.GetCrawlProgress',
    CopyProject: 'reviewer.CopyProject',
    Statistic: 'reviewer.Statistic',
    AdjustRecord: 'reviewer.AdjustRecord',
    MergeRecord: 'reviewer.MergeRecord',
    DownloadEmailList: 'reviewer.DownloadEmailList',
    DownloadCrawlList: 'reviewer.DownloadCrawlList',
    DownloadReport: 'reviewer.DownloadReport',
    SendRandomMail: 'reviewer.SendRandomMail',
  },
  organization: {
    Search: 'search.Search',
    Alter: 'organization.Alter',
    Delete: 'organization.Delete',
    search: 'search.search', // todo delete
    Move: 'organization.Move',
  },
  expertbase: {
    Alter: 'expertbase.Alter',
    Move: 'expertbase.Move',
    Delete: 'expertbase.Delete',
    getShareEB: 'expertbase.search.Shared',
    getGlobalEB: 'expertbase.search.Global',
    PlatformGetSharedEBs: 'expertbase.search.PlatformGetSharedEBs',
    MigrateOldRoster: 'expertbase.MigrateOldRoster',
  },
  tob: {
    permission: 'tob.auth.functionpermission',
    scopedpermission: 'tob.auth.scopedpermission',
    roles: 'tob.auth.roles',
    Schema: 'tob.permission.Schema',
    getRole: 'tob.permission.GetRole',
    getRoleNames: 'tob.permission.getRoleNames',
    DeleteRole: 'tob.permission.DeleteRole',
    SetRoleFunctionPermissions: 'tob.permission.SetRoleFunctionPermissions',
    SetRoleScopedObjects: 'tob.permission.SetRoleScopedObjects',
    SetSystemFunctionPermissions: 'tob.permission.SetSystemFunctionPermissions',
    SetSystemScopedObjects: 'tob.permission.SetSystemScopedObjects',
    AssignRole: 'tob.permission.AssignRole', // 给当前系统的用户添加删除role
    UnAssignRole: 'tob.permission.UnassignRole',

    GetSystem: 'platform.permission.GetSystem',
    getSystemRoles: 'platform.permission.GetRoleNames', // 根据system 获取role names
    platformGetRole: 'platform.permission.GetRole',
    platformSetSystemScopedObjects: 'platform.permission.SetSystemScopedObjects',
    platformSetSystemFunctionPermissions: 'platform.permission.SetSystemFunctionPermissions',
    platformDeleteRole: 'platform.permission.DeleteRole',
    platformSetRoleScopedObjects: 'platform.permission.SetRoleScopedObjects',
    platformSetRoleFunctionPermissions: 'platform.permission.SetRoleFunctionPermissions',
    platformAssignRole: 'platform.permission.AssignRole',
    platformUnassignRole: 'platform.permission.UnassignRole',
  },
  awardRank: {
    getMatchGroupByIDs: 'awardranking.match_group.Get',
    createAwardProject: 'awardranking.award_project.Alter',
    getOrgProjectByOrgIDs: 'awardranking.award_project.Get',
    newAwardsMatchGroup: 'awardranking.match_group.Alter',
    testAwardsMatchGroup: 'awardranking.match_group.TestMatch',
    copyMatchGroupByID: 'awardranking.match_group.Copy',
    getProjects: 'awardranking.award_project.Get',
  },
  awardProject: {
    getOrgProjectByProjectIDs: 'awardranking.award_project.Get',
    // getProjectTobProfile: 'awardranking.award_project.ListToBProfile',
  },
  geo: {
    // 加上search.Search来获取单人迁徙和群体迁徙的信息
    getTopCitedPubsByYear: 'publication.GetTopCitedPubsByYear',
    getTopCitedPubsByAIdsV2: 'publication.GetTopCitedPubsByAIdsV2',
    yearPaperNum: 'publication.AggregatePersonPubsByYearSlow',
    getCities: 'map.geo.GetGeoCitys',
    topCitiedPaper: 'publication.GetTopCitedPubsByAIds',

    // 修改自己的迁徙路线
    changeTrajectories: 'map.trajectory_user_movement.ExpertsTrajectoryUserMovement',
    getTrajectories: 'map.trajectory_user_movement.ListExpertsTrajectoryUserMovements',

    // 人才趋势变化原因，两张表
    addComments: 'map.wave_reason.ExpertWaveReasons',
    getComments: 'map.wave_reason.GetReasons',

    // 人才趋势变化原因，只能操作Comments表，暂时还没有弄好
    trendComments: 'comments.Alter',
    getTrendComments: 'comments.GetComments',

    expertsTrajectoryForecasts: 'map.trajectory_forecast.ExpertsTrajectoryForecasts',
    addForecastData: 'scholarchange.CreateForecastData',
    getForecastData: 'scholarchange.GetForecastData',
    deleteForecastData: 'scholarchange.DelForecastData',
  },
  trend: {
    getRecentTrend: 'trend.GetRecentTrend',
    getGivenCoTerms: 'terms.GetGivenCoTerms',
  },
  trend2: {
    Alter: 'trend2.Alter', // 添加insert, 更新upsert
    ListTrendProjects: 'trend2.ListTrendProjects', // 获取projects列表
    GenProjectTrendDetail: 'trend2.GenProjectTrendDetail',
    GenKeywordsOrVenues: 'trend2.GenKeywordsOrVenues',
    listMyProjects: 'trend2.listMyProjects', // 获取我的项目
  },
  tracking: {
    Track: 'tracking.Track',
    GetTrack: 'tracking.GetTrack',
  },
  person_annotation: {
    UpsertPersonInfo: 'person_annotation.UpsertPersonInfo',
    GetModifiersOfPerson: 'person_annotation.GetModifiersOfPerson',
    UpsertPersonAnnotation: 'person_annotation.UpsertPersonAnnotation',
  },
  publication: {
    StarOnePub: 'publication.StarOnePub',
    UnStarOnePub: 'publication.UnStarOnePub',
    bestpaper: 'publication.GetBestPaperConfAndYearFromDB',
    SavePubFromJson: 'publication.SavePubFromJson',
    GetProfile: 'publication.GetProfile',
  },
  entity: {
    GetFreqInfo: 'entity.GetFreqInfo',
  },
  hype_cycle: {
    GetTerms: 'hype_cycle.GetTerms',
    StdHypeCycle: 'hype_cycle.StdHypeCycle',
    TermData: 'hype_cycle.TermData',
    GetPosition: 'hype_cycle.GetPosition',
  },
  stat: {
    GetIndexStat: 'index.stat.GetIndexStat',
  },
  influentialscholar: {
    ListAwardsByAid: 'influentialscholar.ListAwardsByAid',
  },
  bestpaper: {
    FromType: 'bestpaper.GetBestPapersFromConferenceType',
    FromIDs: 'bestpaper.GetBestPapersFromConferenceIDs',
    SaveBestPaperSubmit: 'bestpaper.SaveBestPaperSubmit',
    GetBestPaperSubmitByUid: 'bestpaper.GetBestPaperSubmitByUid',
    UpdateBestPaperSubmitByUid: 'bestpaper.UpdateBestPaperSubmitByUid',
    DeleteBestPaperSubmit: 'bestpaper.DeleteBestPaperSubmit',
  },
  aminertool: {
    MatchAminerPub: 'aminertool.MatchAminerPub',
  },
  masterreadingtree: {
    GetMrtByConditions: 'masterreadingtree.GetMrtByConditions',
    GetMrtCompleted: 'masterreadingtree.GetMrtCompleted',
    GetMrtBySponsors: 'masterreadingtree.GetMrtBySponsors',
    GetMrtByPublicationIDs: 'masterreadingtree.GetMrtByPublicationIDs',
    CreateMrt: 'masterreadingtree.CreateMrt',
    GetMrtByIDs: 'masterreadingtree.GetMrtByIDs',
    getMRTUserEdit: 'masterreadingtree.getMRTUserEdit',
    AddSponsor: 'masterreadingtree.AddSponsor',
    AddClickNum: 'masterreadingtree.AddClickNum',
    AddOrCancelLike: 'masterreadingtree.AddOrCancelLike',
    CreateOrUpdateMrtUserEdit: 'masterreadingtree.CreateOrUpdateMrtUserEdit',
  },
  mostinfluentialscholars: {
    GetTopNScholars: 'mostinfluentialscholars.GetTopNScholars',
    QueryPersonAward: 'mostinfluentialscholars.QueryPersonAward',
    GetDomainList: 'mostinfluentialscholars.GetDomainList',
    GetSelectedPapers: 'mostinfluentialscholars.GetSelectedPapers',
    SetDomainComment: 'mostinfluentialscholars.SetDomainCommentID',
    GetHomeInfo: 'mostinfluentialscholars.GetHomeInfo',
    GetOrgHomeInfo: 'mostinfluentialscholars.GetOrgHomeInfo',
    GetScholarsDynamicValue: 'mostinfluentialscholars.GetScholarsDynamicValue',
  },
  aiopen: {
    NewListDomains: 'aiopenindex.NewListDomains',
    ListMagicRankings: 'aiopenindex.ListMagicRankings',
    ListCompany: 'aiopenindex.ListCompany',
    ListComDetails: 'aiopenindex.ListComDetails',
    GetDomainTopScholars: 'aiopenindex.GetDomainTopScholars',
    GetListDomains: 'aiopenindex.ListDomains',
    CityRankMoodEvent: 'aiopenindex.CityRankMoodEvent',
    ListAuthorInfoOfCity: 'aiopenindex.ListAuthorInfoOfCity',
    ListCityRank: 'aiopenindex.ListCityRank',
    PersonFollow: 'person.FollowPersonByUidAid',
    PersonUnFollow: 'person.UnfollowPersonByUidAid',
    FollowedScholars: 'mostinfluentialscholars.GetScholarsDynamicValue',
  },
  conference: {
    InsertArticle: 'conference.InsertArticle',
    GetArticlesByConfID: 'conference.GetArticlesByConfID',
    DeleteArticle: 'conference.DeleteArticle',
    AuthorsVote: 'conference.AuthorsVote',
    GetAuthorCandidates: 'conference.GetAuthorCandidates',
    GetUsrVoted: 'conference.GetUsrVoted',
    assistant: { Get: 'conference.assistant.Get' },
  },
  confs: {
    // ListConfs: 'confs.ListConfs',
    AlterConfs: 'confs.AlterConfs',
    // GetSchedule: 'confs.ListSchedules',
    // GetTimeTable: 'confs.GetTimeTable',
    UserLikes: 'confs.UserLikes',
    // Like: 'confs.PubLike',
    GetUsrVoted: 'conference.GetUsrVoted',
    GetPubsLikes: 'confs.GetPubsLikes',
    // GetMostViewPubs: 'confs.GetMostViewPubs',
    // GetMostLikePubs: 'confs.GetMostLikePubs',
    AlterSchedules: 'confs.AlterSchedules',
    // GetKeywords: 'confs.GetKeywords',
    GetPubsByKeywords: 'confs.GetPubsByKeywords',
    // GetRecommendPubs: 'confs.GetRecommendPubs',
    GetUserLikeKeywords: 'confs.GetUserLikeKeywords',
    GetUserLikePubsByKeywords: 'confs.GetUserLikePubsByKeywords',
    ListConfPubs: 'confs.ListConfPubs',
    // GetFilterPubs: 'confs.GetFilterPubs',
    // GetAuthorsPubs: 'confs.GetAuthorsPubs',
    // SearchSchedule: 'confs.SearchSchedule',
    // SearchPubs: 'confs.SearchPubs',
    // SearchAuthors: 'confs.SearchAuthors',
    // GetPubsByIds: 'confs.GetPubsByIds',
    // Search: 'confs.Search',
    // GetPubsBySId: 'confs.GetPubsBySId',
  },
  conf: {
    List: 'conf.List',
    Create: 'conf.Create',
    Update: 'conf.Update',
    Delete: 'conf.Delete',
    GetTimeTable: 'conf.GetTimeTable',
    GetPubs: 'conf.GetPubs',
    GetKeywords: 'conf.GetKeywords',
    GetAuthors: 'conf.GetAuthors',
    GetMostViewPubs: 'conf.GetMostViewPubs',
    GetMostLikePubs: 'conf.GetMostLikePubs',
    GetPubsByIds: 'conf.GetPubsByIds',
    GetRecommend: 'conf.GetRecommend',
    CreateSchedule: 'conf.CreateSchedule',
    ListSchedule: 'conf.ListSchedule',
    DeleteSchedule: 'conf.DeleteSchedule',
    AddSchedulePubs: 'conf.AddSchedulePubs',
    GetPubsBySID: 'conf.GetPubsBySID',
    Like: 'conf.Like',
    AddConfPubs: 'conf.AddConfPubs',
    DelConfPubs: 'conf.DelConfPubs',
    Search: 'conf.Search',
    RunCache: 'conf.Run',
    GetUserLikePubs: 'conf.GetUserLikePubs',
    GetSchedule: 'conf.GetSchedule',
    // TODO: 没用到的
    UpdateSchedule: 'conf.UpdateSchedule',
    UpdatePicture: 'conf.UpdatePicture',
    UpdateBestPaper: 'conf.UpdateBestPaper',
  },
  personpassaway: {
    GetPassawayInfo: 'personpassaway.GetPassawayInfo',
    DisableBurnCandle: 'personpassaway.DisableBurnCandle',
    CancelDisableBurnCandle: 'personpassaway.CancelDisableBurnCandle',
    ForceBurnCandle: 'personpassaway.ForceBurnCandle',
    BurnLittleCandle: 'personpassaway.BurnLittleCandle',
    GetBaseNum: 'personpassaway.GetBaseNum',
    SetBaseNum: 'personpassaway.SetBaseNum',
  },
  wechat: {
    GetSignature: 'wechat.GetSignature',
  },
  PersonInterest: {
    Get: 'PersonInterest.Get',
    Update: 'PersonInterest.Update',
    Reset: 'PersonInterest.Reset',
    Calculation: 'PersonInterest.Calculation',
    GetPersonInterests: 'PersonInterest.GetPersonInterests',
    GetPersonInterestsByYear: 'PersonInterest.GetPersonInterestsByYear',
    UpdatePersonInterests: 'PersonInterest.UpdatePersonInterests',
    ResetInterests: 'PersonInterest.ResetInterests',
    GetDataInfo: 'PersonInterest.GetDataInfo',
    SetScore: 'PersonInterest.SetScore',
  },
  aiglobal: {
    GetDomainTopScholars: 'aiglobal.GetDomainTopScholars',
    GetAuthorPubs: 'aiglobal.GetAuthorPubs',
    CheckDomainsExist: 'aiglobal.CheckDomainsExist',
    ListDomains: 'aiglobal.CheckDomainsExist',
    GetMultDomainsTopScholars: 'aiglobal.GetMultDomainsTopScholars',
  },
  topic: {
    SearchTopic: 'topic.SearchTopic',
    UpdateTopicInfo: 'topic.UpdateTopicInfo',
    UpdateMustReadingPub: 'topic.UpdateMustReadingPub',
    DeleteMustReadingPub: 'topic.DeleteMustReadingPub',
    CreatePubTopic: 'topic.CreatePubTopic',
    GetSubscriberEmail: 'topic.GetSubscriberEmail',
    Like: 'topic.Like',
    Tread: 'topic.Tread',
    TmpLike: 'topic.TmpLike',
    TmpTread: 'topic.TmpTread',
    ListTopicKeywords: 'topic.ListTopicKeywords',
    OpKeywords: 'topic.OpKeywords',
    ProposalTopic: 'topic.ProposalTopic',
    GetOutLine: 'topic.GetOutLine',
  },
  mustreading: {
    DeleteTopic: 'mustreading.DeleteTopic',
  },
  org: {
    SearchOrg: 'orgapi.SearchOrg',
    UpdateOrg: 'orgapi.UpdateOrg',
    CreateOrg: 'orgapi.CreateOrg',
  },
  venue: {
    SearchVenue: 'venueapi.SearchVenue',
    UpdateVenue: 'venueapi.UpdateVenue',
    CreateVenue: 'venueapi.CreateVenue',
  },
  user: {
    SendSMSCode: 'user.SendSMSCode',
    CreateMobileUser: 'user.CreateMobileUser',
    UpdateMobileUserPass: 'user.UpdateMobileUserPass',
    GetUser: 'user.GetUser',
  },
  searchapi: {
    SearchPerson: 'searchapi.SearchPerson',
  },
  domains: {
    all: 'domains.all',
    GetDomains: 'domains.GetDomains',
    GetDomainPaperTrend: 'domains.GetGraphOfDomain',
    GetTopicOfDomain: 'domains.GetTopicOfDomain',
    GetTopAuthorsOfDomain: 'domains.GetTopAuthorsOfDomain',
    PersonDomainsDistrebution: 'domains.PersonDomainsDistrebution',
  },
  social: {
    Notifications: 'social.Notifications',
    ExpertisedTopics: 'social.ExpertisedTopics',
    FollowTopic: 'social.FollowTopic',
    ListTopic: 'social.ListTopic',
    Follow: 'social.Follow',
    GetFollows: 'social.GetFollows',
    Follows: 'social.Follows',
    GetRecommendTopic: 'social.GetRecommendTopic',
    GetRecommendNotifications: 'social.GetRecommendNotifications',
    GetFollowsByCategory: 'social.GetFollowsByCategory',
    GetFollowsStatByCategory: 'social.GetFollowsStatByCategory',
    ListCategory: 'social.ListCategory',
    RemoveCategory: 'social.removeCategory',
    UpdateCategory: 'social.updateCategory',
    CreateCategory: 'social.createCategory',
    GetCategoryByFollowIDs: 'social.GetCategoryByFollowIDs',
    UpdateComments: 'social.updateComments',
    IsFollow: 'social.isFollow',
  },
  confrankrobot: {
    GetConfList: 'newconferencerank.ListConferenceRank',
    GetAnswers: 'confrank.robot.AnswerQuestions',
    GetAnswersNew: 'confrank.robot.AnswerQuestionsIntl',
  },
  userapi: {
    get: 'userapi.get',
    update: 'userapi.update',
  },
  datacenter: {
    RebuildExpert: 'datacenter.RebuildExpert',
  },
  personapi: {
    GetEgoNetworkGraph: 'personapi.GetEgoNetworkGraph',
    GetDCoreIndicesByAid: 'personapi.GetDCoreIndicesByAid',
  },
};

// ------------------ Helper Functions -------- ------------------
//
// const applyPlugin = (nextapi, pluginConfig) => {
//   if (!nextapi || !pluginConfig) {
//     return false;
//   }
//   nextapi.addParam(pluginConfig.parameters);
//   nextapi.addSchema(pluginConfig.schema);
//   // TODO ... merge filters, sorts, havings, etc...
//   return nextapi;
// };

// ! deprecated
const filterByEBs = (nextapi, ebs) => {
  nextapi.addParam({ filters: { dims: { eb: ebs } } });
};

const filtersToQuery = (nextapi, searchFiltersFromAggregation) => {
  const filters = searchFiltersFromAggregation;
  if (!filters) {
    return null;
  }
  Object.keys(filters).map(key => {
    const filter = filters[key];
    if (key === 'eb') {
      if (filter && filter.id) {
        if (filter.id !== 'aminer') {
          // skip global experts;
          let ebids = null;
          if (filter.ebids && filter.ebids.length > 0) {
            ebids = filter.ebids.map(ebdata => ebdata.id);
          } else {
            ebids = [filter.id];
          }
          // const ebLabel = bridge.toNextCCFLabelFromEBID(filters.eb.id);
          nextapi.addParam({ filters: { dims: { eb: ebids } } });
        }
      }
    } else if (key === 'h_index') {
      // console.log('TODO filter by h_index 这里暂时是用解析的方式获取数据的。');
      const splits = filter.split('-');
      if (splits && splits.length === 2) {
        const from = parseInt(splits[0], 10);
        const to = parseInt(splits[1], 10);
        nextapi.addParam({
          filters: {
            ranges: {
              h_index: [
                Number.isNaN(from) ? '' : from.toString(),
                Number.isNaN(to) ? '' : to.toString(),
              ],
            },
          },
        });
      }
    } else if (key.startsWith('dims.')) {
      const newKey = key.replace(/^dims\./, '');
      nextapi.addParam({ filters: { dims: { [newKey]: [filters[key]] } } });
    } else if (key === 'or') {
      nextapi.addFilter('or', filter);
    } else if (key === 'fields') {
      nextapi.addFilter('terms', { [key]: filter });
    } else {
      // NOTE 这里是传统的 aggregation，查询值需要是小写的。和es匹配，但是nation咋办？
      const value = filters[key] && filters[key].toLowerCase();
      nextapi.addParam({ filters: { terms: { [key]: [value] } } });
    }
    return false;
  });
  return null;
};

const createFieldsArray = (data, ignoreEmpty = true) => {
  const result = [];
  Object.keys(data).map(field => {
    const value = data[field];
    // 字段如果基本来自于antd的form，那么没动过的值是undefined，清空了是空字符串。
    if (!ignoreEmpty || value || typeof value === 'boolean' || value === 0) {
      result.push({ field, value });
    }
    return null;
  });
  return result;
};

const H = { filtersToQuery, filterByEBs, createFieldsArray };

export { apiBuilder, Action, F, H };
