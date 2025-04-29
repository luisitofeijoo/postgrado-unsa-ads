import React from 'react';
import PropTypes from 'prop-types';
import './style.css';

function Loading({ loading = false, background = 'rgba(236, 240, 241, 0.7)', loaderColor = '#e74c3c' }) {
    if (loading) {
        const backgroundColor = {
            background: background,
        };
        const loaderStyle = {
            background: loaderColor,
        };

        return (
            <>
                <div className="loading-background" style={backgroundColor}>
                    <div className="loading-bar">
                        <div className="loading-circle-1" style={loaderStyle} />
                        <div className="loading-circle-2" style={loaderStyle} />
                    </div>
                </div>
            </>
        );
    }

    return null;
}

Loading.propTypes = {
    loading: PropTypes.bool,
    background: PropTypes.string,
    loaderColor: PropTypes.string,
};

export default Loading;
