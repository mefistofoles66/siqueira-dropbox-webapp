import React, {Component} from 'react';
import api from '../../services/api'
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Dropzone from 'react-dropzone';
import socket from 'socket.io-client';

import { MdInsertDriveFile } from 'react-icons/md';
import './styles.css';

export default class Box extends Component {
    state = { box: {} }

    subscribeToNewFiles = () => {
        const box = this.props.match.params.id;
        const io = socket('https://siqueira-dropbox-backend.herokuapp.com', { transport : ['websocket'] });

        io.emit('connectRoom', box);

        io.on('file', data => {
            this.setState({ box: { ... this.state.box, files: [data, {... this.state.box.files }] } })
        })
    }

    handleUpload = (files) => {
        files.forEach(file => {
            const data = new FormData();

            data.append('file', file);

            api.post(`boxes/${this.state.box._id}/files`, data)
        });
    }

    async componentDidMount() {
        this.subscribeToNewFiles();

        const box = this.props.match.params.id;
        const response = await api.get(`boxes/${box}`)

        this.setState({ box: response.data });
    }

  render() {
    return (
        <div id="box-container">
         <header>
             <h1>{this.state.box.title}</h1>
         </header>

        <Dropzone onDropAccepted={this.handleUpload}>
            {({ getRootProps, getInputProps}) => (
                <div className='upload' {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Arraste arquivos ou clique aqui</p>
                </div>
            )}
        </Dropzone>

         <ul>
             { this.state.box.files && this.state.box.files.map(file => (
                 <li key={file._id}>
                 <a className='fileInfo' href={file.url}>
                    <MdInsertDriveFile size={24} color="#A5Cfff" target='_blank' />
                    <strong>{file.title}</strong>
                 </a>
                 <span>
                     há{" "}
                    {distanceInWords(file.createdAt, new Date(), {
                        locale: pt
                    })}
                 </span>
             </li>
             )) }
         </ul>
        </div>
    );
  }
}
