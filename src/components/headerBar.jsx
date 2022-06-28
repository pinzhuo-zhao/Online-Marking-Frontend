import React, {Component} from 'react';
import {Button, Col, message, Popconfirm, Row} from "antd";
import {LogoutOutlined} from "@ant-design/icons";
import axios from "axios";
import {logoutURL} from "../constant";
import {withRouter} from "react-router-dom";

class HeaderBar extends Component {

    logoutConfirm = () => {
        axios.post(logoutURL, {}, {withCredentials: true}).then((res) => {
            if (res.data.success === true) {
                this.props.history.push('/')
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            message.error('Some error happens, you may need to login again!');
            this.props.history.push('/')
        })
    }

    selectSubjectConfirm = () => {
        const {admin,coordinator,headTutor, email} = this.props.location.state
        this.props.history.push('/selectSubject', {admin,coordinator,headTutor,email})
    }

    render() {
        const {admin} = this.props.location.state
        return (
            <div>
                {admin !== 1 ?
                    <Row>
                        <Col span={4} offset={1}>
                            <Popconfirm title="Confirm to go back to select another subject？" okText="Yes" cancelText="No"
                                        onConfirm={() => {
                                            this.selectSubjectConfirm()
                                        }}>
                                <Button type="primary" shape="round" >
                                    Back to Subject Selection
                                </Button>
                            </Popconfirm>
                        </Col>
                        <Col span={2} offset={16}>
                            <Popconfirm title="Confirm to logout？" okText="Yes" cancelText="No"
                                        onConfirm={() => {
                                            this.logoutConfirm()
                                        }}>
                                <Button type="primary" shape="round" danger icon={<LogoutOutlined/>}>
                                    Logout
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>:
                    <Row>
                        <Col span={2} offset={21}>
                            <Popconfirm title="Are you sure to logout？" okText="Yes" cancelText="No"
                                        onConfirm={() => {
                                            this.logoutConfirm()
                                        }}>
                                <Button type="primary" shape="round" danger icon={<LogoutOutlined/>}>
                                    Logout
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                }
            </div>
        );
    }
}

export default withRouter(HeaderBar);