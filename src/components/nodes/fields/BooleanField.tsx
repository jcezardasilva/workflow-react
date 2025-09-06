import React, { useCallback, memo } from 'react';

interface BooleanFieldProps {
  name: string;
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}

const BooleanField: React.FC<BooleanFieldProps> = ({ 
  name, 
  label, 
  value, 
  onChange, 
  description
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  }, [onChange]);

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
          flexDirection: 'row',
          width: '100%'
        }}>
          <label style={{ 
            marginBottom: 0,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}>
            <input
              type="checkbox"
              checked={value}
              onChange={handleChange}
              style={{
                margin: '0 8px 0 0',
                cursor: 'pointer'
              }}
            />
            {label || name}
          </label>
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

export default memo(BooleanField);
