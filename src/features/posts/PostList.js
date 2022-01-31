import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { Spinner } from '../../components/Spinner';
import { useGetPostsQuery } from '../posts/postsSlice';
import classNames from 'classnames';

const PostExcerpt = ({ post }) => {
  const { title, user, date, id, content } = post;

  return (
    <article className="post-excerpt">
      <h3>{title}</h3>
      <div>
        <PostAuthor userId={user} />
        <TimeAgo timestamp={date} />
      </div>
      <p className="post-content">{content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  );
};

const PostsList = () => {
  const {
    data: posts = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    // refetch,
  } = useGetPostsQuery();

  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice();
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date));

    return sortedPosts;
  }, [posts]);

  let content;

  if (isLoading) {
    content = <Spinner text="Loading..." />;
  } else if (isSuccess) {
    const containerClassname = classNames('posts-container', {
      disabled: isFetching,
    });

    content = (
      <div className={containerClassname}>
        {sortedPosts.map((post) => (
          <PostExcerpt key={post.id} post={post} />
        ))}
      </div>
    );
  } else if (isError) {
    content = <p>{error.toString()}</p>;
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {/* <button onClick={refetch}>Refetch Posts</button> */}
      {content}
    </section>
  );
};

export default PostsList;
