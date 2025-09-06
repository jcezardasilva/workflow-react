import React, { useCallback, memo } from 'react';

interface TextareaFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
  placeholder?: string;
  minHeight?: number;
}

const TextareaField: React.FC<TextareaFieldProps> = ({ 
  name, 
  label, 
  value, 
  onChange, 
  description,
  placeholder,
  minHeight = 80
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const commonStyles = {
    width: '100%',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-primary)',
    padding: '4px 8px',
    borderRadius: '4px',
    minHeight: `${minHeight}px`,
    resize: 'vertical' as const
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
          <textarea
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

export default memo(TextareaField);
