import { useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectAllNotifications,
  allNotificationsRead,
} from './notificationsSlice';
import NotificationItem from './NotificationItem';

const NotificationsList = () => {
  const dispatch = useDispatch();

  const notifications = useSelector(selectAllNotifications);

  useLayoutEffect(() => {
    dispatch(allNotificationsRead());
  });

  return (
    <section>
      <h2>Notifications</h2>
      {notifications.map(({ date, message, id, user, isNew }) => (
        <NotificationItem
          notificationDate={date}
          notificationMessage={message}
          key={id}
          notificationUser={user}
          isNewNotification={isNew}
        />
      ))}
    </section>
  );
};

export default NotificationsList;
