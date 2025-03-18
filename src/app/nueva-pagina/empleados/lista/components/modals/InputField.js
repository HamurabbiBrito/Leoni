// components/InputField.js
import React from 'react';

const InputField = ({ label, type = "text", value, onChange, disabled = false, isSelect = false, options = [] }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {isSelect ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
          disabled={disabled}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full p-2 border rounded bg-gray-200"
        />
      )}
    </div>
  );
};

export default InputField;