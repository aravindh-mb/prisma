import { useState } from 'react';
import './App.css';
import axios from "axios";

function App() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const myquery = `
      query {
        events {
          id
          first_name
          last_name
          email
          gender
          ip_address
          address
        }
      }
    `;

    try {
      const response = await axios.post('http://localhost:3000/graphql', { query: myquery });
      setData(response.data.data.events);
      console.log(response.data.data.events);
    } catch (error) {
      console.error(error);
    }
  } 
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>React with GraphQL</h1>
        <button onClick={fetchData}>Fetch data</button>
      </header>
      
      {
        data ? 
        <table>
        <thead>
          <tr>
            <th>id</th>
            <th>first_name</th>
            <th>last_name</th>
            <th>email</th>
            <th>gender</th>
            <th>ip_address</th>
            <th>address</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.first_name}</td>
              <td>{item.last_name}</td>
              <td>{item.email}</td>
              <td>{item.gender}</td>
              <td>{item.ip_address}</td>
              <td>{item.address}</td>
            </tr>
          ))}
        </tbody>
      </table> : null
      }
    </div>
  );
}

export default App;
