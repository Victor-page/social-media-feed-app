import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { client } from '../../api/client';

const initialState = [];

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState());
    const [latestNotification] = allNotifications;
    const latestTimeStamp = latestNotification ? latestNotification.date : '';
    const response = await client.get(
      `fakeApi/notifications?since=${latestTimeStamp}`
    );
    return response.data;
  }
);

const { reducer, actions } = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    allNotificationsRead(state, action) {
      state.forEach((notification) => (notification.read = true));
    },
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      state.push(...action.payload);
      state.forEach(
        // Any notifications we've read are no longer new
        (notification) => (notification.isNew = !notification.read)
      );

      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date));
    },
  },
  // extraReducers(builder) {
  //   builder.addCase(fetchNotifications.fulfilled, (state, action) => {
  //     state.push(...action.payload);
  //     state.forEach(
  //       // Any notifications we've read are no longer new
  //       (notification) => (notification.isNew = !notification.read)
  //     );

  //     // Sort with newest first
  //     state.sort((a, b) => b.date.localeCompare(a.date));
  //   });
  // },
});

export const { allNotificationsRead } = actions;

export default reducer;

export const selectAllNotifications = (state) => state.notifications;
