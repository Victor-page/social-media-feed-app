import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAllUsers } from './usersSlice';

const UsersList = () => {
  const users = useSelector(selectAllUsers);

  const renderedUsers = users.map(({ id, name }) => (
    <li key={id}>
      <Link to={`/users/${id}`}>{name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};

export default UsersList;
