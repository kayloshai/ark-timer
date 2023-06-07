import React, { useState } from 'react';
import customLabels from './customLabels.json';

interface CustomLabelInputProps {
  onLabelChange: (label: string) => void;
}

const CustomLabelInput: React.FC<CustomLabelInputProps> = ({ onLabelChange }) => {
  const [customLabel, setCustomLabel] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLabel = e.target.value;
    setCustomLabel(selectedLabel);
    setShowCustom(selectedLabel === 'custom');
    onLabelChange(selectedLabel === 'custom' ? customValue : selectedLabel);
  };

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(e.target.value);
    onLabelChange(e.target.value);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label htmlFor="customLabel">Label:</label>
      <select id="customLabel" value={customLabel} onChange={handleLabelChange}>
        <option value="">Select Dino</option>
        <option value="custom">Custom</option>
        {customLabels.map((label: string) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
      </select>
      {showCustom && (
        <input
          type="text"
          value={customValue}
          onChange={handleCustomValueChange}
          style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }}
        />
      )}
    </div>
  );
};

export default CustomLabelInput;
