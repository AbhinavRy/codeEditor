import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from './components/Editor';
import useLocalStorage from './hooks/useLocalStorage';

const baseURL = 'http://localhost:5000/api/user';

function App() {
    const [html, setHtml] = useLocalStorage('html', '');
    const [css, setCss] = useLocalStorage('css', '');
    const [javascript, setJavascript] = useLocalStorage('javascript', '');
    const [srcDoc, setSrcDoc] = useState('');

    const [login, setLogin] = useState(false);
    const [signup, setSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${javascript}</script>
        </html>
      `);
        }, 250);
        // console.log(srcDoc)
        return () => clearTimeout(timeout);
    }, [html, css, javascript]);

    const cancel = () => {
        setSignup(false);
        setLogin(false);
    };

    const submit = async () => {
        if (login) {
            const res = await axios.post(baseURL + '/login', {
                email,
                password,
            });
            if (res.data.msg === 'matched') {
                localStorage.setItem('isLogged', true);
            }
        } else {
            const res = await axios.post(baseURL + '/', {
                name,
                email,
                password,
            });
            console.log(res);
        }
        cancel();
        window.location.reload();
    };

    return (
        <div className='app'>
            <div className='header'>
                {!localStorage.getItem('isLogged') ? (
                    <div>
                        <button
                            className='login'
                            onClick={() => setLogin(!login)}
                        >
                            Login
                        </button>
                        <button
                            className='signup'
                            onClick={() => setSignup(!signup)}
                        >
                            Signup
                        </button>
                    </div>
                ) : (
                    <div className='header'>
                        <button
                            className='signup'
                            onClick={() => {localStorage.setItem('isLogged', ''); window.location.reload();}}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
            {(login || signup) && (
                <div className='modal-container'>
                    <div className='overlay'></div>
                    <div className='modal'>
                        <h2>{login ? 'Login' : 'Signup'}</h2>
                        {signup && (
                            <input
                                type='name'
                                placeholder='Name'
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        )}
                        <input
                            type='email'
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <div className='modal-footer'>
                            <button className='submit' onClick={submit}>
                                Submit
                            </button>
                            <button className='cancel' onClick={cancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className='pane top-pane'>
                <Editor
                    launguage='xml'
                    label='HTML'
                    value={html}
                    onChange={setHtml}
                />
                <Editor
                    launguage='css'
                    label='CSS'
                    value={css}
                    onChange={setCss}
                />
                <Editor
                    launguage='javascript'
                    label='JavaScript'
                    value={javascript}
                    onChange={setJavascript}
                />
            </div>
            <div className='bottom-pane'>
                <iframe
                    srcDoc={srcDoc}
                    title='output'
                    sandbox='allow-scripts'
                    frameBorder='0'
                    width='100%'
                    height='100%'
                ></iframe>
            </div>
        </div>
    );
}

export default App;
