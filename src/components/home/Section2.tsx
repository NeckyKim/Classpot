import styles from './Section2.module.css';

export default function Section2() {
  return (
    <div className={styles.page2}>
      <div className={styles.page2Text1}>
        종이 시험은 더 이상 그만,
        <span className={styles.enter} />
        이제는 <span className={styles.page2TextHighlight}>디지털</span> 시대입니다.
      </div>

      <div className={styles.page2Text2}>
        데스크톱, 태블릿, 노트북, 스마트폰으로 언제나 어디서든 시험을 진행할 수 있습니다.
      </div>

      <div className={styles.marquee}>
        <div className={styles.marqueeInner1}>
          <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + '/images/desktop1.png'} />
          <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + '/images/tablet1.png'} />
          <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + '/images/laptop1.png'} />
          <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + '/images/ios1.png'} />
          <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + '/images/android1.png'} />
          <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + '/images/desktop2.png'} />
          <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + '/images/tablet2.png'} />
          <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + '/images/laptop2.png'} />
          <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + '/images/ios2.png'} />
          <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + '/images/android2.png'} />
        </div>

        <div className={styles.marqueeInner2}>
          <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + '/images/desktop1.png'} />
          <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + '/images/tablet1.png'} />
          <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + '/images/laptop1.png'} />
          <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + '/images/ios1.png'} />
          <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + '/images/android1.png'} />
          <img className={styles.marqueeImage1} src={process.env.PUBLIC_URL + '/images/desktop2.png'} />
          <img className={styles.marqueeImage2} src={process.env.PUBLIC_URL + '/images/tablet2.png'} />
          <img className={styles.marqueeImage3} src={process.env.PUBLIC_URL + '/images/laptop2.png'} />
          <img className={styles.marqueeImage4} src={process.env.PUBLIC_URL + '/images/ios2.png'} />
          <img className={styles.marqueeImage5} src={process.env.PUBLIC_URL + '/images/android2.png'} />
        </div>
      </div>
    </div>
  );
}
