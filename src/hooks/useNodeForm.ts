import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useMemo, useState } from 'react';
import { Fields, FieldData, NodeDefinition, NodeFormData } from '../types';

/**
 * Cria um schema Zod dinâmico baseado nos campos do nó
 */
const createNodeSchema = (fields: Fields): z.ZodSchema<NodeFormData> => {
  const schemaFields: Record<string, z.ZodTypeAny> = {};
  
  // Processa campos de input e output
  [...fields.input, ...fields.output].forEach(field => {
    let fieldSchema: z.ZodTypeAny;
    
    switch (field.type) {
      case 'number':
        let numberSchema = z.number({
          message: `${field.label || field.name} deve ser um número`
        });
        
        // Aplica min/max se definidos
        if (field.min !== undefined) {
          numberSchema = numberSchema.min(field.min, {
            message: `${field.label || field.name} deve ser maior ou igual a ${field.min}`
          });
        }
        if (field.max !== undefined) {
          numberSchema = numberSchema.max(field.max, {
            message: `${field.label || field.name} deve ser menor ou igual a ${field.max}`
          });
        }
        fieldSchema = numberSchema;
        break;
        
      case 'boolean':
        fieldSchema = z.boolean({
          message: `${field.label || field.name} deve ser verdadeiro ou falso`
        });
        break;
        
      case 'select':
        // Para select, valida se o valor está nas opções disponíveis
        const options = field.enum || [];
        fieldSchema = z.string({
          message: `${field.label || field.name} é obrigatório`
        }).refine(
          (val) => options.includes(val),
          {
            message: `${field.label || field.name} deve ser uma das opções: ${options.join(', ')}`
          }
        );
        break;
        
      case 'textarea':
        fieldSchema = z.string({
          message: `${field.label || field.name} é obrigatório`
        }).min(1, {
          message: `${field.label || field.name} não pode estar vazio`
        });
        break;
        
      case 'text':
      default:
        fieldSchema = z.string({
          message: `${field.label || field.name} é obrigatório`
        }).min(1, {
          message: `${field.label || field.name} não pode estar vazio`
        });
        break;
    }
    
    // Torna o campo opcional se não tem valor padrão
    if (field.value === undefined || field.value === '') {
      fieldSchema = fieldSchema.optional();
    }
    
    schemaFields[field.name] = fieldSchema;
  });
  
  // Adiciona campos de informações do nó
  schemaFields.title = z.string().optional();
  schemaFields.customDescription = z.string().optional();
  schemaFields.tags = z.array(z.string()).optional();
  
  return z.object(schemaFields) as z.ZodSchema<NodeFormData>;
};

/**
 * Extrai dados do formulário dos campos do nó
 */
const extractFormDataFromFields = (nodeData: NodeDefinition): NodeFormData => {
  const formData: NodeFormData = {};
  
  // Extrai de campos de input
  if (nodeData.fields?.input) {
    nodeData.fields.input.forEach((field) => {
      if (field.value !== undefined) {
        // Converte valores baseado no tipo
        switch (field.type) {
          case 'number':
            formData[field.name] = Number(field.value) || 0;
            break;
          case 'boolean':
            formData[field.name] = Boolean(field.value);
            break;
          default:
            formData[field.name] = String(field.value);
        }
      }
    });
  }
  
  // Extrai de campos de output
  if (nodeData.fields?.output) {
    nodeData.fields.output.forEach((field) => {
      if (field.value !== undefined) {
        // Converte valores baseado no tipo
        switch (field.type) {
          case 'number':
            formData[field.name] = Number(field.value) || 0;
            break;
          case 'boolean':
            formData[field.name] = Boolean(field.value);
            break;
          default:
            formData[field.name] = String(field.value);
        }
      }
    });
  }
  
  // Extrai campos de informações do nó
  formData.title = nodeData.title || '';
  formData.customDescription = nodeData.customDescription || '';
  formData.tags = nodeData.tags || [];
  
  return formData;
};

/**
 * Atualiza os campos do nó com os dados do formulário
 */
const updateFieldsWithData = (fields: Fields, formData: FieldData) => {
  return {
    input: fields.input.map((field) => ({
      ...field,
      value: formData[field.name] !== undefined ? formData[field.name] : field.value
    })),
    output: fields.output.map((field) => ({
      ...field,
      value: formData[field.name] !== undefined ? formData[field.name] : field.value
    }))
  };
};

/**
 * Atualiza os dados do nó com os dados do formulário
 */
const updateNodeDataWithFormData = (nodeData: NodeDefinition, formData: NodeFormData) => {
  const updatedFields = updateFieldsWithData(nodeData.fields, formData);
  
  return {
    ...nodeData,
    fields: updatedFields,
    title: formData.title || '',
    customDescription: formData.customDescription || '',
    tags: formData.tags || []
  };
};

/**
 * Hook customizado para gerenciar formulários de nós
 */
export const useNodeForm = (fields: Fields, initialData: NodeDefinition) => {
  // Cria o schema dinâmico
  const schema = useMemo(() => createNodeSchema(fields), [fields]);
  
  // Extrai dados iniciais
  const defaultValues = useMemo(() => extractFormDataFromFields(initialData), [initialData]);
  
  // Configura o formulário
  const form = useForm<NodeFormData>({
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: 'onChange', // Validação em tempo real
    reValidateMode: 'onChange'
  });

  // Estado para controlar se o botão de salvar deve estar ativo (sempre true para evitar perda de foco)
  const [isFormDirty] = useState(true);
  
  // Função para salvar os dados
  const saveFormData = useCallback((formData: NodeFormData) => {
    return updateNodeDataWithFormData(initialData, formData);
  }, [initialData]);
  
  // Função para resetar o formulário
  const resetForm = useCallback(() => {
    const newDefaultValues = extractFormDataFromFields(initialData);
    form.reset(newDefaultValues);
  }, [form, initialData]);
  
  return {
    form,
    saveFormData,
    resetForm,
    // Exposições úteis do react-hook-form
    handleSubmit: form.handleSubmit,
    watch: form.watch,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: isFormDirty, // Usa o estado local em vez do form.formState.isDirty
    isSubmitting: form.formState.isSubmitting
  };
};
