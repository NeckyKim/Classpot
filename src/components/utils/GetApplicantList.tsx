import { useEffect, useState } from 'react';

import { dbService } from '../../FirebaseModules';
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';

export default function GetApplicantList(userCode: string | undefined, testCode: string | undefined) {
  const [applicantList, setApplicantList] = useState<any>([]);

  if (userCode && testCode) {
    useEffect(() => {
      onSnapshot(
        query(collection(dbService, 'users', userCode, 'tests', testCode, 'applicants'), orderBy('created')),
        (snapshot) => {
          setApplicantList(
            snapshot.docs.map((current) => ({
              applicantCode: current.id,
              ...current.data(),
            })),
          );
        },
      );
    }, []);
  }

  return applicantList;
}
