import React, { memo } from 'react';
import { Field } from '../../../types';
import TextField from './TextField';
import SelectField from './SelectField';
import TextareaField from './TextareaField';
import NumberField from './NumberField';
import BooleanField from './BooleanField';

interface FieldRendererProps {
  field: Field;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({ field, value, onChange }) => {
  const handleChange = (newValue: string | number | boolean) => {
    onChange(newValue);
  };

  // Render based on field type
  switch (field.type) {
    case 'select':
      return (
        <SelectField
          name={field.name}
          label={field.label}
          value={String(value || '')}
          onChange={(val) => handleChange(val)}
          description={field.description}
          options={field.enum || []}
        />
      );

    case 'textarea':
      return (
        <TextareaField
          name={field.name}
          label={field.label}
          value={String(value || '')}
          onChange={(val) => handleChange(val)}
          description={field.description}
        />
      );

    case 'number':
      return (
        <NumberField
          name={field.name}
          label={field.label}
          value={Number(value) || 0}
          onChange={(val) => handleChange(val)}
          description={field.description}
          min={field.min}
          max={field.max}
        />
      );

    case 'boolean':
      return (
        <BooleanField
          name={field.name}
          label={field.label}
          value={Boolean(value)}
          onChange={(val) => handleChange(val)}
          description={field.description}
        />
      );

    case 'text':
    default:
      return (
        <TextField
          name={field.name}
          label={field.label}
          value={String(value || '')}
          onChange={(val) => handleChange(val)}
          description={field.description}
        />
      );
  }
};

export default memo(FieldRenderer);
