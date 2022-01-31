import { useAddReactionMutation } from '../posts/postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀',
};

const ReactionButtons = ({ post }) => {
  const [addReaction] = useAddReactionMutation();

  const reactionButtons = Object.entries(reactionEmoji).map(
    ([reactionName, emoji]) => {
      const onAddReaction = () =>
        addReaction({ postId: post.id, reaction: reactionName });

      return (
        <button
          key={reactionName}
          type="button"
          className="muted-button reaction-button"
          onClick={onAddReaction}
        >
          {emoji} {post.reactions[reactionName]}
        </button>
      );
    }
  );

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
