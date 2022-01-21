import { useDispatch } from 'react-redux';

import { reactionAdded } from './postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();

  const onReactionAdded = (id, name) =>
    dispatch(reactionAdded({ postId: id, reaction: name }));

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => (
    <button
      key={name}
      type="button"
      className="muted-button reaction-button"
      onClick={onReactionAdded.bind(null, post.id, name)}
    >
      {emoji} {post.reactions[name]}
    </button>
  ));

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
