import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { fetchPosts, selectPostIds, selectPostById } from './postsSlice';
import { Spinner } from '../../components/Spinner';

const PostExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));
  const { title, user, date, id, content } = post;

  return (
    <article>
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
  const dispatch = useDispatch();
  const orderedPostIds = useSelector(selectPostIds);

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
    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
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
