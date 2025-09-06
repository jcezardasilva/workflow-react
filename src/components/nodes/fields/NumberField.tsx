import React, { useCallback, memo } from 'react';

interface NumberFieldProps {
  name: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

const NumberField: React.FC<NumberFieldProps> = ({ 
  name, 
  label, 
  value, 
  onChange, 
  description,
  min,
  max,
  step,
  placeholder
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(e.target.value);
    onChange(numValue);
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
          <input
            type="number"
            value={value || ''}
            onChange={handleChange}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            style={commonStyles}
          />
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

export default memo(NumberField);
