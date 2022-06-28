import React, {Component} from 'react';
import axios from "axios";
import {
    Table,
    Button,
    Popconfirm,
    message,
    Typography,
    Divider,
    Col,
    Row,
    Dropdown,
    Menu,
    Modal,
    Form,
    Drawer, Input, InputNumber, Upload, Layout, Select, Space, Tooltip
} from 'antd';

import {CaretRightOutlined, PauseOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {Redirect} from 'react-router-dom'
import {
    getCandidateURL,
    deleteCandidateURL,
    addCandidateURL,
    addByCsvURL,
    getAvailableCandidatesForProjectURL,
    getIndividualCandidatesInProjectURL,
    addCandidateToProjectURL,
    removeCandidateFromProjectURL,
    showTemplateOfProjectURL,
    checkCandidateURL,
    studentSaveURL,
    studentGeneralSaveURL,
    getCandidateFeedbackURL, sendCandidatePDFMailURL
} from "../../constant";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import TextArea from "antd/es/input/TextArea";

const {Title} = Typography;
const {Option} = Select;
const {Header, Sider, Content, Footer} = Layout;

class Student extends Component {

    state = {
        modalVisible: false,
        drawerVisible: false,
        moveStudentDrawerVisible:false,
        markModalVisible: false,
        candidates: [],
        availableCandidates: [],
        uploadFile: null,
        duration: 0,
        warning: 0,
        countStart: false,
        templateDuration:0,
        selectedStudent: 0,
        currentProject: [],
        rubrics: [],
        emailCandidate: 0,
        emailModalVisible: false,
        emailAddress: ''
    }

    studentFormRef = React.createRef()

    validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
        }
    };

    columns = [
        {title: 'ID', dataIndex: 'id',},
        {title: 'First Name', dataIndex: 'fName',},
        {title: 'Middle Name', dataIndex: 'mName',},
        {title: 'Last Name', dataIndex: 'lName',},
        {title: 'Email', dataIndex: 'email',},
        {title: 'Marked', dataIndex: 'hasMark',},
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Space>
                    {this.props.location.state.projectId !== undefined && record.hasMark === 'No' ?
                        <Button type="primary" onClick={() => this.showMarkModal(record, 'Start')}>
                            Start Assessment
                        </Button> : ''
                    }
                    {this.props.location.state.projectId !== undefined && record.hasMark === 'Yes' ?
                        <Button type="primary" onClick={() => {
                            this.showMarkModal(record, 'Edit')
                        }}>
                            Edit Result
                        </Button> : ''
                    }
                    {this.props.location.state.projectId !== undefined && record.hasMark === 'Yes' ?
                        <Button type="default" onClick={() => {
                            this.showEmailModal(record)
                        }}>
                            Email
                        </Button> : ''
                    }
                    {this.props.location.state.projectId=== undefined ?
                        <Popconfirm
                            title="Are you sure to delete this Student?"
                            onConfirm={() => {
                                this.confirm(record)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm>:
                        <Popconfirm
                            title="Are you sure to Move this Student out of this Project?"
                            onConfirm={() => {
                                this.confirmMoveOut(record)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Move Out
                            </Button>
                        </Popconfirm>
                    }
                </Space>

        },
    ];

    confirm = (record) => {
        const url = deleteCandidateURL + record.id
        axios.put(url, {},{withCredentials:true}).then(
            response => {
                if (response.data.success === true) {
                    const finalURL = getCandidateURL+this.props.location.state.subject
                    this.getAllCandidates(finalURL, true)
                    message.success('Student Deleted');
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }

    confirmMoveOut = (record) => {
        const url = removeCandidateFromProjectURL + this.props.location.state.projectId+'/'+record.id
        axios.put(url, {},{withCredentials:true}).then(
            response => {
                if (response.data.success === true) {
                    const finalURL = getIndividualCandidatesInProjectURL + this.props.location.state.projectId
                    this.getAllCandidates(finalURL, false)
                    message.success('Student Move Out');
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

    showEmailModal = (record) => {
        this.setState({
            emailModalVisible: true,
            emailCandidate: record.id,
            emailAddress: record.email
        });
    };

    showMarkModal = (record, type) => {
        this.setState({
            markModalVisible: true,
            duration: this.state.templateDuration,
            selectedStudent: record.id,
        });
        if (type === 'Edit') {
            const finalURL = getCandidateFeedbackURL+this.props.location.state.projectId+'/'+record.id
            axios.get(finalURL, {withCredentials: true}).then(
                response => {
                    if (response.data.success === true) {
                        const responseData = response.data.data.feedback
                        this.studentFormRef.current.setFieldsValue({
                            [`generalComment`] : responseData.generalFeedback
                        })
                        for (let i=0;i<responseData.feedbackItems.length;i++){
                            const additionalComment = responseData.feedbackItems[i].name.replace(/ /g, '') + 'Comment'
                            const score = responseData.feedbackItems[i].name.replace(/ /g, '') + 'Score'
                            this.studentFormRef.current.setFieldsValue({
                                [`${additionalComment}`] : responseData.feedbackItems[i].additionalComment,
                                [`${score}`] : responseData.feedbackItems[i].mark
                            })
                            for (let j=0;j<responseData.feedbackItems[i].subItems.length;j++) {
                                const subItem = responseData.feedbackItems[i].subItems[j].name.replace(/ /g, '')
                                this.studentFormRef.current.setFieldsValue({
                                    [`${subItem}`] : responseData.feedbackItems[i].subItems[j].commentId+''
                                })
                            }
                        }
                    } else {
                        message.error(response.data.message);
                    }
                },
                error => {
                    console.log(error.error)
                }
            )
        }
    };

    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };

    showMoveStudentDrawer = () => {
        const finalURL2 = getAvailableCandidatesForProjectURL + this.props.location.state.projectId
        this.getAvailableCandidatesForProject(finalURL2)
        this.setState({
            moveStudentDrawerVisible: true,
        });
    };


    handleCancel = () => {
        this.setState({
            modalVisible: false,
            uploadFile: null,
        });
    };

    handleEmailModalCancel = () => {
        this.setState({
            emailModalVisible: false,
            emailCandidate: 0
        });
    };

    handleMarkModalCancel = () => {
        this.setState({
            markModalVisible: false,
            countStart: false
        });
        clearInterval(this.timer)
    };

    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    onMoveStudentClose = () => {
        this.setState({
            moveStudentDrawerVisible: false,
            availableCandidates:[]
        });
    };


    handleOk = () => {
        const {uploadFile} = this.state
        if (uploadFile !== null){
            let data = new FormData()
            data.append("file", uploadFile)
            const finalCSVURL = addByCsvURL+this.props.location.state.subject
            axios.post(finalCSVURL, data, {withCredentials:true}).then((response) => {
                if (response.data.success === true) {
                    const finalURL = getCandidateURL+this.props.location.state.subject
                    this.getAllCandidates(finalURL, true)
                    this.setState({
                        modalVisible: false,
                        uploadFile: null,
                    });
                    message.success('All Students Added');
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

    onFinish = (values) => {
        let mName = ''
        if (typeof values.middleName != "undefined") {
            mName = values.middleName
        }
        const element = {
            id: values.identification,
            firstName: values.firstName,
            middleName: mName,
            lastName: values.lastName,
            email: values.email
        }
        const finalURL = addCandidateURL+this.props.location.state.subject
        axios.post(finalURL, element, {withCredentials:true}).then((res) => {
            if (res.data.success === true) {
                const finalURL = getCandidateURL+this.props.location.state.subject
                this.getAllCandidates(finalURL, true)
                this.setState({
                    drawerVisible: false
                });
                message.success('Student Added');
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onMoveStudentFinish = (values) => {

        const candidateId = values.candidates.map(Number)
        const finalURL = addCandidateToProjectURL+this.props.location.state.projectId
        axios.post(finalURL, candidateId, {withCredentials:true}).then((res) => {
            if (res.data.success === true) {
                const finalURL2 = getIndividualCandidatesInProjectURL + this.props.location.state.projectId
                this.getAllCandidates(finalURL2, false)
                this.onMoveStudentClose()
                message.success('Student Added');
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onMarkFinish = (values) => {
        let feedbacks = []
        const {rubrics} = this.state
        for (let i = 0; i < rubrics.length; i++) {
            const markName = rubrics[i].rubricItem.name.replace(/ /g, '') + 'Score'
            const commentName = rubrics[i].rubricItem.name.replace(/ /g, '') + 'Comment'
            let subItems = []
            for (let j = 0; j < rubrics[i].rubricSubItems.length; j++) {
                const subItemName = rubrics[i].rubricSubItems[j].rubricSubItem.name.replace(/ /g, '')
                const subItem = {
                    id: rubrics[i].rubricSubItems[j].rubricSubItem.id,
                    commentId: this.studentFormRef.current.getFieldValue(subItemName) === undefined ? -1: Number(this.studentFormRef.current.getFieldValue(subItemName))
                }
                subItems.push(subItem)
            }
            let feedback = {}
            if (this.studentFormRef.current.getFieldValue(commentName) === undefined) {
                feedback = {
                    id: rubrics[i].rubricItem.id,
                    mark: this.studentFormRef.current.getFieldValue(markName),
                    subItems: subItems,
                }
            } else {
                feedback = {
                    id: rubrics[i].rubricItem.id,
                    mark: this.studentFormRef.current.getFieldValue(markName),
                    subItems: subItems,
                    additionalComment: this.studentFormRef.current.getFieldValue(commentName)
                }
            }
            feedbacks.push(feedback)
        }
        let flag = true
        const teamURL = studentSaveURL+this.props.location.state.projectId+'/'+this.state.selectedStudent
        axios.post(teamURL, feedbacks, {withCredentials: true}).then( res => {
            if (res.data.success !== true) {
                flag = false
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
        if (values.generalComment !== undefined) {
            const generalFeedbackURL = studentGeneralSaveURL+this.props.location.state.projectId+'/'+this.state.selectedStudent
            const generalFeedback = {
                generalComment: values.generalComment
            }
            axios.post(generalFeedbackURL, generalFeedback, {withCredentials: true}).then( res => {
                if (res.data.success !== true) {
                    flag = false
                    message.error(res.data.message);
                }
            }).catch(error => {
                console.log(error);
            })
        }
        if (flag){
            const finalURL = getIndividualCandidatesInProjectURL + this.props.location.state.projectId
            this.getAllCandidates(finalURL, false)
            this.handleMarkModalCancel()
            message.success('Feedback Submitted');
        }
    }


    onMarkFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    onMoveStudentFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    getAllCandidates = (finalURL, flag) => {
        axios.get(finalURL, {withCredentials:true}).then(
            async response => {
                if (response.data.success === true) {
                    let candidatesArr = []
                    let responseData
                    if (flag){
                        responseData = response.data.data.candidates
                    } else {
                        responseData = response.data.data.candidatesInProject
                    }
                    for (let i = 0; i < responseData.length; i++) {
                        let hasMark = false
                        if (!flag) {
                            const checkURL = checkCandidateURL+this.props.location.state.projectId+'/'+responseData[i].id

                            await axios.get(checkURL, {withCredentials: true}).then(
                                res2 => {
                                    if (res2.data.success === true) {
                                        hasMark = res2.data.data.hasMark
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
                            key: responseData[i].id,
                            id: responseData[i].id,
                            fName: responseData[i].firstName,
                            mName: responseData[i].middleName,
                            lName: responseData[i].lastName,
                            email: responseData[i].email,
                            hasMark: hasMark === true ? 'Yes' : 'No'
                        }
                        candidatesArr.push(element)
                    }
                    this.setState({
                        candidates: candidatesArr,
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

    getAvailableCandidatesForProject = (finalURL2) => {
        axios.get(finalURL2, {withCredentials:true}).then(
            response => {
                if (response.data.success === true) {
                    let candidatesArr = []
                    let responseData = response.data.data.candidatesAvailable

                    for (let i = 0; i < responseData.length; i++) {
                        const mName = responseData[i].middleName === null ? '': responseData[i].middleName
                        const element = {
                            id: responseData[i].id,
                            name: responseData[i].firstName + ' ' + mName+' '+responseData[i].lastName
                        }
                        candidatesArr.push(element)
                    }
                    this.setState({
                        availableCandidates: candidatesArr,
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

    showTemplateOfProject = () => {
        const finalURL = showTemplateOfProjectURL + this.props.location.state.projectId
        axios.get(finalURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.setState({
                        rubrics: response.data.data.projectTemplate.rubricItems,
                        templateDuration: response.data.data.projectTemplate.duration,
                        warning: response.data.data.projectTemplate.warningTime
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
            if (this.props.location.state.projectId === undefined){
                const finalURL = getCandidateURL+this.props.location.state.subject
                this.getAllCandidates(finalURL, true)
                this.columns = this.columns.filter(item => item.dataIndex !== 'hasMark')
            } else {
                const finalURL = getIndividualCandidatesInProjectURL + this.props.location.state.projectId
                this.getAllCandidates(finalURL, false)
                this.showTemplateOfProject()
            }
        }

    }

    menu = (
        <Menu>
            <Menu.Item key="0" onClick={this.showDrawer}>
                Add One Student
            </Menu.Item>
            <Menu.Item key="1" onClick={this.showModal}>
                Add More Students by CSV
            </Menu.Item>
        </Menu>
    );

    countDown = () => {
        if (!this.state.countStart){
            this.timer = setInterval(() => {
                if (this.state.duration === this.state.warning) {
                    message.warn(this.state.warning+' seconds left')
                }
                this.setState({
                    duration: this.state.duration - 1,
                }, () => {
                    if (this.state.duration <= 0) {
                        clearInterval(this.timer)
                        message.warn("Time's up")
                    }
                })
            }, 1000);
        } else {
            clearInterval(this.timer)
        }
        this.setState({
            countStart: !this.state.countStart,
        })
    }

    sendEmail = (type) => {
        let finalURL
        if (type==='Student') {
            finalURL = sendCandidatePDFMailURL + "?email=" + this.state.emailAddress + "&projectId=" + this.props.location.state.projectId + "&candidateId="+this.state.emailCandidate;
        } else {
            finalURL = sendCandidatePDFMailURL + "?email=" + this.props.location.state.email + "&projectId=" + this.props.location.state.projectId + "&candidateId="+this.state.emailCandidate;
        }
        axios.post(finalURL, {}, {withCredentials: true}).then((response) => {
            if (response.data.success === true) {
                message.success('Feedback PDF file sent to '+type);
            } else {
                message.error(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }


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
                                    <Title level={2}>Student</Title>
                                </Col>
                                <Col span={4}>
                                    {this.props.location.state.projectId === undefined ?
                                        <Dropdown overlay={this.menu} trigger={['click']}>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                <Button type="primary" shape="round" icon={<PlusOutlined/>}>
                                                    Add Students
                                                </Button>
                                            </a>
                                        </Dropdown>:
                                        <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={this.showMoveStudentDrawer}>
                                            Add Student to Project
                                        </Button>
                                    }
                                </Col>
                            </Row>
                            <Divider/>
                            <Table columns={this.columns} dataSource={this.state.candidates}/>
                            <Modal title="Upload CSV File to Batch Add" visible={this.state.modalVisible} onOk={this.handleOk}
                                   onCancel={this.handleCancel}>
                                <Upload {...uploadState}>
                                    <Button icon={<UploadOutlined />}>Select a CSV File</Button>
                                </Upload>
                            </Modal>
                            <Modal title="Send feedback PDF file" visible={this.state.emailModalVisible} footer={null}
                                   onCancel={this.handleEmailModalCancel}>
                                <Row>
                                    <Col span={14}>
                                        Send PDF file to <strong>student</strong>
                                    </Col>
                                    <Col span={10}>
                                        <Button type="primary" onClick={() => this.sendEmail('Student')}>
                                            Send
                                        </Button>
                                    </Col>
                                </Row>
                                <Divider/>
                                <Row>
                                    <Col span={14}>
                                        Send PDF file to <strong>yourself</strong>
                                    </Col>
                                    <Col span={10}>
                                        <Button type="primary" onClick={() => this.sendEmail('Yourself')}>
                                            Send
                                        </Button>
                                    </Col>
                                </Row>
                            </Modal>
                            <Modal title="Student Feedback"
                                   visible={this.state.markModalVisible}
                                   footer={null}
                                   destroyOnClose={true}
                                   closable={false}
                                   width={720}>
                                <Form layout="vertical"
                                      onFinish={this.onMarkFinish}
                                      onFinishFailed={this.onMarkFinishFailed}
                                      ref={this.studentFormRef}
                                >
                                    <Row justify="center">
                                        <Col span={2}>
                                            <Tooltip title={this.state.countStart ? "Paused":"Start"}>
                                                <Button type="primary" shape="circle"
                                                        icon={this.state.countStart === false ?
                                                            <CaretRightOutlined/> : <PauseOutlined/>}
                                                        disabled={this.state.duration <= 0}
                                                        onClick={this.countDown}/>
                                            </Tooltip>
                                        </Col>
                                        <Col span={10}>
                                            <Title
                                                level={2}>{this.state.duration % 60 < 10 ? Math.floor(this.state.duration / 60) + ' : ' + '0' + this.state.duration % 60 : Math.floor(this.state.duration / 60) + ' : ' + this.state.duration % 60}</Title>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Title level={2}>Student Feedback</Title>
                                        </Col>
                                    </Row>
                                    {this.state.rubrics.map(rubric => {
                                        const weight = rubric.markSetting === null ? '' : rubric.markSetting.weighting + '%'
                                        return (
                                            <Space direction="vertical" style={{display: 'flex'}}
                                                   key={rubric.rubricItem.name.replace(/ /g, '')}>
                                                <Row>
                                                    <Col span={24}>
                                                        <Title
                                                            level={3}>{rubric.rubricItem.name + ' ' + weight}</Title>
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col flex={2}>
                                                        <Form.Item
                                                            name={rubric.rubricItem.name.replace(/ /g, '') + 'Score'}
                                                            label="Score"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Please enter a score'
                                                            }]}
                                                        >
                                                            <InputNumber
                                                                addonAfter={rubric.markSetting === null ? 10 : rubric.markSetting.maximum}
                                                                min={0}
                                                                max={rubric.markSetting === null ? 10 : rubric.markSetting.maximum}
                                                                step={rubric.markSetting === null ? 1 : rubric.markSetting.increment}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex={3}>
                                                        <Space direction={"vertical"}>
                                                            {rubric.rubricSubItems.map(subItem => {
                                                                return (
                                                                    <Form.Item
                                                                        name={subItem.rubricSubItem.name.replace(/ /g, '')}
                                                                        label={subItem.rubricSubItem.name}
                                                                        key={subItem.rubricSubItem.name.replace(/ /g, '')}
                                                                    >
                                                                        <Select
                                                                            placeholder="Please select a feedback">
                                                                            {subItem.comments.map(comment => {
                                                                                return <Option
                                                                                    key={comment.id}>{comment.content}</Option>
                                                                            })}
                                                                        </Select>
                                                                    </Form.Item>
                                                                )
                                                            })}
                                                        </Space>
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            name={rubric.rubricItem.name.replace(/ /g, '') + 'Comment'}
                                                            label="Additional Comment"
                                                        >
                                                            <TextArea rows={4}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Space>
                                        )
                                    })}
                                    <Row>
                                        <Col span={24}>
                                            <Title
                                                level={3}>General Comment</Title>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name='generalComment'
                                            >
                                                <TextArea rows={4}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={3}>
                                            <Button onClick={this.handleMarkModalCancel}>Cancel</Button>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 16,
                                                }}
                                            >
                                                <Button type="primary" htmlType="submit">
                                                    Finish and Submit
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </Modal>
                            <Drawer
                                title="Create a new student"
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
                                                name="identification"
                                                label="Identification Number"
                                                rules={[{required: true, message: 'Please enter identification number'}]}
                                            >
                                                <InputNumber min={0} max={Number.MAX_SAFE_INTEGER} precision={0}
                                                             style={{width: '100%'}}/>
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
                                title="Move Students to this Project"
                                width={720}
                                onClose={this.onMoveStudentClose}
                                visible={this.state.moveStudentDrawerVisible}
                                bodyStyle={{paddingBottom: 80}}
                                destroyOnClose={true}
                            >
                                <Form layout="vertical"
                                      onFinish={this.onMoveStudentFinish}
                                      onFinishFailed={this.onMoveStudentFinishFailed}
                                >
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="candidates"
                                                label="Add Students to Project"
                                            >
                                                <Select
                                                    mode="multiple"
                                                    allowClear
                                                    style={{width: '100%'}}
                                                    placeholder="Please select"
                                                >
                                                    {this.state.availableCandidates.map(candidate => {
                                                        return <Option
                                                            key={candidate.id}>{candidate.name}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={3}>
                                            <Button onClick={this.onMoveStudentClose}>Cancel</Button>
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
        )
            ;
    }
}

export default Student;