import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { login, signup, clearErrors } from '../../actions/session_actions';

import Header from '../header';
import Footer from '../footer';
import ErrorMsgs from '../error_msgs';

class SessionForm extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      f_name: '',
      l_name: '',
      email: '',
      password: '',
      username: 'username'
    };

    this.redirectIfLoggedIn = this.redirectIfLoggedIn.bind(this);
  }

  componentWillMount() {
    this.props.clearErrors();
  }

  handleSubmit(asGuest){
    let logUserIn = asGuest ? this.loginAsGuest() : this.loginAsTrueUser();
    return e => {
      e.preventDefault();
      logUserIn(e);
      this.setState({
        f_name: '',
        l_name: '',
        email: '',
        password: '',
        username: 'username'
      });
    };
  }

  loginAsGuest(){
    return e => {
  		this.props.processFormAsGuest(
        {user: {
          email: 'guest_user@email.com',
          password: 'user_password'}
        })
        .then( () => {
          this.props.clearErrors();
          this.redirectIfLoggedIn();
        });
    };
  }

  loginAsTrueUser() {
    return e => {
  		this.props.processFormAsTrueUser({ user: this.state })
        .then( () => {
          this.props.clearErrors();
          this.redirectIfLoggedIn();
        });
    };
	}

  redirectIfLoggedIn(){
    if(this.props.loggedIn && this.props.prevBiz.id){
      this.props.router.push(`/business/${this.props.prevBiz.id}`);
    } else if (this.props.loggedIn) {
      this.props.router.push("/");
    }
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  render() {
    let asGuest = true;
    let asUser = false;
    return (
      <div>
        <Header
          className='main-header'
          isSessionFormOpen={ true }
          shouldDisplayLogo={ true }
          loggedIn={this.props.loggedIn} />

        <div className="main-content">
          <div className="new-session-box">

            <h3 className="session-box-title">{this.props.formType}</h3>

            <ErrorMsgs id='session-errors' errors={this.props.errors} />

    				<form id='session-form' onSubmit={ this.handleSubmit(asUser) }>
    					<input type={`${this.props.formType === 'login' ? 'hidden': 'text'}`}
    						value={this.state.f_name}
    						onChange={this.update("f_name")}
                placeholder='First Name'
                autoComplete="off" />

              <input type={`${this.props.formType === 'login' ? 'hidden': 'text'}`}
    						value={this.state.l_name}
    						onChange={this.update("l_name")}
                placeholder='Last Name'
                autoComplete="off" />

              <br/>

    					<input type="text"
    						value={this.state.email}
    						onChange={this.update("email")}
                autoComplete="off"
                placeholder='Email' />

    					<br/>

    					<input type="password"
    						value={this.state.password}
    						onChange={this.update("password")}
                autoComplete="off"
                placeholder='Password (min. 6 characters)' />

    					<br/>

    					<input
                className="submit-btn session-form-btn"
                type="submit"
                value={this.props.formType} />
    				</form>

            <div id='session-form-btns'>
              <div>
                <form onSubmit={ this.handleSubmit(asGuest) }>
                  <input
                    className="submit-btn session-form-btn"
                    id="demo-btn"
                    type="submit"
                    value="Continue in demo mode" />
                </form>
              </div>

              <div id="session-form-switch">
                <Link
                  to={this.props.formType === 'login'?'signup':'login'}
                  onClick={()=> this.props.clearErrors()}>

                  {this.props.formType === 'login'
                    ? 'New user? '
                    : 'Already have an account? ' }

                  <span>{this.props.formType === 'login'
                    ? 'Create an account.  '
                    : 'Log in  ' }</span>

                </Link>
              </div>

              <div id='back-to-main' onClick={()=> this.props.router.push("/")}>
                <span>Back to main  </span>
                <i className="fa fa-angle-right" aria-hidden="true"></i>
              </div>
            </div>

    			</div>
  			</div>

        <Footer id="session-form-footer"/>

      </div>
		);
  }

}

const mapStateToProps = (state) => {
  return {
    loggedIn: Boolean(state.session.currentUser),
    errors: state.session.errors,
    prevBiz: state.businesses.featured
  };
};

const mapDispatchToProps = (dispatch, state) => {
  const pathname = state.location.pathname;
  const formType = (pathname.substring(0,1) === '/') ? pathname.slice(1) : pathname ;
  const processFormAsTrueUser = (formType === 'login') ? login : signup;

  return {
    clearErrors: () => dispatch(clearErrors()),
    processFormAsGuest: user => dispatch(login(user)),
    processFormAsTrueUser: user => dispatch(processFormAsTrueUser(user)),
    formType: formType
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionForm);
