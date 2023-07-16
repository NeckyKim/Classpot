import Section1 from './Section1';
import Section2 from './Section2';
import Footer from '../footer/Footer';

import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Section1 />
      <Section2 />
      <Footer />
    </div>
  );
}
