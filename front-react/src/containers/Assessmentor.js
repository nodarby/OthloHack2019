import { connect } from 'react-redux';
import Assessmentor from '../components/Assessmentor';
import * as actions from '..actions/Assessmentor';

const mapStateToProps = {state, ownProps} => ({
    urlId: ownProps.urlId
});

const mapDispatchToProps = dispatch => ({
    onMount (urlId) {
        dispatch(actions.fetchAssessmengtor(urlId));
    },
    onUpdate (urlId) {
        dispatch(actions.fetchAssessmengtor(urlId));
    }
});

export default connect(mapStateToProps, mapStateToProps)(Assessmentor);