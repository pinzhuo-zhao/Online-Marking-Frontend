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
    Form,
    Input,
    Select,
    InputNumber,
    Space,
    Layout,
    Radio, Tooltip
} from 'antd';

import {PlusOutlined} from "@ant-design/icons";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import axios from "axios";
import {
    getProjectURL,
    getSubjectNameURL,
    getTemplateByIdURL,
    deleteProjectURL,
    getTemplateURL,
    createProjectURL,
    connectTemplateToProjectURL, gradeListURL
} from "../../constant";
import {Link, Redirect} from "react-router-dom";

const {Title} = Typography;
const {Option} = Select;
const {Header, Sider, Content, Footer} = Layout;

class Project extends Component {

    state = {
        visible: false,
        rubricVisible: false,
        projects: [],
        rubrics: [],
        subjectName: '',
        subjectCode: '',
        description: '',
        selectedId: ''
    };

    // add project drawer show function
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    // add project drawer close function
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    // add project submit function
    onFinish = (values) => {
        let element = {}
        if (values.rubric === 0) {
            element = {
                projectDescription: values.description,
                duration: values.durationMin * 60 + values.durationSec,
                warningTime: values.warningMin * 60 + values.warningSec,
                isIndividual: values.isIndividual,
                subjectId: this.props.location.state.subject
            }
        } else {
            element = {
                projectDescription: values.description,
                duration: values.durationMin * 60 + values.durationSec,
                warningTime: values.warningMin * 60 + values.warningSec,
                isIndividual: values.isIndividual,
                templateId: values.rubric,
                subjectId: this.props.location.state.subject
            }
        }
        axios.post(createProjectURL, element, {withCredentials: true}).then((response) => {
            if (response.data.success === true) {
                this.getAllProjects()
                this.setState({
                    visible: false
                });
                message.success('Project Added');
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

    showRubricDrawer = (record) => {
        this.setState({
            rubricVisible: true,
            description: record.description,
            selectedId: record.id
        });
    };

    // add project drawer close function
    onRubricClose = () => {
        this.setState({
            rubricVisible: false,
            description: '',
            selectedId: ''
        });
    };

    onRubricFinish = (values) => {
        const finalURL = connectTemplateToProjectURL + this.state.selectedId + '/' + values.rubric
        axios.post(finalURL, {}, {withCredentials: true}).then((response) => {
            if (response.data.success === true) {
                this.getAllProjects()
                this.onRubricClose()
                message.success('Rubric Added to Project');
            } else {
                message.error(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onRubricFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // table used columns
    columns = [
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Individual Project',
            dataIndex: 'individual',
        },
        {
            title: 'Subject Name',
            dataIndex: 'subjectName',
        },
        {
            title: 'Subject Code',
            dataIndex: 'subjectCode',
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
        },
        {
            title: 'Warning',
            dataIndex: 'warning',
        },
        {
            title: 'Rubric',
            dataIndex: 'rubric',
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Space>
                    {this.props.location.state.admin === 1 || this.props.location.state.coordinator === 1 ?
                        <Button onClick={() => {
                            this.showRubricDrawer(record)
                        }}>
                            Rubric
                        </Button>
                        : ''
                    }
                    {
                        record.individual === 'No' ?
                            <Button type="primary" onClick={() => this.startAssessment(record, 'team')}>
                                Start Assessment
                            </Button> :

                            <Button type="primary" onClick={() => this.startAssessment(record, 'student')}>
                                Start Assessment
                            </Button>
                    }
                    <Popconfirm
                        title="Are you sure to email yourself this project's grade list?"
                        onConfirm={() => this.sendGradeList(record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="default">
                            Email
                        </Button>
                    </Popconfirm>
                    {this.props.location.state.admin === 1 || this.props.location.state.coordinator === 1 ?
                        <Popconfirm
                            title="Are you sure to delete this Project?"
                            onConfirm={() => {
                                this.confirm(record)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm> : ''
                    }
                </Space>

        },
    ];

    startAssessment = (record, type) => {
        const {admin, coordinator, headTutor, subject, email} = this.props.location.state
        if (record.rubricId === null) {
            message.warn("Please click Rubric button to select a rubric before start assessment!")
        } else {
            if (type === 'team') {
                this.props.history.push('/team', {admin, coordinator, headTutor, subject, projectId: record.id, email})
            } else {
                this.props.history.push('/student', {admin, coordinator, headTutor, subject, projectId: record.id, email})
            }
        }
    }

    sendGradeList = (record) => {
        const finalURL = gradeListURL + "?emailAccount=" + this.props.location.state.email + "&projectID=" + record.id;
        axios.post(finalURL, {}, {withCredentials: true}).then((response) => {
            if (response.data.success === true) {
                message.success('Grade List sent to your email address!');
            } else {
                message.error(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    // Confirm for Delete function
    confirm = (record) => {
        const url = deleteProjectURL + record.id
        axios.put(url, {}, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.getAllProjects()
                    message.success('Project Deleted');
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }

    // Get projects when component mount
    getAllProjects() {
        const finalURL = getProjectURL + this.props.location.state.subject
        axios.get(finalURL, {withCredentials: true}).then(
            async response => {
                if (response.data.success === true) {
                    let projectsArr = []
                    const finalURL = getSubjectNameURL + this.props.location.state.subject
                    let subjectName
                    let subjectCode
                    await axios.get(finalURL, {withCredentials: true}).then(
                        res => {
                            if (res.data.success === true) {
                                subjectName = res.data.data.allSubjects.subjectName
                                subjectCode = res.data.data.allSubjects.subjectCode
                            } else {
                                message.error(res.data.message);
                            }
                        },
                        error2 => {
                            console.log(error2.error)
                        }
                    )
                    this.setState({
                        subjectName: subjectName,
                        subjectCode: subjectCode
                    });
                    for (let i = 0; i < response.data.data.projectsFromSubject.length; i++) {
                        let rubricName
                        if (response.data.data.projectsFromSubject[i].templateId === null) {
                            rubricName = ''
                        } else {
                            const templateURL = getTemplateByIdURL + response.data.data.projectsFromSubject[i].templateId
                            await axios.get(templateURL, {withCredentials: true}).then(
                                res2 => {
                                    if (res2.data.success === true) {
                                        rubricName = res2.data.data.templates.template.name
                                    } else {
                                        message.error(res2.data.message);
                                    }
                                },
                                error3 => {
                                    console.log(error3.error)
                                }
                            )
                        }
                        const element = {
                            key: response.data.data.projectsFromSubject[i].id,
                            id: response.data.data.projectsFromSubject[i].id,
                            description: response.data.data.projectsFromSubject[i].projectDescription,
                            individual: response.data.data.projectsFromSubject[i].isIndividual === 1 ? 'Yes' : 'No',
                            subjectName: subjectName,
                            subjectCode: subjectCode,
                            durationRaw: response.data.data.projectsFromSubject[i].duration,
                            warningRaw: response.data.data.projectsFromSubject[i].warningTime,
                            duration: response.data.data.projectsFromSubject[i].duration % 60 === 0 ? Math.floor(response.data.data.projectsFromSubject[i].duration / 60) : Math.floor(response.data.data.projectsFromSubject[i].duration / 60) + ':' + response.data.data.projectsFromSubject[i].duration % 60,
                            warning: response.data.data.projectsFromSubject[i].warningTime % 60 === 0 ? Math.floor(response.data.data.projectsFromSubject[i].warningTime / 60) : Math.floor(response.data.data.projectsFromSubject[i].warningTime / 60) + ':' + response.data.data.projectsFromSubject[i].warningTime % 60,
                            rubricId: response.data.data.projectsFromSubject[i].templateId,
                            rubric: rubricName
                        }
                        projectsArr.push(element)
                    }
                    this.setState({
                        projects: projectsArr,
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

    getRubric = () => {
        const finalURL = getTemplateURL + this.props.location.state.subject
        axios.get(finalURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    let rubricArr = []
                    for (let i = 0; i < response.data.data.templates.length; i++) {
                        const element = {
                            id: response.data.data.templates[i].template.id,
                            name: response.data.data.templates[i].template.name,
                            description: response.data.data.templates[i].template.description
                        }
                        rubricArr.push(element)
                    }
                    this.setState({
                        rubrics: rubricArr,
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
            this.getAllProjects()
            this.getRubric()
        }
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
                            {this.props.location.state.admin === 1 || this.props.location.state.coordinator === 1 ?
                                <Row justify="space-around" align="middle">
                                    <Col span={20}>
                                        <Title level={2}>Project</Title>
                                    </Col>
                                    <Col span={4}>
                                        <Button type="primary" shape="round" onClick={this.showDrawer}
                                                icon={<PlusOutlined/>}>
                                            Create a Project
                                        </Button>
                                    </Col>
                                </Row> :
                                <Row justify="space-around" align="middle">
                                    <Col span={24}>
                                        <Title level={2}>Project</Title>
                                    </Col>
                                </Row>
                            }
                            <Drawer
                                title="Create a new project"
                                width={720}
                                onClose={this.onClose}
                                visible={this.state.visible}
                                bodyStyle={{paddingBottom: 80}}
                                destroyOnClose={true}
                            >
                                <Form layout="vertical"
                                      onFinish={this.onFinish}
                                      onFinishFailed={this.onFinishFailed}
                                      initialValues={{
                                          durationMin: 0,
                                          durationSec: 0,
                                          warningMin: 0,
                                          warningSec: 0,
                                          isIndividual: 0,
                                          subjectCode: this.state.subjectCode,
                                          subjectName: this.state.subjectName
                                      }}
                                >
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="description"
                                                label="Project Description "
                                                rules={[{required: true, message: 'Please enter project description'}]}
                                            >
                                                <Input showCount maxLength={256}
                                                       placeholder="Please enter project description"/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="subjectName"
                                                label="Subject Name"
                                                rules={[{required: true, message: 'Please enter subject name'}]}
                                            >
                                                <Input disabled={true}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="subjectCode"
                                                label="Subject Code"
                                                rules={[{required: true, message: 'Please enter subject code'}]}
                                            >
                                                <Input disabled={true}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="isIndividual"
                                                label="Group or Individual Project"
                                                rules={[{
                                                    required: true,
                                                    message: 'Please select is Individual or Group project'
                                                }]}
                                            >
                                                <Radio.Group>
                                                    <Space direction="vertical">
                                                        <Radio value={0}>Group</Radio>
                                                        <Radio value={1}>Individual</Radio>
                                                    </Space>
                                                </Radio.Group>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="durationMin"
                                                label="Enter Assessment Duration Minutes"
                                                rules={[{
                                                    required: true,
                                                    message: 'Please enter Assessment Duration Minutes'
                                                }]}
                                            >
                                                <InputNumber min={0} max={59} precision={0} addonAfter="min"/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="durationSec"
                                                label="Enter Assessment Duration Seconds"
                                                rules={[{
                                                    required: true,
                                                    message: 'Please enter Assessment Duration Seconds'
                                                }]}
                                            >
                                                <InputNumber min={0} max={59} precision={0} addonAfter="sec"/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name="warningMin"
                                                label="Enter Assessment Warning Minutes"
                                                rules={[{
                                                    required: true,
                                                    message: 'Please enter Assessment Warning Minutes'
                                                }]}
                                            >
                                                <InputNumber min={0} max={59} precision={0} addonAfter="min"/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="warningSec"
                                                label="Enter Assessment Warning Seconds"
                                                rules={[{
                                                    required: true,
                                                    message: 'Please enter Assessment Warning Seconds'
                                                }]}
                                            >
                                                <InputNumber min={0} max={59} precision={0} addonAfter="sec"/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="rubric"
                                                label="Rubric"
                                                rules={[{required: true, message: 'Please select a Rubric'}]}
                                            >
                                                <Select placeholder="Please select a Rubric">
                                                    <Option key={0}>If there is no pre-existing rubric desired, please
                                                        create one and connect to this project later</Option>
                                                    {this.state.rubrics.map(rubric => {
                                                        return <Option key={rubric.id}>{rubric.name}</Option>
                                                    })}
                                                </Select>
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
                            <Drawer
                                title="Modify Rubric"
                                width={720}
                                onClose={this.onRubricClose}
                                visible={this.state.rubricVisible}
                                bodyStyle={{paddingBottom: 80}}
                                destroyOnClose={true}
                            >
                                <Form layout="vertical"
                                      onFinish={this.onRubricFinish}
                                      onFinishFailed={this.onRubricFinishFailed}
                                      initialValues={{
                                          description: this.state.description,
                                      }}
                                >
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="description"
                                                label="Project Description "
                                            >
                                                <Input disabled={true}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="rubric"
                                                label="Rubric"
                                                rules={[{required: true, message: 'Please select a Rubric'}]}
                                            >
                                                <Select placeholder="Please select a Rubric">
                                                    <Option key={0}>If there is no pre-existing rubric desired, please
                                                        create one and connect to this project later</Option>
                                                    {this.state.rubrics.map(rubric => {
                                                        return <Option key={rubric.id}>{rubric.name}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={3}>
                                            <Button onClick={this.onRubricClose}>Cancel</Button>
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
                            <Divider/>
                            <Table columns={this.columns} dataSource={this.state.projects}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Project;