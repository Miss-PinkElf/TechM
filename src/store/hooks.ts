// src/store/hooks.ts
//Ai生成
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import type { RootState } from './types'; // 导入我们刚刚定义的 RootState
import type { AppDispatch } from './index'; // 假设你的 store 文件在 './index.ts'

/**
 * @description 创建一个带有 RootState 类型的 useSelector hook。
 * 在整个应用中应该使用 useAppSelector 而不是原始的 useSelector。
 * 这样做的好处是无需每次都手动为 state 添加类型。
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
/**
 * @description 创建一个带有类型的 useDispatch hook。
 * 这有助于在使用 dispatch 时获得 Thunk action creators 的类型提示。
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

// `AppDispatch` 类型通常从你的 store 配置中导出，如下所示：
//
// store.ts 文件示例:
// import { configureStore } from '@reduxjs/toolkit';
// import articleReducer from './articleSlice';
//
// const store = configureStore({
//   reducer: {
//     article: articleReducer,
//   },
// });
//
// export type AppDispatch = typeof store.dispatch; // 这就是 AppDispatch 的来源
// export default store;