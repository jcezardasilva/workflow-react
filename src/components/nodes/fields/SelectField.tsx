import React, { useCallback, memo } from 'react';

interface SelectFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  options: string[];
  placeholder?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ 
  name, 
  label, 
  value, 
  onChange, 
  description,
  options,
  placeholder = "Selecione..."
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const commonStyles = {
    width: '100%',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-primary)',
    padding: '4px 8px',
    borderRadius: '4px'
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          flexDirection: 'column',
          width: '100%'
        }}>
          <label style={{ 
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-primary)'
          }}>
            {label || name}
          </label>
          <select
            value={value}
            onChange={handleChange}
            style={commonStyles}
          >
            <option value="">{placeholder}</option>
            {options.map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>
        </div>
        {description && (
          <span style={{ fontSize: '0.8em', color: 'var(--text-muted)' }}>
            ({description})
          </span>
        )}
      </div>
    </div>
  );
};

export default memo(SelectField);
