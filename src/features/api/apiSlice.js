import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/fakeApi' }),
  tagTypes: ['Post'],
  endpoints: () => ({}),
});

// export const {
//   useGetPostQuery,
//   // We export the useGetUsersQuery hook just for consistency, but for now we're not going to use it.
//   // useGetUsersQuery,
//   useAddNewPostMutation,
//   useEditPostMutation,
//   useAddReactionMutation,
// } = apiSlice;
