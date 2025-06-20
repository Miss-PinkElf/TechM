import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article, Author, MyComment } from '../types'
import { addCommentAPI, getArticleAPI, getCommentListAPI } from '../../utils/request';
interface ArticleState {
  article: Article | null;
  comments: MyComment[];
}
const initialState: ArticleState = {
  article: null,
  comments: []
}
export const getArticle = createAsyncThunk("article/getArticle",
  async (articleId: string, { rejectWithValue }) => {
    try {
      const res_article = (await getArticleAPI(articleId)).data;
      const res_comments = (await getCommentListAPI(articleId)).data;
      return {
        article: res_article,
        commentList: res_comments
      };
    }
    catch (e: any) {
      return rejectWithValue(e.response?.data?.message || '加载失败');
    }
  }
)
export const addComment = createAsyncThunk('comments/addComment',
  async (commentInfo: { author: Author, content: string, articleId: string }, { rejectWithValue }) => {
    try {
      const newComment: MyComment = {
        id: `${Date.now()}`, // 调用 Date.now() 获取当前时间戳
        articleId: commentInfo.articleId,
        content: commentInfo.content,
        author: commentInfo.author,
        detailInfo: {
          ifLike: false,
          likeNum: 0,
          commentNum: 0,
          // 修正: 调用 Date.now() 来获取当前时间的毫秒数
          publicDate: `${Date.now()}`
        },
        reply: []
      };

      // 假设 addCommentAPI 是一个异步函数，它可能会失败
      const response = await addCommentAPI(newComment);

      // 通常API成功后会返回创建的数据，我们最好使用API返回的数据
      // 这里我们为了简单，还是返回我们前端创建的对象
      return newComment;

    } catch (error: any) {
      // 如果 API 调用失败，错误会被捕获
      console.error("添加评论失败:", error);
      // 使用 rejectWithValue 将标准化的错误信息传递给 rejected reducer
      return rejectWithValue(error.response?.data || '添加评论时发生未知错误');
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
    toggleLikesComment: (state, action: PayloadAction<string>) => {

      const commentId = action.payload;

      const nowComment = findComment(state.comments!, commentId)

      if (nowComment) {
        nowComment.detailInfo.ifLike = !nowComment.detailInfo.ifLike;
        nowComment.detailInfo.likeNum += (nowComment.detailInfo.ifLike ? 1 : -1)
      }
    },
    addCommentLocal: (state, action: PayloadAction<{ author: Author, content: string }>) => {

      const newComment: MyComment = {
        id: `${Date.now()}`, // 调用 Date.now() 获取当前时间戳
        articleId: state.article!.id,
        content: action.payload.content,
        author: action.payload.author,
        detailInfo: {
          ifLike: false,
          likeNum: 0,
          commentNum: 0,
          // 修正: 调用 Date.now() 来获取当前时间的毫秒数
          publicDate: `${Date.now()}`
        },
        reply: []
      };
      state.comments.push(newComment);

    },
    toggleArticleMark: (state, action: PayloadAction<string>) => {
      //undefined.ifBookMark undefined不能赋值 （TypeError: Cannot set properties of undefined）。
      //state.article?.detailInfo.ifBookMark = !state.article?.detailInfo.ifBookMark;
      state.article!.detailInfo.ifBookMark = !state.article?.detailInfo.ifBookMark;
      if (state.article!.detailInfo) {
        state.article!.detailInfo.bookmarks! += (state.article!.detailInfo.ifBookMark ? 1 : -1);//可选可能为空
      }
    },
    toggleArticleLikes: (state, action: PayloadAction<string>) => {
      if (state.article && state.article.detailInfo) {
        const detailInfo = state.article.detailInfo;
        // 1. 先切换点赞状态
        detailInfo.ifLike = !detailInfo.ifLike;
        // 2. 根据新的点赞状态来更新点赞数
        detailInfo.likeNum += detailInfo.ifLike ? 1 : -1;
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
    bulider.addCase(addComment.fulfilled, (state, action) => {
      state.comments.push(action.payload)
    })
      .addCase(addComment.rejected, (state, action) => {
        console.error('发布');

      })

  },
})
export const { toggleLikesComment, toggleArticleMark, toggleArticleLikes, addCommentLocal } = articleStore.actions;
export default articleStore.reducer;
