import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = ({ alerts }) => 
    // Braces not required. Function has only one statement
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            { alert.msg } 
        </div>
    ))

Alert.propTypes = {
    alerts: PropTypes.array.isRequired,
}

// Required anytime state needs to be brought in via Redux.
const mapStateToProps = state => ({
    alerts: state.alert
})

export default connect(mapStateToProps)(Alert); 
