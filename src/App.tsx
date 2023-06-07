import React from 'react';
import CustomLabelInput from './CustomLabelInput';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import './App.css';

interface Timer {
  id: number;
  time: number;
  intervalId: NodeJS.Timeout | undefined;
  label: string;
}

const CustomTimer: React.FC<{ onTimerStart: (time: number, label: string) => void }> = ({ onTimerStart }) => {
  const [customHours, setCustomHours] = React.useState<number>(0);
  const [customMinutes, setCustomMinutes] = React.useState<number>(0);
  const [customLabel, setCustomLabel] = React.useState<string>('');

  const handleStartCustomTimer = () => {
    const totalMinutes = customHours * 60 + customMinutes;
    if (totalMinutes > 0) {
      onTimerStart(totalMinutes, customLabel);
      setCustomHours(0);
      setCustomMinutes(0);
      setCustomLabel('');
    }
  };

  const handleCustomLabelChange = (label: string) => {
    setCustomLabel(label);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="customHours">Hours:</label>
      <input
        id="customHours"
        type="number"
        min="0"
        value={customHours}
        onChange={(e) => setCustomHours(parseInt(e.target.value))}
        style={{ width: '25px', marginLeft: '0.5rem', marginRight: '0.5rem' }}
      />
      <label htmlFor="customMinutes">Minutes:</label>
      <input
        id="customMinutes"
        type="number"
        min="0"
        value={customMinutes}
        onChange={(e) => setCustomMinutes(parseInt(e.target.value))}
        style={{ width: '25px', marginLeft: '0.5rem', marginRight: '0.5rem' }}
      />
      <CustomLabelInput onLabelChange={handleCustomLabelChange} />
      <button onClick={handleStartCustomTimer}>Start Custom Timer</button>
    </div>
  );
};

const CountdownTimer: React.FC = () => {
  const [timers, setTimers] = React.useState<Timer[]>([]);
  const [newTimerId, setNewTimerId] = React.useState(1);
  const [showCustomTimer, setShowCustomTimer] = React.useState(false);

  const handleAddTimer = (time: number, label: string) => {
    const newTimer: Timer = {
      id: newTimerId,
      time: time * 60,
      intervalId: undefined,
      label: label,
    };

    const intervalId = setInterval(() => {
      setTimers((prevTimers) => {
        const updatedTimers = prevTimers.map((timer) => {
          if (timer.id === newTimer.id && timer.time > 0) {
            return { ...timer, time: timer.time - 1 };
          }
          return timer;
        });

        return updatedTimers;
      });
    }, 1000); // 1000 milliseconds

    newTimer.intervalId = intervalId;

    setTimers((prevTimers) => [...prevTimers, newTimer]);
    setNewTimerId((prevId) => prevId + 1);
  };

  const handleShowCustomTimer = () => {
    setShowCustomTimer((prevState) => !prevState);
  };

  const handleRemoveTimer = (id: number) => {
    setTimers((prevTimers) => prevTimers.filter((timer) => timer.id !== id));
  };

  const handleResetTimers = () => {
    setTimers([]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    const newTimers = [...timers];
    const [removedTimer] = newTimers.splice(source.index, 1);
    newTimers.splice(destination.index, 0, removedTimer);

    setTimers(newTimers);
  };

  React.useEffect(() => {
    timers.forEach((timer) => {
      if (timer.time === 0 && timer.intervalId) {
        clearInterval(timer.intervalId);
      }
    });
  }, [timers]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours} hrs : ${minutes.toString().padStart(2, '0')} mins : ${seconds.toString().padStart(2, '0')} secs`;
  };

  return (
    <div>
      <button onClick={() => handleAddTimer(0.166667, '10 seconds')}>
        Start 10 seconds
      </button>
      <button onClick={() => handleAddTimer(5, '5 min')}>
        Start 5 min
      </button>
      <button onClick={() => handleAddTimer(10, '10 min')}>
        Start 10 min
      </button>
      <button onClick={handleShowCustomTimer}>
        {showCustomTimer ? 'Hide Custom' : 'Custom'}
      </button>
      {showCustomTimer && <CustomTimer onTimerStart={handleAddTimer} />}
      <button onClick={handleResetTimers}>
        Reset Timers
      </button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="timers">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {timers.map((timer, index) => (
                <Draggable key={timer.id.toString()} draggableId={timer.id.toString()} index={index}>yarn
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="App-header"
                    >
                      {timer.label && <span>{timer.label}: </span>}
                      <span>{formatTime(timer.time)}</span>
                      <button onClick={() => handleRemoveTimer(timer.id)}>
                        X
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <CountdownTimer />
    </div>
  );
};

export default App;
