import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = notificationsAdapter.getInitialState();

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
      Object.values(state.entities).forEach(
        (notification) => (notification.read = true)
      );
    },
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      notificationsAdapter.upsertMany(state, action.payload);
      Object.values(state.entities).forEach(
        // Any notifications we've read are no longer new
        (notification) => (notification.isNew = !notification.read)
      );
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

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state) => state.notifications);
