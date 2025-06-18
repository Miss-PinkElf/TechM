import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./modules/articleStore"
const store = configureStore({
  reducer: {
    article: articleReducer
  }
})
//Ai生成下面的
/**
 * @description 从 store 本身推断出 `RootState` 类型。
 * 它会自动根据你的 reducer 结构生成 `{ article: ArticleState }` 这样的类型。
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * @description 推断出 `AppDispatch` 类型，这样在 dispatch thunk actions 时能获得类型支持。
 */
export type AppDispatch = typeof store.dispatch;
export default store;