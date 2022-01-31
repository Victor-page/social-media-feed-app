import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from '@reduxjs/toolkit';

import { selectUserById } from './usersSlice';
import { useGetPostsQuery } from '../api/apiSlice';

const UserPage = ({ match }) => {
  const { userId } = match.params;

  const user = useSelector((state) => selectUserById(state, userId));

  const selectPostsForUser = useMemo(
    () =>
      createSelector(
        (res) => res.data,
        (res, userId) => userId,
        (data, userId) => data.filter((post) => post.user === userId)
      ),
    []
  );

  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      ...result,
      postsForUser: selectPostsForUser(result, userId),
    }),
  });

  const postTitles = postsForUser.map(({ id, title }) => {
    return (
      <li key={id}>
        <Link to={`/posts/${id}`}>{title}</Link>
      </li>
    );
  });

  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{postTitles}</ul>
    </section>
  );
};

export default UserPage;
