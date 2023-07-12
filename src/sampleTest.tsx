export const sampleTestInfo = {
    color: 1,
    created: Date.now(),
    duration: 60,
    feedback: false,
    feedbackQnA: {
        answer: true,
        question: true
    },
    feedbackScore: {
        average: false,
        rank: false,
        score: true
    },
    feedbackTime: {
        start: Date.now(),
        finish: Date.now() + 36000000
    },
    idCard: false,
    managerCode: "AGrRbUSDWXW1HEVRLgM5M1LDLB42",
    managerName: "테스트콘",
    noticeChatting: false,
    preview: true,
    reEntry: false,
    shortTestCode: "TEST",
    startDate: Date.now(),
    testName: "시험 환경 테스트",
    webCam: false
}

export const sampleApplicantInfo = {
    answerSheet: new Array(100).fill(null),
    applicantName: "체험 응시자",
    chatting: [],
    created: Date.now(),
    finished: false,
    log: [],
    pause: false,
    reportCard: new Array(100).fill(null),
    shortApplicantCode: "SAMPLE",
    submitted: 0
}