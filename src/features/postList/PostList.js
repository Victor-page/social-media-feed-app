import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';

const PostList = () => {
  const postList = useSelector((state) => state.postList);

  const orderedPostList = postList
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  const renderedPosts = orderedPostList.map((post) => {
    const { id, title, content, user, date } = post;
    return (
      <article className="post-excerpt" key={id}>
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
  });

  return (
    <section className="post-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  );
};

export default PostList;
