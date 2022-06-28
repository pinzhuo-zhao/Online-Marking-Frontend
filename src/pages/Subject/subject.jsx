import React, {Component} from 'react';
import {
    Table,
    Button,
    Popconfirm,
    message,
    Typography,
    Divider,
    Col,
    Row,
    Drawer,
    Form, Input, Layout
} from 'antd';

import {PlusOutlined} from "@ant-design/icons";
import axios from "axios";
import {addSubjectURL, deleteSubjectURL, getSubjectURL} from "../../constant";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import {Redirect} from "react-router-dom";

const {Title} = Typography;
const {Header, Sider, Content, Footer} = Layout;

class Subject extends Component {

    state = {
        drawerVisible: false,
        subjects: []
    }

    getAllSubjects = () => {
        axios.get(getSubjectURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    let subjectArr = []
                    for (let i = 0; i < response.data.data.allSubjects.length; i++) {
                        const element = {
                            key: response.data.data.allSubjects[i].id,
                            subjectCode: response.data.data.allSubjects[i].subjectCode,
                            subjectName: response.data.data.allSubjects[i].subjectName,
                        }
                        subjectArr.push(element)
                    }
                    this.setState({
                        subjects: subjectArr,
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

    componentDidMount() {
        if (this.props.location.state !== undefined) {
            this.getAllSubjects()
        }
    }

    columns = [
        {title: 'Subject Code', dataIndex: 'subjectCode',},
        {title: 'Subject Name', dataIndex: 'subjectName',},
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Popconfirm
                    title="Are you sure to delete this Subject?"
                    onConfirm={() => {
                        this.confirm(record)
                    }}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
        },
    ];

    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };

    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    onFinish = (values) => {
        const element = {
            subjectCode: values.subjectCode,
            subjectName: values.subjectName,
        }
        axios.post(addSubjectURL, element, {withCredentials: true}).then((res) => {
            if (res.data.success === true) {
                this.getAllSubjects()
                this.setState({
                    drawerVisible: false
                });
                message.success('Subject Added');
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    confirm = (record) => {
        const url = deleteSubjectURL + record.key
        axios.put(url, {}, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.getAllSubjects()
                    message.success('Subject Deleted');
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }


    render() {
        if (this.props.location.state === undefined) {
            return <Redirect to="/notFound"/>;
        }
        const {coordinator, admin, headTutor, subject, email} = this.props.location.state
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider width={230}>
                    <SideBar coordinator={coordinator} admin={admin} headTutor={headTutor} subject={subject} email={email}/>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{padding: 0}}>
                        <HeaderBar coordinator={coordinator} admin={admin} headTutor={headTutor}/>
                    </Header>
                    <Content style={{margin: '16px 16px'}}>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            <Row justify="space-around" align="middle">
                                <Col span={20}>
                                    <Title level={2}>Subjects</Title>
                                </Col>
                                <Col span={4}>
                                    <Button type="primary" shape="round" icon={<PlusOutlined/>}
                                            onClick={this.showDrawer}>
                                        Add a Subject
                                    </Button>
                                </Col>
                            </Row>
                            <Divider/>
                            <Drawer
                                title="Create a new subject"
                                width={720}
                                onClose={this.onClose}
                                visible={this.state.drawerVisible}
                                bodyStyle={{paddingBottom: 80}}
                                destroyOnClose={true}
                            >
                                <Form layout="vertical"
                                      onFinish={this.onFinish}
                                      onFinishFailed={this.onFinishFailed}
                                      validateMessages={this.validateMessages}
                                >
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="subjectCode"
                                                label="Subject Code"
                                                rules={[{required: true, message: 'Please enter subject code'}]}
                                            >
                                                <Input placeholder="Please enter subject code"/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="subjectName"
                                                label="Subject Name"
                                                rules={[{required: true, message: 'Please enter subject name'}]}
                                            >
                                                <Input placeholder="Please enter subject name"/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={3}>
                                            <Button onClick={this.onClose}>Cancel</Button>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 16,
                                                }}
                                            >
                                                <Button type="primary" htmlType="submit">
                                                    Submit
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Drawer>
                            <Table columns={this.columns} dataSource={this.state.subjects}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Subject;