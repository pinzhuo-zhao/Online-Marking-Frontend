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
    Layout,
    Form,
    Input,
    Drawer,
    Select, Dropdown, Menu
} from 'antd';

import {PlusOutlined} from "@ant-design/icons";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import {Redirect} from "react-router-dom";

import {
    getAllCoordinatorsURL,
    getSubjectNameURL,
    getSubjectURL,
    findUserByEmailURL,
    addCoordinatorURL,
    addCoordinatorAndSubjectURL
} from "../../constant";
import axios from "axios";
import Modal from "antd/es/modal/Modal";

const {Title} = Typography;
const {Option} = Select;
const {Header, Sider, Content, Footer} = Layout;

class AddCoordinator extends Component {

    state = {
        coordinators: [],
        drawerAddVisible: false,
        addSubject: false,
        subjects: [],
        modalAddVisible: false,
        values: []
    }

    columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
        },
        {
            title: 'Middle Name',
            dataIndex: 'middleName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Popconfirm
                    title="Are you sure to delete this Coordinator?"
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

    confirm = (record) => {
        message.success(record.key);
    }

    showAddDrawer = (addSubject) => {
        this.setState({
            drawerAddVisible: true,
            addSubject: addSubject
        });
    };

    onAddClose = () => {
        this.setState({
            drawerAddVisible: false,
        });
    };

    onAddFinish = (values) => {
        const emailAddress = values.email
        axios.get(findUserByEmailURL, {params: {emailAddress}, withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.setState({
                        values: values,
                    });
                    this.showAddModal()
                } else if (response.data.success === false && response.data.message === 'This email does not exist in the system yet') {
                    this.addCoordinator(values)
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                message.error('Some error happens, it may because of network problem');
            }
        )
    }

    onAddFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    addCoordinator = (values) => {
        let finalURL
        let element
        if (this.state.addSubject === true) {
            finalURL = addCoordinatorAndSubjectURL
            element = {
                user: {
                    firstName: values.firstName,
                    middleName: values.middleName === undefined ? '':values.middleName,
                    lastName: values.lastName,
                    email: values.email,
                },
                subject:{
                    subjectCode: values.subjectCode,
                    subjectName: values.subjectName
                }
            }
        } else {
            finalURL = addCoordinatorURL+values.subject
            element = {
                firstName: values.firstName,
                middleName: values.middleName === undefined ? '':values.middleName,
                lastName: values.lastName,
                email: values.email
            }
        }
        axios.post(finalURL, element, {withCredentials: true}).then((res) => {
            if (res.data.success === true) {
                this.getAllCoordinators()
                this.onAddClose()
                if (this.state.addSubject === true) {
                    message.success('Coordinator and Subject Added');
                } else {
                    message.success('Coordinator Added');
                }
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            message.error('Some error happens, it may because of network problem');
        })
    }

    showAddModal = () => {
        this.setState({
            modalAddVisible: true,
        });
    };

    handleAddOk = () => {
        this.addCoordinator(this.state.values)
        this.setState({
            modalAddVisible: false,
            drawerAddVisible: false,
        });
    };

    handleAddCancel = () => {
        this.setState({
            modalAddVisible: false
        });
    };

    getAllCoordinators = () => {
        axios.get(getAllCoordinatorsURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    let coordinatorArr = []
                    const responseData = response.data.data.coordinators
                    for (let i = 0; i < responseData.length; i++) {
                        let subject = responseData[i].subjects.map(item => {
                            return item.subjectCode + ' ' + item.subjectName;
                        }).join(', ');
                        const element = {
                            key: responseData[i].id,
                            firstName: responseData[i].firstName,
                            middleName: responseData[i].middleName,
                            lastName: responseData[i].lastName,
                            subject: subject,
                            email: responseData[i].email
                        }
                        coordinatorArr.push(element)
                    }
                    this.setState({
                        coordinators: coordinatorArr,
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

    getAllSubjects = () => {
        axios.get(getSubjectURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    let subjectArr = []
                    for (let i = 0; i < response.data.data.allSubjects.length; i++) {
                        const element = {
                            id: response.data.data.allSubjects[i].id,
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
            this.getAllCoordinators()
            this.getAllSubjects()
        }
    }

    menu = (
        <Menu>
            <Menu.Item key="0" onClick={() => this.showAddDrawer(false)}>
                Add Coordinator
            </Menu.Item>
            <Menu.Item key="1" onClick={() => this.showAddDrawer(true)}>
                Add Coordinator and Subject
            </Menu.Item>
        </Menu>
    );

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
                                    <Title level={2}>Coordinator</Title>
                                </Col>
                                <Col span={4}>
                                    <Dropdown overlay={this.menu} trigger={['click']}>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <Button type="primary" shape="round" icon={<PlusOutlined/>}>
                                                Add a Coordinator
                                            </Button>
                                        </a>
                                    </Dropdown>
                                </Col>
                            </Row>
                            <Divider/>
                            <Modal title="Email Exist" visible={this.state.modalAddVisible} onOk={this.handleAddOk} onCancel={this.handleAddCancel}>
                                <p>There is an user use this email, do you want to add this subject to that user?</p>
                            </Modal>
                            <Drawer
                                title="Create a new Coordinator"
                                width={720}
                                onClose={this.onAddClose}
                                visible={this.state.drawerAddVisible}
                                bodyStyle={{paddingBottom: 80}}
                                destroyOnClose={true}
                            >
                                <Form layout="vertical"
                                      onFinish={this.onAddFinish}
                                      onFinishFailed={this.onAddFinishFailed}
                                      validateMessages={this.validateMessages}
                                >
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                name="firstName"
                                                label="First Name"
                                                rules={[{required: true, message: 'Please enter first name'}]}
                                            >
                                                <Input showCount maxLength={256} placeholder="Please enter first name"/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="middleName"
                                                label="Middle Name"
                                                rules={[{message: 'Please enter middle name'}]}
                                            >
                                                <Input showCount maxLength={256}
                                                       placeholder="Please enter middle name"/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item
                                                name="lastName"
                                                label="Last Name"
                                                rules={[{required: true, message: 'Please enter last name'}]}
                                            >
                                                <Input showCount maxLength={256} placeholder="Please enter last name"/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="email"
                                                label="Email Address"
                                                rules={[{required: true, message: 'Please enter email', type: 'email'}]}
                                            >
                                                <Input showCount maxLength={256} placeholder="Please enter email"/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {this.state.addSubject === false ?
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Form.Item
                                                    name="subject"
                                                    label="Subject"
                                                    rules={[{required: true, message: 'Please select a subject'}]}
                                                >
                                                    <Select placeholder="Please select a Subject">
                                                        {this.state.subjects.map(subject => {
                                                            return <Option
                                                                key={subject.id}>{subject.subjectCode + '-' + subject.subjectName}</Option>
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row> :
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="subjectCode"
                                                    label="Subject Code"
                                                    rules={[{required: true, message: 'Please enter subject code'}]}
                                                >
                                                    <Input placeholder="Please enter subject code"/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="subjectName"
                                                    label="Subject Name"
                                                    rules={[{required: true, message: 'Please enter subject name'}]}
                                                >
                                                    <Input placeholder="Please enter subject name"/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    }

                                    <Row gutter={16}>
                                        <Col span={3}>
                                            <Button onClick={this.onAddClose}>Cancel</Button>
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
                            <Table columns={this.columns} dataSource={this.state.coordinators}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );

    }
}

export default AddCoordinator;