import React from 'react';

class AddUser extends React.Component {
    render() {
        return (
            <form onSubmit={this.handleSubmitUser}>
                <div className="form-group">
                    <label htmlFor="userKey">User public key</label>
                    <input className="form-control" id="userKey" aria-describedby="keyHelp"
                           placeholder="Enter public key of other user" value={this.props.secondUser}
                           onChange={v => this.props.handleChange(v)}
                    />
                    <small id="keyHelp" className="form-text text-muted">some help
                    </small>
                </div>
            </form>
        )
    }
}

export default AddUser;
