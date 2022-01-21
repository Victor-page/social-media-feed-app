import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { postAdded } from './postsSlice';

const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  const dispatch = useDispatch();

  const usersList = useSelector((state) => state.users);

  const onTitleChanged = ({ target }) => setTitle(target.value);
  const onContentChanged = ({ target }) => setContent(target.value);
  const onAuthorChanged = ({ target }) => setUserId(target.value);

  const resetForm = () => {
    setTitle('');
    setContent('');
  };

  const onSavePostSubmitted = (event) => {
    event.preventDefault();
    title && content && dispatch(postAdded(title, content, userId));
    resetForm();
  };

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId);

  const userListOptions = usersList.map(({ id, name }) => (
    <option key={id} value={id}>
      {name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={onSavePostSubmitted}>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {userListOptions}
        </select>
        <label htmlFor="postContent">Post:</label>
        <textarea
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="submit" disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
