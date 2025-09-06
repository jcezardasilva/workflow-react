import React, { memo } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Field, FieldData } from '../../types';
import FieldRenderer from './fields/FieldRenderer';

interface NodeOutputFieldsProps {
  fields: Field[];
  control: Control<FieldData>;
  errors: FieldErrors<FieldData>;
}

const NodeOutputFields: React.FC<NodeOutputFieldsProps> = ({ fields, control, errors }) => {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Outputs</div>
      {fields.map((field) => (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          render={({ field: formField }: { field: any }) => (
            <div>
              <FieldRenderer
                field={field}
                value={formField.value || ''}
                onChange={formField.onChange}
              />
              {errors[field.name] && (
                <div style={{ 
                  color: '#ff6b6b', 
                  fontSize: '12px', 
                  marginTop: '4px',
                  marginLeft: '8px'
                }}>
                  {errors[field.name]?.message}
                </div>
              )}
            </div>
          )}
        />
      ))}
    </div>
  );
};

export default memo(NodeOutputFields);
