import React from 'react';
import Message from "./Message";

class MessagesList extends React.Component {
    render() {
        const listItems = this.props.messages.map((message, id) =>
            <Message message={message} key={id}/>
        );

        return (
            <ul className="list-group">
                {listItems}
            </ul>
        );
    }
}

export default MessagesList;
