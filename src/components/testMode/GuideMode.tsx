import { useState } from "react";

import styles from "./GuideMode.module.css";



interface GuideModeProps {
    setIsGuide: React.Dispatch<React.SetStateAction<boolean>>
}

interface GuideDescriptionProps {
    top?: string,
    left?: string,
    bottom?: string,
    right?: string,
    description: string
}

export default function GuideMode({ setIsGuide }: GuideModeProps) {
    const [chapter, setChapter] = useState<number>(1);

    function GuideDescription({ top, left, bottom, right, description }: GuideDescriptionProps) {
        return (
            <div
                className={styles.guideContainer}
                style={{ top: top, left: left, bottom: bottom, right: right }}
            >
                {description}

                <div className={styles.guideButtonsZone}>
                    <div className={styles.nextButton} onClick={() => {
                        if (chapter !== 1) {
                            setChapter((prev: number) => prev - 1);
                        }
                    }}>
                        이전
                    </div>

                    <div className={styles.nextButton} onClick={() => {
                        if (chapter !== 2) {
                            setChapter((prev: number) => prev + 1);
                        }
                    }}>
                        다음
                    </div>

                    <div className={styles.closeButton} onClick={() => { setIsGuide(false); }}>그만 보기</div>
                </div>
            </div>
        )
    }


    return (
        <div>
            {
                chapter === 1

                &&

                <div>
                    <div className={styles.cover11} />
                    <div className={styles.cover12} />
                    <div className={styles.cover13} />
                    <div className={styles.cover14} />
                    <GuideDescription
                        top="120px"
                        right="20px"
                        description="버튼을 눌러서 이전/다음 문제로 이동할 수 있습니다."
                    />
                </div>
            }

            {
                chapter === 2

                &&

                <div>
                    <div className={styles.cover21} />
                    <div className={styles.cover22} />
                    <div className={styles.cover23} />
                    <GuideDescription
                        top="300px"
                        left="100px"
                        description="버튼을 클릭하면 원하는 문제로 바로 이동할 수 있습니다."
                    />
                </div>
            }
        </div>
    )
}