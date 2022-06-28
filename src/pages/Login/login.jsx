import React, {Component} from "react";
import {Form, Input, Button, message, Image} from 'antd';
import axios from "axios";
import {loginURL} from "../../constant";
import icon from "./icon.png";

class Login extends Component{

    onResetPasswordClick = () => {
        this.props.history.push('/resetPassword');
    };

    onFinish = (values) => {

        const finalURL = loginURL + "?username=" + values.username + "&password=" + values.password;

        axios.post(finalURL, {}, {withCredentials:true}).then(res=>{
            if (res.data.success === true){
                const admin = res.data.data.user.isAdmin
                const coordinator = res.data.data.user.isSubjectCoordinator
                const headTutor = res.data.data.user.isHeadTutor
                const email = res.data.data.user.email
                if (admin ===1 ) {
                    this.props.history.push('/home', {admin,coordinator,headTutor,email})
                } else {
                    this.props.history.push('/selectSubject', {admin,coordinator,headTutor,email})
                }
            }
            else {
                message.error(res.data.message);
        }
        },
            error => {
                console.log(error.error)
            }
        )
    };

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
                            <Image src={icon} preview={false}>

                            </Image>
                        </Form.Item>
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="link" onClick={() => {
                                this.onResetPasswordClick()
                            }}>
                                Reset Password
                            </Button>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>

        );

    }
}

export default Login;