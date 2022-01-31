import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useGetPostQuery, useEditPostMutation } from '../posts/postsSlice';

const EditPostForm = ({ match }) => {
  const { postId } = match.params;

  const { data: post } = useGetPostQuery(postId);
  const [updatePost] = useEditPostMutation();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const history = useHistory();

  const onTitleChanged = (event) => setTitle(event.target.value);
  const onContentChanged = (event) => setContent(event.target.value);

  const onSavePostSubmitted = async (event) => {
    event.preventDefault();
    if (!title || !content) {
      return;
    }

    await updatePost({ id: postId, title, content });
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
