import { Link } from 'react-router-dom';

import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { Spinner } from '../../components/Spinner';
import { useGetPostQuery } from '../api/apiSlice';

const SinglePostPage = ({ match }) => {
  const { postId } = match.params;

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId);

  let postContent;
  if (isFetching) {
    postContent = <Spinner text="Loading" />;
  } else if (isSuccess) {
    const { user, id, title, content, date } = post;

    postContent = (
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
    );
  }

  return <section>{postContent}</section>;
};

export default SinglePostPage;
