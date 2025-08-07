import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

function Chart({ data }) {
  return (
    <div style={{ marginTop: '30px' }}>
      <h2>EMG Chart</h2>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" hide />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
      </LineChart>
    </div>
  );
}

export default Chart;
