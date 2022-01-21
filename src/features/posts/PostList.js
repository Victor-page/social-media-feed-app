import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { selectAllPosts, fetchPosts } from './postsSlice';
import { Spinner } from '../../components/Spinner';

const PostExcerpt = ({ post }) => (
  <article>
    <h3>{post.title}</h3>
    <div>
      <PostAuthor userId={post.user} />
      <TimeAgo timestamp={post.date} />
    </div>
    <p className="post-content">{post.content.substring(0, 100)}</p>

    <ReactionButtons post={post} />
    <Link to={`/posts/${post.id}`} className="button muted-button">
      View Post
    </Link>
  </article>
);

const PostsList = () => {
  const dispatch = useDispatch();
  const postList = useSelector(selectAllPosts);

  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [dispatch, postStatus]);

  let content;

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />;
  } else if (postStatus === 'succeeded') {
    const orderedPosts = postList
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));

    content = orderedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ));
  } else if (postStatus === 'failed') {
    content = <p>{error}</p>;
  }

  return (
    <section className="post-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
};

export default PostsList;
