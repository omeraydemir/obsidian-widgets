
import * as React from "react";
import { WidgetType } from "src/types/Widgets";

const Stopwatch = ({ settings }: StopwatchProps) => {
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);

    React.useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(0);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor((time / 60000) % 60);
        const seconds = Math.floor((time / 1000) % 60);
        const milliseconds = Math.floor((time / 10) % 100);

        const getMinutes = `0${minutes}`.slice(-2);
        const getSeconds = `0${seconds}`.slice(-2);
        const getMilliseconds = `0${milliseconds}`.slice(-2);

        return `${getMinutes}:${getSeconds}:${getMilliseconds}`;
    };

    return (
        <div className="Stopwatch_Container">
            <div className="Stopwatch_Time">{formatTime(time)}</div>
            <div className="Stopwatch_Controls">
                <button className="Stopwatch_Button" onClick={handleStartStop}>
                    {isRunning ? "Stop" : "Start"}
                </button>
                <button className="Stopwatch_Button" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Stopwatch;

export interface StopwatchSettings {
    type: WidgetType;
}

interface StopwatchProps {
    settings: StopwatchSettings;
}
