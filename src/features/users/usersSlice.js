import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';

import { apiSlice } from '../api/apiSlice';
import { users } from '../../utils/endpoints';

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/' + users,
      transformResponse: (responseData) =>
        usersAdapter.setAll(initialState, responseData),
    }),
  }),
});

export const { useGetUsersQuery } = extendedApiSlice;

export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select();

export const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
);

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState);
