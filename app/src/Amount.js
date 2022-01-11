import { Fragment, useState, useEffect } from 'react';

function Amount(props) {
    const [currentValue, setCurrentValue] = useState(0);
    const [maxValue, setMaxValue] = useState(0);
    const [unit] = useState(props.unit);

    useEffect(() => {
        setMaxValue(props.value);
        let timerId = setInterval(() => {
            setCurrentValue(currentValue => {
                let step = parseInt((maxValue - currentValue) / 2);
                let newValue = currentValue + Math.max(step, 1);
                if (newValue >= maxValue) clearInterval(timerId);
                return Math.min(maxValue, newValue);
            })
        }, 100);
        return () => { clearInterval(timerId) };
    })

    return (
        <Fragment>
            <div>{currentValue}</div>
            <span>&nbsp;{unit}</span>
        </Fragment>
    );
}

export default Amount;