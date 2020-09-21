import { IFollowCategory } from 'aminer/components/common_types';

const getCategoryAndUnclassified: (
  collections: IFollowCategory[],
  require?: boolean,
) => [IFollowCategory[], IFollowCategory] = (collections, require = false) => {
  let cats = collections || [];
  const not_cat = collections && collections[0];
  if (!require) {
    cats = collections?.slice(1);
  }
  return [cats, not_cat];
};

const filterUnclassified: (
  collections: IFollowCategory[],
  categories: IFollowCategory[],
  need_only?: boolean,
) => null | IFollowCategory[] = (collections, categories, need_only = false) => {
  if (!collections || !categories) {
    return null;
  }
  const not_cat_id = collections && collections[0]?.id;
  if (categories.length === 1 && categories[0]?.id === not_cat_id && need_only) {
    return categories;
  }
  return categories.filter(categorie => categorie.id !== not_cat_id);
};

export { getCategoryAndUnclassified, filterUnclassified };
