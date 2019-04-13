import React, { Component } from 'react';
import api from '../../services/api'

//import _logo from '../../assets/logo.svg'
import './styles.css';

export default class Main extends Component {
    state = {
        newBox: '',
    };

    handleInputChange = (e) => {
        this.setState({ newBox: e.target.value });
    }

    handleSubmit = async e => {
        e.preventDefault();

        const response = await api.post('boxes', {
            title: this.state.newBox,
        });
        this.props.history.push(`/box/${response.data._id}`)
    }

  render() {
    return (
        <div id="main-container">
            <form onSubmit={this.handleSubmit}>
                {/* <img scr={_logo} alt=""/> */}
                <input 
                    placeholder="Criar um box"
                    value={this.state.newBox}
                    onChange={this.handleInputChange}
                />
                <button type="submit">Criar</button>
            </form>
        </div>
    );
  }
}
