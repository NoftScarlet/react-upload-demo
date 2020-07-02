
import React from 'react';
import UploadPDF from './components/UploadPDF';

import './App.css';

const App = () => (
    <div className='container mt-4'>
        <h4 className='display-4 text-center mb-4'>
            <i className='fab fa-react' /> PDF Upload
        </h4>

        <UploadPDF />
    </div>
);

export default App;
