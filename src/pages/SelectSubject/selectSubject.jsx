import React, {Component} from 'react';
import {Button, List, message} from 'antd';
import {getMySubjectsURL} from "../../constant";
import axios from "axios";
import {Redirect} from "react-router-dom";

class SelectSubject extends Component {

    state = {
        subjects: []
    }

    getMySubjects = () => {
        axios.get(getMySubjectsURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.setState({
                        subjects: response.data.data.mySubjects,
                    });
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }

    handleClick = (subject) => {
        const {admin,coordinator,headTutor,email} = this.props.location.state
        this.props.history.push('/home', {admin,coordinator,headTutor,subject,email})
    }

    componentDidMount() {
        if (this.props.location.state !== undefined){
            this.getMySubjects()
        }
    }

    render() {
        if (this.props.location.state === undefined) {
            return <Redirect to="/notFound"/>;
        }
        return (
            <div className="main">
                <div className="sub-main">
                    <List
                        itemLayout="horizontal"
                        header={<div>Select a Subject</div>}
                        dataSource={this.state.subjects}
                        size='large'
                        style={{minWidth:'50vh'}}
                        renderItem={item => (
                            <List.Item actions={[<Button type="primary" onClick={() => this.handleClick(item.id)}>Select</Button>]}>
                                <List.Item.Meta
                                    title={item.subjectCode + ' - ' + item.subjectName}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </div>

        );
    }
}

export default SelectSubject;