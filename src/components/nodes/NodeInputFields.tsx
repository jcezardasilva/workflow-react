import React, { memo } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Field, FieldData } from '../../types';
import FieldRenderer from './fields/FieldRenderer';

interface NodeInputFieldsProps {
  fields: Field[];
  control: Control<FieldData>;
  errors: FieldErrors<FieldData>;
}

const NodeInputFields: React.FC<NodeInputFieldsProps> = ({ fields, control, errors }) => {
  return (
    <div>
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

export default memo(NodeInputFields, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renders desnecessários
  if (prevProps.fields !== nextProps.fields) return false;
  if (prevProps.control !== nextProps.control) return false;
  if (prevProps.errors !== nextProps.errors) return false;
  
  return true; // Props são iguais, não re-renderizar
});
