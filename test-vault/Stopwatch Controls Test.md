# Stopwatch Controls Test

This note tests the new `controls` parameter for the Stopwatch widget.

## 1. Default (No controls parameter)
Expected: Show Start, Pause, Reset (All)

```timewidget
type: stopwatch
to: Default
```

## 2. Start Only
Expected: Show only Start button

```timewidget
type: stopwatch
to: Start Only
controls: start
```

## 3. Start and Reset
Expected: Show Start and Reset buttons

```timewidget
type: stopwatch
to: Start & Reset
controls: start, reset
```

## 4. Pause and Reset
Expected: Show Pause and Reset buttons

```timewidget
type: stopwatch
to: Pause & Reset
controls: pause, reset
```

## 5. All Explicit
Expected: Show Start, Pause, Reset

```timewidget
type: stopwatch
to: All Explicit
controls: start, pause, reset
```

## 6. No Controls (Empty)
Expected: Show No buttons (Time display only)

```timewidget
type: stopwatch
to: No Controls
controls: 
```

## 7. Invalid Control Name
Expected: Show only valid optional buttons (e.g. 'start' here, 'fly' ignored)

```timewidget
type: stopwatch
to: Invalid Param Test
controls: start, fly
```


## StartTime 

```timewidget
type: stopwatch
startTime: 2026-01-08 07:50
show: hours, minutes, seconds
to: Son mesaj
```
