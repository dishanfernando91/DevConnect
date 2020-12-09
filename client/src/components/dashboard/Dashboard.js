import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import DashboardActions from './DashboardActions'
import Spinner from '../layout/Spinner'
import profile from '../../reducers/profile'
import Experience from './Experience'
import Education from './Education'
import { connect } from 'react-redux'
import { getCurrentProfile, deleteAccount } from '../../actions/profile'
import { Link } from 'react-router-dom'


const Dashboard = ({ getCurrentProfile, deleteAccount, auth: { user }, profile: { profile, loading } }) => {
    useEffect(() => {
        getCurrentProfile()
    }, [])
    return loading && profile === null ? <Spinner /> : <Fragment>
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <i className="fas fa-user"> Welcome { user && user.name }</i>
        </p>
        {profile !== null ? (
        <Fragment>
            <DashboardActions />
            {profile.experience.length === 0 ? <></>: (<Experience experience={profile.experience} />)}
            {profile.education.length === 0 ? <></>: (<Education education={profile.education} />)}

            <div className="my-2">
                <button className="btn btn-danger" onClick={() => deleteAccount()}>
                    <i className="fas fa-user-minus"></i> Delete My Account
                </button>
            </div>
        </Fragment>
        ) : (
        <Fragment>
            <p>You have not set up a profile, please add some info.</p>
            <Link to='/create-profile' className='btn btn-primary my-1'>Create Profile</Link>
        </Fragment>
        )}
    </Fragment>
    
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile,
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)

