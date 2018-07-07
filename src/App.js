import React from 'react';
import Step from "./Step";
import AddUser from "./AddUser";
import SendMessageForm from "./SendMessageForm";
import MessagesList from "./MessagesList";


var Web3 = require('web3');

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            web3: new Web3(new Web3.providers.HttpProvider("http://localhost:8545")),
            step: "key_generation",
            keyID: null,
            publicKey: null,
            secondUser: "",
            messageFilterID: null,
            messages: [],

        };
    }

    keepKey(keyID, publicKey) {
        const st = this.state;
        st.keyID = keyID;
        st.publicKey = publicKey;
        st.step = "add_user";
        this.setState(st);
    }

    keepMessageFilterID(messageFilterID) {
        const st = this.state;
        st.messageFilterID = messageFilterID;
        this.setState(st);
    }


    newKey() {
        this.state.web3.shh.newKeyPair().then(keyID => {
                this.getPublicKey(keyID);
                this.newMessageFilter(keyID);
            }
        )
    }

    newMessageFilter(keyID) {
        this.state.web3.shh.newMessageFilter({"privateKeyID": keyID}).then(
            keepMessageFilterID => {
                this.keepMessageFilterID(keepMessageFilterID)
            }
        );
        const st = this.state;
        st.interval = setInterval(() => this.getMessages(), 1000);
        this.setState(st);
    }

    getPublicKey(keyID) {
        this.state.web3.shh.getPublicKey(keyID).then(publicKey => {
                this.keepKey(keyID, publicKey)
            }
        )
    }

    getMessages() {
        if (this.state.messageFilterID == null) {
            return
        }
        if (this.state.step !== "chat") {
            return
        }
        this.state.web3.shh.getFilterMessages(this.state.messageFilterID).then(messages => this.pushMessageToList(messages, false))
    }

    pushMessageToList(messages, isLocal) {
        const st = this.state;
        for (let i = 0; i < messages.length; i++) {
            st.messages.push({"message": st.web3.utils.hexToUtf8(messages[i].payload), "isMy": isLocal})
        }
        this.setState(st);
    }

    sendMessage(message) {
        const msgStruct = {
            pubKey: this.state.secondUser,
            ttl: 30,
            powTarget: 2.01,
            powTime: 2,
            payload: Web3.utils.utf8ToHex(message),
        };
        this.state.web3.shh.post(msgStruct).then(console.log);
        this.pushMessageToList([msgStruct], true)
    }

    renderStep(name) {
        return <Step value={name} activity={this.state.step}/>
    }

    renderKeyID() {
        if (this.state.keyID != null) {
            return (<p className="alert alert-primary" role="alert">
                KeyID on whisper server: {this.state.keyID.substr(0, 33) + "..."}
            </p>)
        }
    }

    renderPublicKey() {
        if (this.state.publicKey != null) {
            return (
                <div className="alert alert-success" role="alert">
                    <h4 className="alert-heading">Well done!</h4>
                    <p>Your public key and user id is:</p>
                    <small className="form-text text-muted">{this.state.publicKey}</small>
                </div>)
        }
    }

    renderGenerateKeyButton() {
        if (this.state.step === "key_generation") {
            return (
                <button type="button" className="btn btn-primary btn-lg btn-block" onClick={() => this.newKey()}>
                    Generate key for start
                </button>
            )
        }
    }


    renderAddUserStepForm() {
        if (this.state.step === "add_user") {
            return (<AddUser handleChange={v => this.handleChangeUser(v)} value={this.state.secondUser}/>)
        }
    }

    renderChattingForm() {
        if (this.state.step === "chat") {
            return (<SendMessageForm newMessage={this.sendMessage.bind(this)}/>)
        }
    }

    renderMessagesList() {
        if (this.state.step === "chat") {
            return (<MessagesList messages={this.state.messages}/>)
        }
    }

    handleChangeUser(event) {
        const st = this.state;
        st.secondUser = event.target.value;
        st.step = "chat";
        this.setState(st);
    }


    render() {
        return (
            <div className="App">
                <div className="row">
                    <div className="col-12">
                        {this.renderPublicKey()}
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        {this.renderGenerateKeyButton()}
                        {this.renderAddUserStepForm()}
                        {this.renderMessagesList()}
                        {this.renderChattingForm()}
                    </div>
                    <div className="col-4">
                        {this.renderKeyID()}

                        <ul className="list-group">
                            {this.renderStep("key_generation")}
                            {this.renderStep("name_reservation")}
                            {this.renderStep("add_user")}
                            {this.renderStep("chat")}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
