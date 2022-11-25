import { Button } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { AppDispatch } from '../../store';
import { logoutUser, selectUser } from '../../store/slices/user';

export default function LogoutButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(selectUser);

  const onClickLogoutButton = async () => {
    if (window.sessionStorage.getItem("user") !== null) {
      await axios.get('/user/logout')
      .catch((error) => {
        alert(error.response.data.detail);
      });

      window.sessionStorage.removeItem("user");
      window.location.reload();
    };
  };

  return <Button onClick={onClickLogoutButton}>Logout</Button>;
}
