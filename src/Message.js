import React from 'react';

class Message extends React.Component {
    render() {
        let clsName = "list-group-item" + (this.props.message.isMy ? " list-group-item-success" : "");
        return (
            <li className={clsName}>{this.props.message.message}</li>
        );
    }
}

export default Message;
