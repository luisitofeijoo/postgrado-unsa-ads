/*
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const Alert = ({ content, status }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    const success = () => {
        setShow(false);
    };

    return (
        <>
            {show && (
                <div className={`alert alert-${status}`}>
                    {content}
                </div>
            )}
        </>
    );
};

const ShowAlert = (content, status) => {
    const rootElement = document.createElement('div');
    document.body.appendChild(rootElement);

    const success = () => {
        ReactDOM.unmountComponentAtNode(rootElement);
    };

    ReactDOM.render(
        <Alert content={content} status={status} success={success} />,
        rootElement
    );

    return new Promise((resolve) => {
        success();
        resolve('ok');
    });
};

export default ShowAlert;
*/
