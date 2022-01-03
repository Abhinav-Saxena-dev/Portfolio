import React, { useState, useEffect } from "react";

import CustomButton from "../custom-button/custom-button.component";

import './entities.style.scss';

const Entity = () => {
    
    const [state, setState] = useState([]);

    const [det, setDet] = useState({
        tickerSymbol : "",
        avg_buy_value : 0,
        shares : 0,
    })

    useEffect(() => {
        const url = "http://localhost:8080/api/portfolio/";
        getData(url);
        console.log(state);
      }, []);
    
    const getData = async (url) => {
        const headers = { 'Content-Type': 'application/json' }
        fetch(url, { headers })
            .then(response => response.json())
            .then(data => setState([...data]))
    }

    const handleDelete = async (tickerSymbol,e) => {
        e.preventDefault();
        const url = `http://localhost:8080/api/portfolio/${tickerSymbol}`;
        await fetch(url, {method : 'DELETE'});
        getData("http://localhost:8080/api/portfolio/");
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDet((prevState) => {
          return { ...prevState, [name]: value };
        });
      };
    
      const handleSubmit = async (event) =>{
        event.preventDefault();
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(det)
      };
    await fetch('http://localhost:8080/api/portfolio', requestOptions)
   .then(response => console.log(response));

   getData('http://localhost:8080/api/portfolio/');

    setDet(({
        tickerSymbol : "",
        avg_buy_value : 0,
        shares : 0
     })
    )
    };

    return (
    <div className="container">
        <div className="head">
            <span className="text">Portfolio</span>
        </div>
        <div className="table">
            <table>
                <tr>
                    <th className="header">Ticker</th>
                    <th className="header">Average Buy Value</th>
                    <th className="header">Shares</th>
                    <th className="header">Buy/Sell</th>
                    <th className="header">Delete</th>
                </tr>
                {
                    state.map(({avg_buy_value, tickerSymbol, shares}) => ( 
                        <tr>
                            <td className="">{tickerSymbol}</td>
                            <td className="">{avg_buy_value}</td>
                            <td className="">{shares}</td>
                            <td className=""><CustomButton >Buy/Sell</CustomButton></td>
                            <td className=""><CustomButton onClick = {(e) => handleDelete(tickerSymbol,e)} >Delete</CustomButton></td>
                        </tr> 
                        )
                    )
                }
            </table>
        </div>
            <div className="form-container">
                <form className="form" onSubmit={handleSubmit}>
                    <input type="text" name = "tickerSymbol" value = {det.tickerSymbol} onChange = {handleChange} label = "Ticker" placeholder="Ticker Here" />
                    <input type="number" min={0} name = "avg_buy_value" value = {det.avg_buy_value} onChange = {handleChange} label = "Average Buy Value" placeholder="Average Buy Value Here" />
                    <input type="number" min={0} name = "shares" value = {det.shares} onChange = {handleChange} label = "Shares" placeholder="Shares Here" />                   
                <CustomButton type="submit">Add</CustomButton>
                </form>
            </div>
    </div>
);
}

export default Entity;