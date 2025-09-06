import React, { useCallback, memo } from 'react';

interface TextFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
}

const TextField: React.FC<TextFieldProps> = ({ 
  name, 
  label, 
  value, 
  onChange, 
  description,
  placeholder 
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
          <input
            type="text"
            value={value}
            onChange={handleChange}
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

export default memo(TextField);
