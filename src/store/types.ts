export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}
export interface DetailInfo {
  ifLike: boolean;
  likeNum: number;
  commentNum: number;
  bookmarks?: number;//?表示 可选的
  ifBookMark?: boolean;
  publicDate: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  author: Author;
  imageUrl: string;
  detailInfo: DetailInfo
}

export interface MyComment {
  id: string;
  articleId: string;
  author: Author;
  content: string;
  detailInfo: DetailInfo;
  reply: MyComment[]
}

interface ArticleState {
  article: Article | null;
  comments: MyComment[] | null;
}

/**
 * @description 定义整个 Redux store 的根状态 (RootState)
 * 这里聚合了应用中所有的 state "切片"
 */
export interface RootState {
  article: ArticleState;
  // 如果你的 store 中还有其他部分，比如用户信息，可以像这样添加
  // user: UserState;
}


