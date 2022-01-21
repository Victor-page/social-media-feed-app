import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { selectPostById } from './postsSlice';

const SinglePostPage = ({ match }) => {
  const { postId } = match.params;

  const post = useSelector((state) => selectPostById(state, postId));

  const { user, id, title, content, date } = post;

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{title}</h2>
        <div>
          <PostAuthor userId={user} />
          <TimeAgo timestamp={date} />
        </div>
        <p className="post-content">{content}</p>
        <ReactionButtons post={post} />
        <Link to={`/edit-post/${id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  );
};

export default SinglePostPage;
