import React from 'react';
import PropTypes from 'prop-types';

export default class Assessmentor extends React.Component {
    componentWillMount() {
        this.props.onMount(this.props.urlID);
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.urlId !== nextProps.urlId) {
            this.props.onUpdate(nextProps.urlId);
        }
    }

    render() {
        return (
            <div>
                <h2>Assessmentor Component</h2>
                <p>URL: {this.props.urlID}</p>
            </div>
        )
    }
}
Assessmentor.propTypes = {
    urlID: PropTypes.string,
    onMount: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
};
Assessmentor.defaultProps = {
    urlID: '1'
};