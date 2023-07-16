import { useEffect, useState } from 'react';

import { dbService } from '../../FirebaseModules';
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore';

export default function GetNotificationList(testCode: string | undefined) {
  const [notificationList, setNotificationList] = useState<any>([]);

  if (testCode) {
    useEffect(() => {
      onSnapshot(
        query(collection(dbService, 'tests', testCode, 'notifications'), orderBy('createdTime')),
        (snapshot) => {
          setNotificationList(
            snapshot.docs.map((current) => ({
              ...current.data(),
            })),
          );
        },
      );
    }, []);
  }

  return notificationList;
}
