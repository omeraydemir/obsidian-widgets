import { ClockSettings } from "src/Clock";
import { CountdownSettings } from "src/Countdown";
import { CounterSettings } from "src/Counter";
import { StopwatchSettings } from "src/Stopwatch";

export type WidgetType = "clock" | "countdown" | "counter" | "stopwatch";

export type WidgetSettings =
	| ClockSettings

	| CountdownSettings
	| CounterSettings
	| StopwatchSettings;
