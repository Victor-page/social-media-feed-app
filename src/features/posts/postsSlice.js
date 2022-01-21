import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const initialState = { postList: [], status: 'idle', error: null };

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('fakeApi/posts');
  return response.data;
});

export const addNewPost = createAsyncThunk(
  'postst/addNewPost',
  async (initialPost) => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost);
    // The response includes the complete post object, including unique ID
    return response.data;
  }
);

const { reducer, actions } = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postUpdated(state, action) {
      const { id, title, content } = action.payload;
      const existingPost = state.postList.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
      }
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.postList.find((post) => post.id === postId);
      existingPost && existingPost.reactions[reaction]++;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.postList = state.postList.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });

    builder.addCase(addNewPost.fulfilled, (state, action) => {
      state.postList.push(action.payload);
    });
  },
});

export const { postAdded, postUpdated, reactionAdded } = actions;

export default reducer;

export const selectAllPosts = (state) => {
  return state.posts.postList;
};

export const selectPostById = (state, postId) =>
  state.posts.postList.find((post) => post.id === postId);
