import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HTTPMethod } from 'http-method-enum';

import { posts, reactions } from '../../utils/endpoints';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => '/' + posts,
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map((post) => ({ type: 'Post', id: post.id })),
      ],
    }),
    getPost: builder.query({
      query: (postId) => `/${posts}/${postId}`,
      providesTags: (result, error, arg) => [{ type: 'Post', id: arg }],
    }),
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/' + posts,
        method: HTTPMethod.POST,
        body: initialPost,
      }),
      invalidatesTags: ['Post'],
    }),
    editPost: builder.mutation({
      query: (post) => ({
        url: `/${posts}/${post.id}`,
        method: HTTPMethod.PATCH,
        body: post,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    addReaction: builder.mutation({
      query: ({ postId, reaction }) => ({
        url: `/${posts}/${postId}/${reactions}`,
        method: HTTPMethod.POST,
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reaction },
      }),
      async onQueryStarted({ postId, reaction }, { dispatch, queryFulfilled }) {
        const updateCachedData = (draft) => {
          const post = draft.find((post) => post.id === postId);
          post && post.reactions[reaction]++;
        };

        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, updateCachedData)
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  // We export the useGetUsersQuery hook just for consistency, but for now we're not going to use it.
  // useGetUsersQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
} = apiSlice;
