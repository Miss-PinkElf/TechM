import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article, Author, MyComment } from '../types'
import { getArticleAPI } from '../../utils/request';
interface ArticleState {
  article: Article | null;
  comments: MyComment[] | null;
}
const initialState: ArticleState = {
  article: null,
  comments: []
}
export const getArticle = createAsyncThunk("article/getArticle",
  async (articleId: string, { rejectWithValue }) => {
    try {
      const { article, commentList } = (await getArticleAPI(articleId)).data;
      return {
        article: article,
        commentList: commentList
      };
    }
    catch (e: any) {
      return rejectWithValue(e.response?.data?.message || '加载失败');
    }
  }
)
const findComment = (commentList: MyComment[], commentId: string): MyComment | null => {
  for (const comment of commentList) {
    if (comment.id === commentId)
      return comment;
    const replayComment = findComment(comment.reply, commentId)
    if (replayComment)
      return replayComment;
  }
  return null;
}

const articleStore = createSlice({
  name: "article",
  // initialState: {
  //   //article: Article : null
  // },
  initialState,
  reducers: {
    toggleLikes: (state, action: PayloadAction<string>) => {
      const commentId = action.payload;
      const nowComment = findComment(state.comments!, action.payload)
      if (nowComment) {
        nowComment.detailInfo.ifLike = !nowComment.detailInfo.ifLike;
        nowComment.detailInfo.likeNum += (nowComment.detailInfo.ifLike ? 1 : -1)
      }
    },
    addComment: (state, action: PayloadAction<{ author: Author, content: string }>) => {
      const newComment: MyComment = {
        id: `${Date.now()}`,
        articleId: state.article!.id,
        content: action.payload.content,
        author: action.payload.author,
        detailInfo: {
          ifLike: false,
          likeNum: 0,
          commentNum: 0,
          publicDate: `${Date.now}`
        },
        reply: []
      }
      state.comments?.push(newComment);
    },
    addArticleMark: (state, action: PayloadAction<string>) => {
      //undefined.ifBookMark undefined不能赋值 （TypeError: Cannot set properties of undefined）。
      //state.article?.detailInfo.ifBookMark = !state.article?.detailInfo.ifBookMark;
      state.article!.detailInfo.ifBookMark = !state.article?.detailInfo.ifBookMark;
      if (state.article!.detailInfo) {
        state.article!.detailInfo.bookmarks! += (state.article!.detailInfo.ifBookMark ? 1 : -1);//可选可能为空
      }
    }

  },
  extraReducers: (bulider) => {
    bulider.addCase(getArticle.fulfilled, (state, action) => {
      state.article = action.payload.article;
      state.comments = action.payload.commentList;
    })
      .addCase(getArticle.rejected, (state, action) => {
        console.log(action.error);
      })
  },
})
export const { toggleLikes, addComment, addArticleMark } = articleStore.actions;
export default articleStore.reducer;
