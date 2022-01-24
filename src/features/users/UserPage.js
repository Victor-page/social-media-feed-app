import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectUserById } from './usersSlice';
import { selectPostsByUser } from '../posts/postsSlice';

const UserPage = ({ match }) => {
  const { userId } = match.params;

  const user = useSelector((state) => selectUserById(state, userId));

  const postsForUser = useSelector((state) => selectPostsByUser(state, userId));

  const postTitles = postsForUser.map(({ id, title }) => (
    <li key={id}>
      <Link to={`/posts/${id}`}>{title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  );
};

export default UserPage;
