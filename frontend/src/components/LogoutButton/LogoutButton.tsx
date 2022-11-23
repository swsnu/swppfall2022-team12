import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch } from '../../store';
import { logoutUser, selectUser } from '../../store/slices/user';

export default function LogoutButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);

  const onClickLogoutButton = async () => {
    if (userState.loggedInUser !== null) {
      await dispatch(logoutUser(userState.loggedInUser.username));
    }
    navigate('/login');
  };

  return <Button onClick={onClickLogoutButton}>Logout</Button>;
}
