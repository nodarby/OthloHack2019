import React from 'react';
import PropTypes from 'prop-types';

export default function Assessmentor({ url }) {
    return (
        <div>
            <h2>サイトタイトル</h2>
            <p>URL: {url}</p>
        </div>
    )
}
Assessmentor.propTypes = {
    url: PropTypes.string
};
Assessmentor.defaultProps = {
    url: 'https://www.google.com/'
};