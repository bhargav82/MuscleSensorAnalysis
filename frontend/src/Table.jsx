

function Table({ data }) 
{
    const firstVal = data[0].timestamp;
    return (
      <div style={{ marginTop: '30px' }}>
        <h2>Data Table</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>#</th>
              <th>Time (ms)</th>
              <th>Value (mV)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({timestamp, value}, index) => 
            <tr key = {index}>
                <td>{index + 1}</td>
                <td>{timestamp - firstVal}</td>
                <td>{value}</td>
            </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
  
  export default Table;