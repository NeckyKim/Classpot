import { useEffect, useState } from "react"



export default function TimeCalculator( startDate: number, duration: number ) {
    // 시험 진행 상황
    const [isTestTime, setIsTestTime] = useState<string>("불");

    const startTime = startDate;
    const [currentTime, setIsCurrentTime] = useState<any>(Date.now());
    const finishTime = startDate + duration * 60000;

    useEffect(() => {
        const clock = setInterval(() => {
            setIsCurrentTime(Date.now());
        }, 1000);

        return (() => clearInterval(clock))
    }, []);

    useEffect(() => {
        if (currentTime < startTime) {
            setIsTestTime("전");
        }

        else if (currentTime >= startTime && currentTime <= finishTime) {
            setIsTestTime("중");
        }

        else if (currentTime > finishTime) {
            setIsTestTime("후");
        }
    })

    // 시험 시작 전 남은 시간
    var daysBefore = Math.floor((startTime - currentTime) / 86400000)
    var hoursBefore = Math.floor(((startTime - currentTime) - daysBefore * 86400000) / 3600000);
    var minutesBefore = Math.floor(((startTime - currentTime) - daysBefore * 86400000 - hoursBefore * 3600000) / 60000);
    var secondsBefore = Math.floor(((startTime - currentTime) - daysBefore * 86400000 - hoursBefore * 3600000 - minutesBefore * 60000) / 1000);



    // 시험 응시 중 남은 시간
    var hoursCurrent = Math.floor((finishTime - currentTime) / 3600000);
    var minutesCurrent = Math.floor(((finishTime - currentTime) - hoursCurrent * 3600000) / 60000);
    var secondsCurrent = Math.floor(((finishTime - currentTime) - hoursCurrent * 3600000 - minutesCurrent * 60000) / 1000);


    return [isTestTime, [daysBefore, hoursBefore, minutesBefore, secondsBefore], [hoursCurrent, minutesCurrent, secondsCurrent]]
}