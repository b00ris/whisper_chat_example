import React from 'react';

class SendMessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
        }
    }

    handleChange(e) {
        this.setState({value: e.target.value});
    }

    handleClick(e) {
        this.props.newMessage(e)
        this.setState({value: ""});
    }

    render() {
        return (
            <form>
                <label>
                    Сообщение:
                    <input type="text" name="message" value={this.state.value} onChange={(v) => this.handleChange(v)}/>
                </label>
                <button type="button" className="btn btn-primary" data-toggle="button" aria-pressed="false"
                        onClick={() => this.handleClick(this.state.value)}>
                    Single toggle
                </button>
            </form>
        );
    }
}

export default SendMessageForm;


