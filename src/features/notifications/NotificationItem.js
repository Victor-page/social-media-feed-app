import { useSelector } from 'react-redux';
import { formatDistanceToNow, parseISO } from 'date-fns';
import classNames from 'classnames';

import { selectAllUsers } from '../users/usersSlice';

const NotificationItem = ({
  notificationDate,
  notificationMessage,
  notificationUser,
  isNewNotification,
}) => {
  const users = useSelector(selectAllUsers);

  const date = parseISO(notificationDate);
  const timeAgo = formatDistanceToNow(date);
  const user = users.find((user) => user.id === notificationUser) || {
    name: 'Unknown User',
  };

  const notificationClassname = classNames('notification', {
    new: isNewNotification,
  });

  return (
    <div className={notificationClassname}>
      <div>
        <b>{user.name}</b> {notificationMessage}
      </div>
      <div title={date}>
        <i>{timeAgo} ago</i>
      </div>
    </div>
  );
};

export default NotificationItem;
