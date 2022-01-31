import { HTTPMethod } from 'http-method-enum';

import { apiSlice } from '../api/apiSlice';
import { posts, reactions } from '../../utils/endpoints';

export const extendedApiSlice = apiSlice.injectEndpoints({
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
          if (post) {
            const { reactions } = post;
            const currentAmount = reactions[reaction];
            reactions[reaction] = currentAmount + 1;
          }
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
  useAddNewPostMutation,
  useEditPostMutation,
  useAddReactionMutation,
  useGetPostQuery,
  useGetPostsQuery,
} = extendedApiSlice;
