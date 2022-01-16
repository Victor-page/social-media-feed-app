import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { postUpdated } from './postListSlice';

const EditPostForm = ({ match }) => {
  const { postId } = match.params;

  const post = useSelector((state) =>
    state.postList.find((post) => post.id === postId)
  );

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const dispatch = useDispatch();
  const history = useHistory();

  const onTitleChanged = (event) => setTitle(event.target.value);
  const onContentChanged = (event) => setContent(event.target.value);

  const onSavePostSubmitted = (event) => {
    event.preventDefault();
    if (!title || !content) {
      return;
    }

    dispatch(postUpdated({ id: postId, content, title }));
    history.push(`/posts/${postId}`);
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form onSubmit={onSavePostSubmitted}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="submit">Save Post</button>
      </form>
    </section>
  );
};

export default EditPostForm;
