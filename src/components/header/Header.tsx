import { useNavigate, Link } from 'react-router-dom';

import { authService } from '../../FirebaseModules';

import SubmitButton from '../../style/SubmitButton';

import styles from './Header.module.css';

type HeaderProps = {
  loggedIn: boolean;
};

export default function Header({ loggedIn }: HeaderProps) {
  var navigate = useNavigate();

  return (
    <div>
      <div className={styles.headerContainer}>
        <img
          className={styles.headerLogo}
          src={process.env.PUBLIC_URL + '/logos/logo_original.png'}
          onClick={() => {
            navigate('/');
          }}
        />

        {window.location.pathname.split('/')[1] !== 'apply' &&
          (loggedIn ? (
            <SubmitButton
              text="로그아웃"
              onClick={() => {
                authService.signOut();
                navigate('/');
              }}
            />
          ) : (
            <Link to="/login">
              <SubmitButton text="로그인" onClick={() => {}} />
            </Link>
          ))}
      </div>

      <div className={styles.blank} />
    </div>
  );
}
