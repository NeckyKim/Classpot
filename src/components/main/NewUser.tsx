import { useState } from 'react';

import { dbService } from '../../FirebaseModules';
import { doc, setDoc } from 'firebase/firestore';

import GenerateShortUserCode from '../utils/GenerateShortUserCode';

import Label from '../../style/Label';
import InputBox from '../../style/InputBox';
import Buttons from '../../style/Buttons';
import SubmitButton from '../../style/SubmitButton';

import { toast } from 'react-toastify';

import styles from './NewUser.module.css';

export default function NewUser({ userCode, email }: { userCode: string; email: string }) {
  const [userName, setUserName] = useState<string>('');

  const shortUserCode = GenerateShortUserCode();

  async function addUser(event: any) {
    event.preventDefault();

    try {
      await setDoc(doc(dbService, 'users', userCode), {
        userCode: userCode,
        userName: userName.trim(),
        shortUserCode: shortUserCode,
        email: email,
      });

      toast.success('사용자 등록이 완료되었습니다.', { toastId: '' });
    } catch (error) {
      console.log(error);
      toast.error('사용자 등록에 실패했습니다.', { toastId: '' });
    }
  }

  return (
    <div className={styles.background}>
      <div className={styles.container}>
        <Label>관리자 이름</Label>

        <InputBox type="text" value={userName} onChange={(event: any) => setUserName(event.target.value)} />
        <br />
        <br />

        <Buttons>
          <SubmitButton text="등록하기" onClick={addUser} disabled={userName.replace(/(\s*)/g, '') === ''} />
        </Buttons>
      </div>
    </div>
  );
}
