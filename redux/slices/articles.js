import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const articlesAdapter = createEntityAdapter();

const articlesSlice = createSlice({
  name: 'articles',
  initialState: articlesAdapter.getInitialState(),
  reducers: {
    setArticles: articlesAdapter.setAll,
  },
});

export const { setArticles } = articlesSlice.actions;

export const {
  selectAll: getAllArticles,
  selectById,
  selectIds,
  selectEntities,
  selectTotal,
} = articlesAdapter.getSelectors((state) => state.articles);

export default articlesSlice.reducer;
