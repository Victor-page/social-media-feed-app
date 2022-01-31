import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  allNotificationsRead,
  useGetNotificationsQuery,
} from './notificationsSlice';
import NotificationItem from './NotificationItem';
import { selectMetadataEntities } from './notificationsSlice';

const NotificationsList = () => {
  const dispatch = useDispatch();

  const { data: notifications = [] } = useGetNotificationsQuery();
  const notificationsMetadata = useSelector(selectMetadataEntities);

  useLayoutEffect(() => {
    dispatch(allNotificationsRead());
  });

  return (
    <section>
      <h2>Notifications</h2>
      {notifications.map(({ date, message, id, user }) => (
        <NotificationItem
          notificationDate={date}
          notificationMessage={message}
          key={id}
          notificationUser={user}
          isNew={notificationsMetadata[id].isNew}
        />
      ))}
    </section>
  );
};

export default NotificationsList;
