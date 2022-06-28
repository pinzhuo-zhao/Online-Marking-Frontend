import React, {Component} from "react";
import {Form, Input, Button, message, Image} from 'antd';
import axios from "axios";
import {resetPasswordURL, sendVerificationURL} from "../../constant";
import icon from "./icon.png";

class ResetPassword extends Component{

    state ={
        duration: 30,
        countStart: false,
        isSent: false,
    }

    email = '';

    verificationCode = '';

    setEmail = (input) =>{
        this.email = input;
    }

    setVerificationCode = (input) => {
        this.verificationCode = input;
    }



    sendVerificationCode = () => {

        const finalURL = sendVerificationURL + "?emailAddress=" + this.email;
        console.log(finalURL);
        axios.post(finalURL, {}, {withCredentials: true}).then(res=>{
            if(res.data.success===true){
                message.success("Verification Code is sent! Please do not resend in 30s!")
                this.state.isSent = true;
                if (!this.state.countStart){
                    this.timer = setInterval(() => {
                        this.setState({
                            duration: this.state.duration - 1,
                        }, () => {
                            if (this.state.duration <= 0) {
                                clearInterval(this.timer)
                                this.setState({
                                    isSent: !this.state.isSent,
                                })
                            }
                        })
                    }, 1000);
                } else {
                    clearInterval(this.timer)
                }
                this.setState({
                    countStart: !this.state.countStart,
                })
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    };

    onCancel = () => {
        this.props.history.push('/');
    }

    onFinish = (values) => {
        let element={}
        element = {
            email: values.email,
            password: values.password,
            verificationCode: values.verificationCode
        }
        console.log(element);
        axios.post(resetPasswordURL, element, {withCredentials: true}).then((response) => {
            console.log('success 1');
            console.log(element);
            if (response.data.success === true) {
                console.log('success 2');
                this.props.history.push('/');
                message.success("Password reset successful!");
            } else {
                message.error(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        return(
            <div className="main">
                <div className="sub-main">
                    <Form
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item>
                            <Image src={icon} preview={false}></Image>
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input
                                type="text"
                                required
                                value={this.email}
                                onChange={(e) => this.setEmail(e.target.value)}
                                />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your new password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Verification Code"
                            name="verificationCode"
                            rules={[{ required: true, message: 'Please input your verification code!' }]}
                        >
                                <Input
                                type="text"
                                required
                                value={this.verificationCode}
                                onChange={(e) => this.setVerificationCode(e.target.value)}/>

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.sendVerificationCode}
                            loading={this.state.isSent}>Send Code</Button>
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button onClick={this.onCancel}>Cancel</Button>
                            <Button type="primary" htmlType="submit">
                                Confirm
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

        );

    }
}

export default ResetPassword;