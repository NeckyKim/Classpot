import { useRef } from 'react';

import Modal from '../../../style/Modal';

import styles from './ChattingContainer.module.css';

export default function ChattingContainer({
  applicantName,
  chatting,
  setShowChatting,
  chattingText,
  setChattingText,
  sendChatting,
}: {
  applicantName: string;
  chatting: any;
  setShowChatting: any;
  chattingText: string;
  setChattingText: any;
  sendChatting: any;
}) {
  const chattingRef = useRef<any>();

  function scrollToBottom() {
    if (chattingRef.current) {
      chattingRef.current.scrollTop = chattingRef.current.scrollHeight;
    }
  }

  return (
    <Modal title="채팅" onClose={() => setShowChatting(false)}>
      <div className={styles.chattingListContainer} ref={chattingRef}>
        {chatting?.length > 0 ? (
          chatting.map((elem: any, index: number) => (
            <div>
              {(index === 0 ||
                (index > 0 && chatting[index - 1]?.sender !== elem.sender) ||
                (index > 0 &&
                  new Date(chatting[index - 1]?.time).toLocaleDateString() !==
                    new Date(elem.time).toLocaleDateString())) && (
                <div className={elem.sender === 'manager' ? styles.senderManager : styles.senderApplicant}>
                  <div className={styles.senderName}>{elem.sender === 'manager' ? '관리자' : applicantName}</div>

                  <div className={styles.senderTime}>
                    {new Date(elem.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                  </div>
                </div>
              )}

              <div className={elem.sender === 'manager' ? styles.textManager : styles.textApplicant}>{elem.text}</div>
            </div>
          ))
        ) : (
          <div className={styles.chattingEmpty}>채팅 기록이 없습니다.</div>
        )}
      </div>

      <div className={styles.chattingInputBoxZone}>
        <input
          type="text"
          value={chattingText}
          onChange={(event: any) => setChattingText(event.target.value)}
          className={styles.chattingInputBox}
          spellCheck={false}
          placeholder="이곳에 내용을 입력하세요."
        />

        <button
          type="submit"
          value="전송"
          className={styles.sendButton}
          onClick={() => {
            if (chattingText) {
              sendChatting(event);
              scrollToBottom();
            }
          }}
          disabled={!chattingText}
        >
          <img src={process.env.PUBLIC_URL + '/icons/dashboard/send.svg'} />
        </button>
      </div>
    </Modal>
  );
}
