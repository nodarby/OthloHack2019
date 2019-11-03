import fetchJsonp from 'fetch-jsonp';
import qs from 'qs';

const API_URL = '';
const API_ID = '';

const startReqest = categoryId => ({
    type: 'START_REQUEST',
    payload: { urlId },
});

const receiveData = (urlId, error, response) => ({
    type: 'RECEIVE_DATA',
    payload: { urlId, error, response },
});

const finishRequest = urlId => ({
    type: 'FINISH_REQUEST',
    payload:{ urlId },
});

export const fetchAssessmentor = urlId => {
    return async dispatch => {
        dispatch(startReqest(categoryId));
    }

    const queryString = qs.stringify({
        appid: APP_ID,
        url_id: urlId,
    });

    try {
        const response = await fetchJsonp('${API_URL}?${queryStrimg}');
        const data = await response.json();
        dispatch(receiveData(categoryId, null, data));
    } catch (err) {
        dispatch(finishRequest(categoryId));
    };
};
