import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

const authorsAdapter = createEntityAdapter({
  selectId: (author) => author.slug,
});

const authorsSlice = createSlice({
  name: "authors",
  initialState: authorsAdapter.getInitialState(),
  reducers: {
    setAuthors: authorsAdapter.setAll,
  },
});

export const { setAuthors } = authorsSlice.actions;

export const {
  selectById: findAuthor,
  selectEntities: selectAuthors,
  selectAll: getAllAuthors,
  selectTotal,
  selectIds,
} = authorsAdapter.getSelectors((state) => state.authors);

export default authorsSlice.reducer;
