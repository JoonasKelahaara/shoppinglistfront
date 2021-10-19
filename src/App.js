import './App.css';
import {useState,useEffect} from 'react';
import axios from 'axios';

const URL = 'http://localhost/shoppinglist/'

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    axios.get(URL + 'index.php')
    .then((response) => {
      setItems(response.data);
    }).catch(error =>{
      alert(error.response ? error.response.data.error : error);
    })
  }, []);

  function save(e) {
    e.preventDefault();
    const json = JSON.stringify({description:item, amount:amount})
    axios.post(URL + 'add.php',json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    })
      .then((response) => {
        setItems(items => [...items, response.data]);
        setItem('');
        setAmount(0);
      }).catch(error => {
        alert(error.response.data.error);
      })
  }

  function remove(id) {
    const json = JSON.stringify({id:id})
    axios.post(URL + 'delete.php', json, {
      headers: {
        'Content-Type' : 'application/json'
      }
    }) .then((response) => {
      const newListWithoutRemoved = items.filter((item) => item.id !== id);
      setItems(newListWithoutRemoved)
    }).catch(error => {
      alert(error.response ? error.response.data.error : error);
    })
  }

  return (
    <div className="container">
      <h3>Shopping List</h3>
      <form onSubmit={save}>
        <label>New item</label>
        <input placeholder='Type description' value={item} onChange={e => setItem(e.target.value)} />
        <label>Amount:</label>
        <input placeholder='Type amount' type="number" value={amount} onChange={e => setAmount(e.target.value)} />
        <button>Add</button>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>
            {item.description}&nbsp;{item.amount}&nbsp;
            <a href='#' className='delete' onClick={() => remove(item.id)}>Remove</a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
