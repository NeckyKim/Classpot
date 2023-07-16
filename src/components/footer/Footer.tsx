import styles from './Footer.module.css';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <img className={styles.footerImage} src={process.env.PUBLIC_URL + '/logos/logo_black.png'} />

      <div className={styles.footerText}>ⓒ 2023 Testcon. All rights reserved.</div>
    </div>
  );
}
