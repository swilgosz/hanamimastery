import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articles';
import authorsReducer from './slices/authors';

export default configureStore({
  reducer: {
    articles: articlesReducer,
    authors: authorsReducer,
  },
});
