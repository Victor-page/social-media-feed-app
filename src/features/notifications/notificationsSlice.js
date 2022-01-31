import {
  createSlice,
  createEntityAdapter,
  createSelector,
  isAnyOf,
  createAction,
} from '@reduxjs/toolkit';

import { forceGenerateNotifications } from '../../api/server';
import { apiSlice } from '../api/apiSlice';
import { notifications } from '../../utils/endpoints';

const notificationsReceived = createAction(
  'notifications/notificationsReceived'
);

const extendedApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/' + notifications,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }
      ) {
        const ws = new WebSocket('ws://localhost');
        try {
          await cacheDataLoaded;

          const listener = (event) => {
            const message = JSON.parse(event.data);
            switch (message.type) {
              case notifications: {
                updateCachedData((draft) => {
                  draft.push(...message.payload);
                  draft.sort((a, b) => b.date.localeCompare(a.date));
                });
                // Dispatch an additional action so we can track "read" state
                dispatch(notificationsReceived(message.payload));
                break;
              }

              default: {
                break;
              }
            }
          };

          ws.addEventListener('message', listener);
        } catch (error) {
          console.log(error);
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }

        await cacheEntryRemoved;
        ws.close();
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = extendedApi;

const emptyNotifications = [];

export const selectNotificationsResult =
  extendedApi.endpoints.getNotifications.select();

const selectNotificationsData = createSelector(
  selectNotificationsResult,
  (notificationsResult) => notificationsResult.data ?? emptyNotifications
);

export const fetchNotificationsWebsocket = () => (dispatch, getState) => {
  const allNotifications = selectNotificationsData(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification?.date ?? '';
  // Hardcode a call to the mock server to simulate a server push scenario over websockets
  forceGenerateNotifications(latestTimestamp);
};

const notificationsAdapter = createEntityAdapter();

const matchNotificationsReceived = isAnyOf(
  notificationsReceived,
  extendedApi.endpoints.getNotifications.matchFulfilled
);

const initialState = notificationsAdapter.getInitialState();

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
  extraReducers(builder) {
    builder.addMatcher(matchNotificationsReceived, (state, action) => {
      const notificationsMetadata = action.payload.map((notification) => ({
        id: notification.id,
        read: false,
        isNew: true,
      }));

      Object.values(state.entities).forEach(
        (notification) => (notification.isNew = !notification.read)
      );

      notificationsAdapter.upsertMany(state, notificationsMetadata);
    });
  },
});

export const { allNotificationsRead } = actions;

export default reducer;

export const {
  selectAll: selectNotificationsMetadata,
  selectEntities: selectMetadataEntities,
} = notificationsAdapter.getSelectors((state) => state.notifications);
