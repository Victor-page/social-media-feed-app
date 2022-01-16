import { configureStore } from '@reduxjs/toolkit';

import postListReducer from '../features/postList/postListSlice';
import userListReducer from '../features/userList/userListSlice';

export default configureStore({
  reducer: { postList: postListReducer, userList: userListReducer },
});
