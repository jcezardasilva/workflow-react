import React from 'react';

interface VariablesTableProps {
  data: any[];
}

const VariablesTable: React.FC<VariablesTableProps> = ({ data }) => {
  if (!data || !Array.isArray(data)) return <div>Nenhuma variável de contexto.</div>;
  return (
    <table style={{ width: '100%', background: '#333', color: 'white', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #444', padding: 4 }}>Nome</th>
          <th style={{ border: '1px solid #444', padding: 4 }}>Valor</th>
        </tr>
      </thead>
      <tbody>
        {data.map((v, idx) => (
          <tr key={idx}>
            <td style={{ border: '1px solid #444', padding: 4 }}>{v.name}</td>
            <td style={{ border: '1px solid #444', padding: 4 }}>{v.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VariablesTable;
