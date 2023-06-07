import React from "react";

const Timer: React.FC = () => {
    const [days, setDays] = React.useState(0);
    const [hours, setHours]= React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(0);
    return (
        <div className="timer">
            {/* Timer content */}
        </div>
    )
}

export default Timer;
