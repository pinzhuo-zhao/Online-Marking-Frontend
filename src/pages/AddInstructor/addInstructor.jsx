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
    Menu,
    Dropdown,
    Modal,
    Drawer,
    Form, Input, Layout, Upload, Radio, Space
} from 'antd';

import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {getInstructorURL, addInstructorURL, addTutorByCsvURL, getSubjectNameURL, deleteTutorByIdURL} from "../../constant";
import axios from "axios";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import {Redirect} from "react-router-dom";

const {Title} = Typography;
const {Header, Sider, Content, Footer} = Layout;

class AddInstructor extends Component {

    state = {
        modalVisible: false,
        drawerVisible: false,
        instructors: [],
        uploadFile: null,
        subjectName:'',
        subjectCode:''
    }

    getAllInstructor = () => {
        const finalGetInstructorURL = getInstructorURL+this.props.location.state.subject
        axios.get(finalGetInstructorURL, {withCredentials: true}).then(
            async response => {
                if (response.data.success === true) {
                    let instructorArr = []
                    const finalURL = getSubjectNameURL + this.props.location.state.subject
                    await axios.get(finalURL, {withCredentials: true}).then(
                        res => {
                            if (res.data.success === true) {
                                this.setState({
                                    subjectName: res.data.data.allSubjects.subjectName,
                                    subjectCode: res.data.data.allSubjects.subjectCode
                                });
                            } else {
                                message.error(res.data.message);
                            }
                        },
                        error2 => {
                            console.log(error2.error)
                        }
                    )
                    for (let i = 0; i < response.data.data.tutors.length; i++) {

                        const element = {
                            key: response.data.data.tutors[i].id,
                            subjectName: this.state.subjectName,
                            subjectCode: this.state.subjectCode,
                            headTutor: response.data.data.tutors[i].isHeadTutor === 1 ? 'Yes' : 'No',
                            firstName: response.data.data.tutors[i].firstName,
                            middleName: response.data.data.tutors[i].middleName,
                            lastName: response.data.data.tutors[i].lastName,
                            email: response.data.data.tutors[i].email
                        }
                        instructorArr.push(element)
                    }
                    this.setState({
                        instructors: instructorArr,
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
            this.getAllInstructor()
        }
    }

    validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
        }
    };

    columns = [
        {
            title: 'Subject Name',
            dataIndex: 'subjectName',
        },
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
        },
        {
            title: 'Head Tutor',
            dataIndex: 'headTutor',
        },
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
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Popconfirm
                    title="Are you sure to delete this Tutor?"
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
        const finalURL = deleteTutorByIdURL+record.key
        axios.put(finalURL, {}, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.getAllInstructor()
                    message.success('Tutor Deleted');
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    handleOk = () => {
        const {uploadFile} = this.state
        if (uploadFile !== null) {
            let data = new FormData()
            data.append("file", uploadFile)
            const finalURL = addTutorByCsvURL+this.props.location.state.subject
            axios.post(finalURL, data, {withCredentials: true}).then((response) => {
                if (response.data.success === true) {
                    this.getAllInstructor()
                    this.setState({
                        modalVisible: false,
                        uploadFile: null,
                    });
                    message.success('All Tutors Added');
                } else {
                    message.error(response.data.message);
                }
            }).catch(error => {
                console.log(error);
            })
        } else {
            message.error('Please select a CSV file');
        }
    };

    handleCancel = () => {
        this.setState({
            modalVisible: false,
            uploadFile: null,
        });
    };

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
        let mName = ''
        if (typeof values.middleName != "undefined") {
            mName = values.middleName
        }
        const element = {
            firstName: values.firstName,
            middleName: mName,
            lastName: values.lastName,
            email: values.email,
            isHeadTutor: values.isHeadTutor
        }
        const finalURL = addInstructorURL+this.props.location.state.subject
        axios.post(finalURL, element, {withCredentials: true}).then((res) => {
            if (res.data.success === true) {
                this.getAllInstructor()
                this.setState({
                    drawerVisible: false
                });
                message.success('Tutor Added');
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

    menu = (
        <Menu>
            <Menu.Item key="0" onClick={this.showDrawer}>
                Add One Tutor
            </Menu.Item>
            {/*<Menu.Item key="1">*/}
            {/*    <a*/}
            {/*        href={process.env.PUBLIC_URL + "/InstructorTemplate.csv"}*/}
            {/*        download={"InstructorTemplate.csv"}*/}
            {/*    >*/}
            {/*        Download CSV Template*/}
            {/*    </a>*/}
            {/*</Menu.Item>*/}
            <Menu.Item key="2" onClick={this.showModal}>
                Add More Tutors by CSV
            </Menu.Item>
        </Menu>
    );

    render() {
        if (this.props.location.state === undefined) {
            return <Redirect to="/notFound"/>;
        }
        const {coordinator, admin, headTutor, subject, email} = this.props.location.state
        const {uploadFile} = this.state
        const uploadState = {
            name: 'file',
            accept: 'text/csv',
            multiple: false,
            maxCount: 1,
            beforeUpload: file => {
                this.setState({
                    uploadFile: file,
                });
                return false;
            },
            onRemove: () => {
                this.setState({
                    uploadFile: null,
                });
            },
            fileList: uploadFile === null ? [] : [uploadFile]
        };
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
                                    <Title level={2}>Tutor</Title>
                                </Col>
                                <Col span={4}>
                                    <Dropdown overlay={this.menu} trigger={['click']}>
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <Button type="primary" shape="round" icon={<PlusOutlined/>}>
                                                Add Tutors
                                            </Button>
                                        </a>
                                    </Dropdown>
                                </Col>
                            </Row>
                            <Divider/>
                            <Table columns={this.columns} dataSource={this.state.instructors}/>
                            <Modal title="Upload CSV File to Batch Add" visible={this.state.modalVisible}
                                   onOk={this.handleOk}
                                   onCancel={this.handleCancel}>
                                <Upload {...uploadState}>
                                    <Button icon={<UploadOutlined/>}>Select a CSV File</Button>
                                </Upload>
                            </Modal>
                            <Drawer
                                title="Create a new Tutor"
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
                                      initialValues={{
                                          isHeadTutor: 0
                                      }}
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
                                                <Input showCount maxLength={256} placeholder="Please enter middle name"/>
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
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="isHeadTutor"
                                                label="Is Head Tutor"
                                                rules={[{required:true, message: 'Please select is Head Tutor or not' }]}
                                            >
                                                <Radio.Group>
                                                    <Space direction="vertical">
                                                        <Radio value={0}>No</Radio>
                                                        <Radio value={1}>Yes</Radio>
                                                    </Space>
                                                </Radio.Group>
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
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default AddInstructor;