import { useEffect, useState } from 'react';

import { dbService } from '../../FirebaseModules';
import { doc, onSnapshot } from 'firebase/firestore';

export default function GetTestInfo(userCode: string | undefined, testCode: string | undefined) {
  const [testInfo, setTestInfo] = useState<any>([]);

  if (userCode && testCode) {
    useEffect(() => {
      onSnapshot(doc(dbService, 'users', userCode, 'tests', testCode), (doc) => {
        setTestInfo({
          testCode: testCode,
          ...doc.data(),
        });
      });
    }, []);
  }

  return testInfo;
}
