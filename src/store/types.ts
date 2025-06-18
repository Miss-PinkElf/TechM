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


