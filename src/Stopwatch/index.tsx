
import * as React from "react";
import { moment, Notice } from "obsidian";
import { WidgetType } from "src/types/Widgets";
import { DataJson, HelperFunctions } from "src/types/HelperFunctions";

const Stopwatch = ({
    settings,
    helperFunctions,
    leafId,
}: StopwatchProps) => {
    const [time, setTime] = React.useState(0);
    const [isRunning, setIsRunning] = React.useState(false);
    const [isCompleted, setIsCompleted] = React.useState(false);
    const notificationSent = React.useRef(false);

    // Persistence State
    const [persistedState, setPersistedState] = React.useState<StopwatchState>({
        startTime: null,
        accumulated: 0,
        isRunning: false,
    });

    const isStaticMode = !!settings.startTime;

    // Parse 'show' setting
    const showItems = settings.show?.split(",").map((item) => item.trim()) || [];
    // Default to showing everything except days if not specified, or all if preferred. 
    // Let's default to Days, Hours, Minutes, Seconds, Milliseconds or similar to Countdown logic.
    // If 'show' is empty, show everything (except maybe days if 0? No, let's allow user control or default to a standard set).
    // Let's default to everything.
    const showState = {
        days: settings.show ? showItems.includes("days") : true,
        hours: settings.show ? showItems.includes("hours") : true,
        minutes: settings.show ? showItems.includes("minutes") : true,
        seconds: settings.show ? showItems.includes("seconds") : true,
        milliseconds: settings.show ? showItems.includes("milliseconds") : true,
    };


    React.useEffect(() => {
        if (isStaticMode) {
            handleStaticMode();
        } else {
            loadPersistedState();
        }
    }, [settings.startTime, settings.endTime]);

    // Effect for dynamic timer interval
    React.useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (!isStaticMode && isRunning) {
            intervalId = setInterval(() => {
                const now = Date.now();
                if (persistedState.startTime) {
                    setTime(persistedState.accumulated + (now - persistedState.startTime));
                }
            }, 30); // Higher refresh rate for milliseconds
        } else if (isStaticMode && !isCompleted) {
            // Update static time regularly
            intervalId = setInterval(() => {
                handleStaticMode();
            }, 30);
        }

        return () => clearInterval(intervalId);
    }, [isRunning, persistedState, isStaticMode, isCompleted]);


    const handleStaticMode = () => {
        const start = moment(settings.startTime);
        const end = settings.endTime ? moment(settings.endTime) : null;
        const now = moment();

        if (!start.isValid()) {
            setTime(0);
            return;
        }

        let diff: number;
        if (end && end.isValid()) {
            if (now.isAfter(end)) {
                setIsCompleted(true);
                diff = end.diff(start);

                if (settings.notify === "true" && !notificationSent.current) {
                    const label = settings.completedLabel || "Completed! 🎉";
                    new Notice(label);
                    new Notification("TimeWidget", { body: label });
                    notificationSent.current = true;
                }

            } else {
                diff = now.diff(start);
            }
        } else {
            diff = now.diff(start);
        }

        if (diff < 0) diff = 0;
        setTime(diff);
    };

    const loadPersistedState = async () => {
        const data = await helperFunctions.readFromDataJson();
        const path = getStoragePath();
        const savedState = data[path] as StopwatchState;

        if (savedState) {
            setPersistedState(savedState);
            setIsRunning(savedState.isRunning);
            if (savedState.isRunning && savedState.startTime) {
                const now = Date.now();
                setTime(savedState.accumulated + (now - savedState.startTime));
            } else {
                setTime(savedState.accumulated);
            }
        } else {
            // Initialize default state
            saveState({
                startTime: null,
                accumulated: 0,
                isRunning: false
            });
        }
    };

    const getStoragePath = () => {
        if (leafId.length > 0) {
            return leafId + (settings.id ? `-${settings.id}` : "");
        } else {
            const { path: filePath } = helperFunctions.getCurrentOpenFile();
            return filePath + (settings.id ? `-${settings.id}` : "");
        }
    };

    const saveState = async (newState: StopwatchState) => {
        const data = await helperFunctions.readFromDataJson();
        const path = getStoragePath();
        await helperFunctions.writeToDataJson({
            ...data,
            [path]: newState,
        });
        setPersistedState(newState);
    };

    const handleStart = () => {
        const now = Date.now();
        const newState = {
            startTime: now,
            accumulated: time,
            isRunning: true
        };
        setIsRunning(true);
        saveState(newState);
    };

    const handleStop = () => {
        const now = Date.now();
        const elapsed = persistedState.startTime ? (now - persistedState.startTime) : 0;
        const newAccumulated = persistedState.accumulated + elapsed;

        const newState = {
            startTime: null,
            accumulated: newAccumulated,
            isRunning: false
        };

        setIsRunning(false);
        setTime(newAccumulated);
        saveState(newState);
    };

    const handleReset = () => {
        const newState = {
            startTime: null,
            accumulated: 0,
            isRunning: false
        };
        setIsRunning(false);
        setTime(0);
        saveState(newState);
    };

    const getDisplayValues = (ms: number) => {
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10); // Display as 2 digits roughly

        return {
            days,
            hours,
            minutes,
            seconds,
            milliseconds
        };
    };

    const values = getDisplayValues(time);

    if (isCompleted) {
        const label = settings.completedLabel || "Completed! 🎉";
        return (
            <div className="Stopwatch_Container">
                <div className="Stopwatch_Display">
                    <div className="Stopwatch_Item">
                        <h3>{label}</h3>
                    </div>
                </div>
                {settings.to && <div className="Stopwatch_To">{settings.to}</div>}
            </div>
        );
    }

    return (
        <div className="Stopwatch_Container">
            <div className="Stopwatch_Display">
                {showState.days && (
                    <div className="Stopwatch_Item">
                        <h3>{values.days}</h3>
                        <small>days</small>
                    </div>
                )}
                {showState.hours && (
                    <div className="Stopwatch_Item">
                        <h3>{values.hours}</h3>
                        <small>hours</small>
                    </div>
                )}
                {showState.minutes && (
                    <div className="Stopwatch_Item">
                        <h3>{values.minutes}</h3>
                        <small>minutes</small>
                    </div>
                )}
                {showState.seconds && (
                    <div className="Stopwatch_Item">
                        <h3>{values.seconds}</h3>
                        <small>seconds</small>
                    </div>
                )}
                {showState.milliseconds && (
                    <div className="Stopwatch_Item">
                        <h3>{values.milliseconds}</h3>
                        <small>ms</small>
                    </div>
                )}
            </div>

            {!isStaticMode && (
                <div className="Stopwatch_Controls">
                    <button
                        className="Stopwatch_Button"
                        onClick={handleStart}
                        disabled={isRunning}
                    >
                        Start
                    </button>
                    <button
                        className="Stopwatch_Button"
                        onClick={handleStop}
                        disabled={!isRunning}
                    >
                        Pause
                    </button>
                    <button className="Stopwatch_Button" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            )}
            {settings.to && <div className="Stopwatch_To">{settings.to}</div>}
        </div>
    );
};

export default Stopwatch;

export interface StopwatchSettings {
    type: WidgetType;
    id?: string;
    startTime?: string;
    endTime?: string;
    completedLabel?: string;
    to?: string;
    show?: string; // e.g. "days,hours,minutes"
    notify?: string;
}

interface StopwatchProps {
    settings: StopwatchSettings;
    helperFunctions: HelperFunctions;
    leafId: string;
}

interface StopwatchState {
    startTime: number | null;
    accumulated: number;
    isRunning: boolean;
}
