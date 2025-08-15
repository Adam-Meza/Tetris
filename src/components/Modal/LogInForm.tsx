import React from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
} from '../../constants';

//@ts-ignore
const LogInForm = ({ route, method }) => {
  const userName = React.useRef('');
  const password = React.useRef('');
  const [loading, setLoading] = React.useState(false);
  const nav = useNavigate();

  const handleSubimt = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(route, {
        userName,
        password,
      });

      if (method === 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(
          REFRESH_TOKEN,
          res.data.refresh
        );
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubimt} className='log-in-form'>
      <input
        className='form-input'
        type='text'
        value={userName.current}
        //@ts-ignore
        onChange={(e: KeyboardEvent<Element>) =>
          (userName.current = e.target.value)
        }
      />
      <input
        className='form-input'
        type='text'
        value={password.current}
        //@ts-ignore
        onChange={(e: KeyboardEvent<Element>) =>
          (password.current = e.target.value)
        }
      />

      <button onClick={handleSubimt}></button>
    </form>
  );
};

export default LogInForm;
