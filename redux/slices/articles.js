import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const articlesAdapter = createEntityAdapter({
  sortComparer: (articleA, articleB) => {
    const [createdAtA, createdAtB] = [
      new Date(articleA.attributes.publishedAt),
      new Date(articleB.attributes.publishedAt),
    ];
    if (createdAtA > createdAtB) return -1;
    if (createdAtA < createdAtB) return 1;
    return 0;
  },
});

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
