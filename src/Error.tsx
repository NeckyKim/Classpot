import { useState } from 'react';
import { Oval } from 'react-loader-spinner';

import styles from './Error.module.css';

export default function Error({ message, subMessage }: { message: string; subMessage?: string }) {
  const [loading, setLoading] = useState(true);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

  return (
    <div className={styles.container}>
      {loading ? (
        <>
          <Oval
            height={200}
            width={200}
            color="rgb(0, 100, 250)"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="transparent"
            strokeWidth={3}
            strokeWidthSecondary={3}
          />

          <div className={styles.loadingText}>정보를 불러오는 중입니다.</div>

          <div className={styles.subText}>잠시만 기다려주세요.</div>
        </>
      ) : (
        <>
          <img className={styles.emptyImage} src={process.env.PUBLIC_URL + '/graphics/no_result.png'} />

          <div className={styles.mainText}>{message}</div>

          <div className={styles.subText}>{subMessage}</div>
        </>
      )}
    </div>
  );
}
