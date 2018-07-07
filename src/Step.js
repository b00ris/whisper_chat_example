import React from 'react';

class Step extends React.Component {
    names = {
        "key_generation": "Генерируем ключ",
        "name_reservation": "Резервируем имя",
        "add_user": "Ищем собеседника",
        "chat": "Chat!",
    };

    render() {
        let classname = "list-group-item " + (this.props.activity === this.props.value ? "active" : "");
        return (
            <li className={classname}>{this.names[this.props.value]}</li>
        );
    }
}

export default Step;
