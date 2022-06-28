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
    Form,
    Select,
    Input,
    Drawer, Space, Layout, InputNumber, Tooltip
} from 'antd';

import {PlusOutlined, CaretRightOutlined, PauseOutlined} from "@ant-design/icons";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import {
    deleteTeamURL,
    getSubjectNameURL,
    getTeamURL,
    getTeamByProjectURL,
    createTeamURL,
    editCandidatesInTeamURL,
    getAvailableCandidatesForTeamURL,
    getProjectURL,
    getCandidateURL,
    removeTeamFromProjectURL,
    showTemplateOfProjectURL,
    getAvailableTeamsForProjectURL,
    addTeamsToProjectURL,
    teamSaveURL,
    personalSaveURL,
    teamGeneralFeedbackURL,
    checkTeamURL, getTeamFeedbackURL, sendTeamPDFMailToCandidateURL, sendTeamPDFMailToTutorURL
} from "../../constant";
import axios from "axios";
import {Redirect} from "react-router-dom";
import Modal from "antd/es/modal/Modal";
import TextArea from "antd/es/input/TextArea";

const {Title} = Typography;
const {Option} = Select;
const {Header, Sider, Content, Footer} = Layout;

class Team extends Component {

    state = {
        drawerAddTeamVisible: false,
        modalFeedbackVisible: false,
        drawerMoveTeamVisible: false,
        drawerModifyMembersVisible: false,
        defaultMembers: [],
        selectedTeam: 0,
        currentProject: [],
        membersCanChoose: [],
        availableTeams: [],
        projects: [],
        candidates: [],
        teams: [],
        rubrics: [],
        selectedCandidates: [],
        duration: 0,
        warning: 0,
        countStart: false,
        templateDuration: 0,
        emailTeam: 0,
        emailModalVisible: false
    }

    teamFormRef = React.createRef();

    //All modal or drawer display function
    showModifyMembersDrawer = (record) => {
        let defaultMembers = []
        let membersCanChoose = []
        let finalURL
        if (this.props.location.state.projectId === undefined) {
            finalURL = getCandidateURL + this.props.location.state.subject
        } else {
            finalURL = getAvailableCandidatesForTeamURL + this.props.location.state.projectId + '/' + record.id
        }
        axios.get(finalURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    let responseData
                    if (this.props.location.state.projectId === undefined) {
                        responseData = response.data.data.candidates
                        for (let i = 0; i < record.selectedCandidates.length; i++) {
                            defaultMembers.push(record.selectedCandidates[i].id + '')
                        }
                    } else {
                        responseData = response.data.data.availableCandidates
                        for (let i = 0; i < record.selectedCandidates.length; i++) {
                            const element = {
                                id: record.selectedCandidates[i].id + '',
                                firstName: record.selectedCandidates[i].firstName,
                                lastName: record.selectedCandidates[i].lastName,
                                middleName: record.selectedCandidates[i].middleName === undefined ? '' : record.selectedCandidates[i].middleName
                            }
                            defaultMembers.push(record.selectedCandidates[i].id + '')
                            membersCanChoose.push(element)
                        }
                    }
                    for (let i = 0; i < responseData.length; i++) {
                        const element = {
                            id: responseData[i].id + '',
                            firstName: responseData[i].firstName,
                            lastName: responseData[i].lastName,
                            middleName: responseData[i].middleName === undefined ? '' : responseData[i].middleName
                        }
                        membersCanChoose.push(element)
                    }
                    this.setState({
                        selectedTeam: record.id,
                        defaultMembers: defaultMembers,
                        membersCanChoose: membersCanChoose,
                        drawerModifyMembersVisible: true,
                    });
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    };

    showMoveTeamDrawer = () => {
        this.setState({
            drawerMoveTeamVisible: true,
        });
    };

    showAddTeamDrawer = () => {
        this.setState({
            drawerAddTeamVisible: true,
        });
    };

    showFeedbackModal = (record, type) => {
        let selectedCandidates = []
        for (let i = 0; i < record.selectedCandidates.length; i++) {
            const element = {
                id: record.selectedCandidates[i].id + '',
                firstName: record.selectedCandidates[i].firstName,
                lastName: record.selectedCandidates[i].lastName,
                middleName: record.selectedCandidates[i].middleName === undefined ? '' : record.selectedCandidates[i].middleName
            }
            selectedCandidates.push(element)
        }
        this.setState({
            modalFeedbackVisible: true,
            selectedCandidates: selectedCandidates,
            selectedTeam: record.id,
            duration: this.state.templateDuration
        });
        if (type === 'Edit') {
            const finalURL = getTeamFeedbackURL + this.props.location.state.projectId + '/' + record.id
            axios.get(finalURL, {withCredentials: true}).then(
                response => {
                    if (response.data.success === true) {
                        const responseData = response.data.data.feedback
                        this.teamFormRef.current.setFieldsValue({
                            [`generalComment`]: responseData.generalFeedback
                        })
                        for (let i = 0; i < responseData.feedbackItems.length; i++) {
                            const additionalComment = responseData.feedbackItems[i].name.replace(/ /g, '') + 'Comment'
                            const score = responseData.feedbackItems[i].name.replace(/ /g, '') + 'Score'
                            this.teamFormRef.current.setFieldsValue({
                                [`${additionalComment}`]: responseData.feedbackItems[i].additionalComment,
                                [`${score}`]: responseData.feedbackItems[i].mark
                            })
                            for (let j = 0; j < responseData.feedbackItems[i].subItems.length; j++) {
                                const subItem = responseData.feedbackItems[i].subItems[j].name.replace(/ /g, '')
                                this.teamFormRef.current.setFieldsValue({
                                    [`${subItem}`]: responseData.feedbackItems[i].subItems[j].commentId + ''
                                })
                            }
                        }
                        for (let i = 0; i < responseData.personalComments.length; i++) {
                            const personalComment = responseData.personalComments[i].candidate.id
                            this.teamFormRef.current.setFieldsValue({
                                [`${personalComment}`]: responseData.personalComments[i].personal
                            })
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

    showEmailModal = (record) => {
        this.setState({
            emailModalVisible: true,
            emailTeam: record.id
        });
    };

    //All modal or drawer close function
    onModifyMembersClose = () => {
        this.setState({
            selectedTeam: 0,
            defaultMembers: [],
            drawerModifyMembersVisible: false,
            membersCanChoose: [],
        });
    };

    onMoveTeamClose = () => {
        this.setState({
            drawerMoveTeamVisible: false,
        });
    };

    onAddTeamClose = () => {
        this.setState({
            drawerAddTeamVisible: false,
        });
    };

    handleFeedbackCancel = () => {
        this.setState({
            modalFeedbackVisible: false,
            countStart: false
        });
        clearInterval(this.timer)
    };

    handleEmailModalCancel = () => {
        this.setState({
            emailModalVisible: false,
            emailTeam: 0
        });
    };

    // All forms submit function
    onModifyMembersFinish = (values) => {
        const candidateIds = values.members.map(Number)
        const finalURL = editCandidatesInTeamURL + this.state.selectedTeam
        axios.post(finalURL, candidateIds, {withCredentials: true}).then((res) => {
            if (res.data.success === true) {
                this.getTeams()
                this.onModifyMembersClose()
                message.success('Members modified');
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onMoveTeamFinish = (values) => {
        const teamIds = values.teams.map(Number)
        const finalURL = addTeamsToProjectURL + this.props.location.state.projectId
        axios.post(finalURL, teamIds, {withCredentials: true}).then((res) => {
            if (res.data.success === true) {
                this.getTeams()
                this.getAvailableTeamsForProject()
                this.onMoveTeamClose()
                message.success('Teams added to this project');
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onAddTeamFinish = (values) => {
        const finalURL = createTeamURL + this.props.location.state.subject + '/' + values.project
        let candidateArr = []
        for (let i = 0; i < values.candidates.length; i++) {
            const item = {
                id: Number(values.candidates[i])
            }
            candidateArr.push(item)
        }
        const element = {
            team: {teamName: values.name},
            candidates: candidateArr
        }
        axios.post(finalURL, element, {withCredentials: true}).then((res) => {
            if (res.data.success === true) {
                this.getTeams()
                this.onAddTeamClose()
                message.success('Team Added');
            } else {
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    }

    onFeedbackFinish = (values) => {
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
                    commentId: this.teamFormRef.current.getFieldValue(subItemName) === undefined ? -1 : Number(this.teamFormRef.current.getFieldValue(subItemName))
                }
                subItems.push(subItem)
            }
            let feedback = {}
            if (this.teamFormRef.current.getFieldValue(commentName) === undefined) {
                feedback = {
                    id: rubrics[i].rubricItem.id,
                    mark: this.teamFormRef.current.getFieldValue(markName),
                    subItems: subItems,
                }
            } else {
                feedback = {
                    id: rubrics[i].rubricItem.id,
                    mark: this.teamFormRef.current.getFieldValue(markName),
                    subItems: subItems,
                    additionalComment: this.teamFormRef.current.getFieldValue(commentName)
                }
            }
            feedbacks.push(feedback)
        }
        let personalFeedbacks = []
        for (let k = 0; k < this.state.selectedCandidates.length; k++) {
            if (this.teamFormRef.current.getFieldValue(this.state.selectedCandidates[k].id) !== undefined) {
                const personalFeedback = {
                    candidateId: Number(this.state.selectedCandidates[k].id),
                    feedback: this.teamFormRef.current.getFieldValue(this.state.selectedCandidates[k].id)
                }
                personalFeedbacks.push(personalFeedback)
            }
        }
        let flag = true
        const teamURL = teamSaveURL + this.props.location.state.projectId + '/' + this.state.selectedTeam
        axios.post(teamURL, feedbacks, {withCredentials: true}).then(res => {
            if (res.data.success !== true) {
                flag = false
                message.error(res.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
        if (personalFeedbacks !== []) {
            const personalFeedbackURL = personalSaveURL + this.props.location.state.projectId + '/' + this.state.selectedTeam
            axios.post(personalFeedbackURL, personalFeedbacks, {withCredentials: true}).then(res => {
                if (res.data.success !== true) {
                    flag = false
                    message.error(res.data.message);
                }
            }).catch(error => {
                console.log(error);
            })
        }
        if (values.generalComment !== undefined) {
            const generalFeedbackURL = teamGeneralFeedbackURL + this.props.location.state.projectId + '/' + this.state.selectedTeam
            const generalFeedback = {
                generalComment: values.generalComment
            }
            axios.post(generalFeedbackURL, generalFeedback, {withCredentials: true}).then(res => {
                if (res.data.success !== true) {
                    flag = false
                    message.error(res.data.message);
                }
            }).catch(error => {
                console.log(error);
            })
        }
        if (flag) {
            this.getTeams()
            this.handleFeedbackCancel()
            message.success('Feedback Submitted');
        }
    }

    // All forms type in incorrect function
    onModifyMembersFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    onMoveTeamFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    onAddTeamFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    onFeedbackFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    columns = [
        {title: 'Name', dataIndex: 'name',},
        {
            title: 'Members',
            dataIndex: 'selectedCandidates',
            render(arr) {
                return arr.map(item => {
                    return item.firstName + ' ' + item.lastName;
                }).join(', ');
            }
        },
        {title: 'Subject Name', dataIndex: 'subjectName',},
        {title: 'Subject Code', dataIndex: 'subjectCode',},
        {title: 'Marked', dataIndex: 'hasMark',},
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Space>
                    <Button type="primary" onClick={() => this.showModifyMembersDrawer(record)}>
                        Manage members
                    </Button>
                    {this.props.location.state.projectId !== undefined && record.hasMark === 'No' ?
                        <Button type="primary" onClick={() => {
                            this.showFeedbackModal(record, 'Start')
                        }}>
                            Start Assessment
                        </Button> : ''
                    }
                    {this.props.location.state.projectId !== undefined && record.hasMark === 'Yes' ?
                        <Button type="primary" onClick={() => {
                            this.showFeedbackModal(record, 'Edit')
                        }}>
                            Edit Result
                        </Button> : ''
                    }
                    {this.props.location.state.projectId !== undefined && record.hasMark === 'Yes' ?
                        <Button type="default" onClick={() => this.showEmailModal(record)}>
                            Email
                        </Button> : ''
                    }
                    {this.props.location.state.projectId !== undefined ?
                        <Popconfirm
                            title="Are you sure to delete this team?"
                            onConfirm={() => {
                                this.confirmMoveOut(record)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" value="small" danger>
                                Move Out
                            </Button>
                        </Popconfirm> :
                        <Popconfirm
                            title="Are you sure to delete this team?"
                            onConfirm={() => {
                                this.confirm(record)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" value="small" danger>
                                Delete
                            </Button>
                        </Popconfirm>
                    }
                </Space>
        },
    ];

    confirmMoveOut = (record) => {
        const url = removeTeamFromProjectURL + this.props.location.state.projectId + '/' + record.id
        axios.put(url, {}, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.getTeams()
                    this.getAvailableTeamsForProject()
                    message.success('Team Moved Out');
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }

    confirm = (record) => {
        const url = deleteTeamURL + record.id
        axios.put(url, {}, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.getTeams()
                    message.success('Team Deleted');
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }

    countDown = () => {
        if (!this.state.countStart) {
            this.timer = setInterval(() => {
                if (this.state.duration === this.state.warning) {
                    message.warn(this.state.warning + ' seconds left')
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

    // functions below are all get data from backend function
    getTeams = () => {
        let finalURL
        if (this.props.location.state.projectId === undefined) {
            finalURL = getTeamURL + this.props.location.state.subject
        } else {
            finalURL = getTeamByProjectURL + this.props.location.state.projectId
        }
        axios.get(finalURL, {withCredentials: true}).then(
            async response => {
                if (response.data.success === true) {
                    let teamsArr = []
                    let responseData
                    if (this.props.location.state.projectId === undefined) {
                        responseData = response.data.data.teamsInSubject
                    } else {
                        responseData = response.data.data.teamsInProject
                    }
                    for (let i = 0; i < responseData.length; i++) {
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
                        let hasMark = false
                        if (this.props.location.state.projectId !== undefined) {
                            const checkURL = checkTeamURL + this.props.location.state.projectId + '/' + responseData[i].team.id

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
                            key: responseData[i].team.id,
                            id: responseData[i].team.id,
                            name: responseData[i].team.teamName,
                            selectedCandidates: responseData[i].candidates,
                            subjectName: subjectName,
                            subjectCode: subjectCode,
                            hasMark: hasMark === true ? 'Yes' : 'No'
                        }
                        teamsArr.push(element)
                    }
                    this.setState({
                        teams: teamsArr,
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

    getAllCandidates = () => {
        const finalURL = getCandidateURL + this.props.location.state.subject
        axios.get(finalURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    let candidatesArr = []
                    for (let i = 0; i < response.data.data.candidates.length; i++) {
                        const mName = response.data.data.candidates[i].middleName === null ? '' : response.data.data.candidates[i].middleName
                        const element = {
                            id: response.data.data.candidates[i].id,
                            name: response.data.data.candidates[i].firstName + ' ' + mName + ' ' + response.data.data.candidates[i].lastName
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

    getAllProjects() {
        const finalURL = getProjectURL + this.props.location.state.subject
        axios.get(finalURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    let projectsArr = []
                    let currentProject = []
                    for (let i = 0; i < response.data.data.projectsFromSubject.length; i++) {
                        if (response.data.data.projectsFromSubject[i].isIndividual === 0) {
                            if (this.props.location.state.projectId !== undefined && response.data.data.projectsFromSubject[i].id === this.props.location.state.projectId) {
                                currentProject = response.data.data.projectsFromSubject[i]
                            }
                            const element = {
                                id: response.data.data.projectsFromSubject[i].id,
                                description: response.data.data.projectsFromSubject[i].projectDescription,
                            }
                            projectsArr.push(element)
                        }
                    }
                    this.setState({
                        projects: projectsArr,
                        currentProject: currentProject
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

    getAvailableTeamsForProject = () => {
        const finalURL = getAvailableTeamsForProjectURL + this.props.location.state.projectId
        axios.get(finalURL, {withCredentials: true}).then(
            response => {
                if (response.data.success === true) {
                    this.setState({
                        availableTeams: response.data.data.teamsAvailable,
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
            this.getTeams()
            this.getAllProjects()
            this.getAllCandidates()
            if (this.props.location.state.projectId !== undefined) {
                this.showTemplateOfProject()
                this.getAvailableTeamsForProject()
            } else {
                this.columns = this.columns.filter(item => item.dataIndex !== 'hasMark')
            }
        }
    }

    sendEmail = (type) => {
        let finalURL
        if (type === 'Team') {
            finalURL = sendTeamPDFMailToCandidateURL + "?projectId=" + this.props.location.state.projectId + "&teamId=" + this.state.emailTeam;
        } else {
            finalURL = sendTeamPDFMailToTutorURL + "?email=" + this.props.location.state.email + "&projectId=" + this.props.location.state.projectId + "&teamId=" + this.state.emailTeam;
        }
        axios.post(finalURL, {}, {withCredentials: true}).then((response) => {
            if (response.data.success === true) {
                message.success('Feedback PDF file sent to ' + type);
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
        return (
            <Layout style={{minHeight: '100vh'}}>
                <Sider width={230}>
                    <SideBar coordinator={coordinator} admin={admin} headTutor={headTutor} subject={subject}
                             email={email}/>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{padding: 0}}>
                        <HeaderBar coordinator={coordinator} admin={admin} headTutor={headTutor}/>
                    </Header>
                    <Content style={{margin: '16px 16px'}}>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            <Row justify="space-around" align="middle">
                                <Col span={20}>
                                    <Title level={2}>Team</Title>
                                </Col>
                                <Col span={4}>
                                    {this.props.location.state.projectId === undefined ?
                                        <Button type="primary" shape="round" onClick={this.showAddTeamDrawer}
                                                icon={<PlusOutlined/>}>
                                            Add a Team
                                        </Button> :
                                        <Button type="primary" shape="round" icon={<PlusOutlined/>}
                                                onClick={this.showMoveTeamDrawer}>
                                            Add Teams to Project
                                        </Button>
                                    }
                                    <Modal title="Send feedback PDF file" visible={this.state.emailModalVisible}
                                           footer={null}
                                           onCancel={this.handleEmailModalCancel}>
                                        <Row>
                                            <Col span={14}>
                                                Send PDF file to <strong>all team members</strong>
                                            </Col>
                                            <Col span={10}>
                                                <Button type="primary" onClick={() => this.sendEmail('Team')}>
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
                                    <Drawer title="Modify members in this team"
                                            width={720}
                                            bodyStyle={{paddingBottom: 80}}
                                            destroyOnClose={true}
                                            onClose={this.onModifyMembersClose}
                                            visible={this.state.drawerModifyMembersVisible}>
                                        <Form layout="vertical"
                                              onFinish={this.onModifyMembersFinish}
                                              onFinishFailed={this.onModifyMembersFinishFailed}
                                              initialValues={{
                                                  members: this.state.defaultMembers
                                              }}
                                        >
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        name="members"
                                                        label="Modify members in this team"
                                                    >
                                                        <Select
                                                            mode="multiple"
                                                            allowClear
                                                            style={{width: '100%'}}
                                                            placeholder="Please select"
                                                        >
                                                            {this.state.membersCanChoose.map(member => {
                                                                return <Option
                                                                    key={member.id}>{member.id + ' - ' + member.firstName + ' ' + member.middleName + ' ' + member.lastName}</Option>
                                                            })}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={3}>
                                                    <Button onClick={this.onModifyMembersClose}>Cancel</Button>
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
                                    <Drawer title="Move Team to this Project"
                                            width={720}
                                            bodyStyle={{paddingBottom: 80}}
                                            destroyOnClose={true}
                                            onClose={this.onMoveTeamClose}
                                            visible={this.state.drawerMoveTeamVisible}>
                                        <Form layout="vertical"
                                              onFinish={this.onMoveTeamFinish}
                                              onFinishFailed={this.onMoveTeamFinishFailed}
                                        >
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        name="teams"
                                                        label="Add teams to Project"
                                                    >
                                                        <Select
                                                            mode="multiple"
                                                            allowClear
                                                            style={{width: '100%'}}
                                                            placeholder="Please select"
                                                        >
                                                            {this.state.availableTeams.map(availableTeam => {
                                                                return <Option
                                                                    key={availableTeam.team.id}>{availableTeam.team.teamName}</Option>
                                                            })}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={3}>
                                                    <Button onClick={this.onMoveTeamClose}>Cancel</Button>
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
                                    <Modal title="Team Feedback"
                                           visible={this.state.modalFeedbackVisible}
                                           closable={false}
                                           destroyOnClose={true}
                                           footer={null}
                                           width={720}
                                    >
                                        <Form layout="vertical"
                                              onFinish={this.onFeedbackFinish}
                                              onFinishFailed={this.onFeedbackFinishFailed}
                                              ref={this.teamFormRef}
                                        >
                                            <Row justify="center">
                                                <Col span={2}>
                                                    <Tooltip title={this.state.countStart ? "Paused" : "Start"}>
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
                                                    <Title level={2}>Team Feedback</Title>
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
                                            <Row>
                                                <Col span={24}>
                                                    <Title level={2}>Personal Feedback</Title>
                                                </Col>
                                            </Row>
                                            {this.state.selectedCandidates.map(selectedCandidate => {
                                                return (
                                                    <Space direction="vertical" style={{display: 'flex'}}
                                                           key={selectedCandidate.id}>
                                                        <Row>
                                                            <Col span={24}>
                                                                <Title
                                                                    level={3}>{selectedCandidate.firstName + ' ' + selectedCandidate.middleName + ' ' + selectedCandidate.lastName}</Title>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={16}>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    name={selectedCandidate.id}
                                                                    label="Personal Comment"
                                                                >
                                                                    <TextArea rows={4}/>
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    </Space>
                                                )
                                            })}
                                            <Row gutter={16}>
                                                <Col span={3}>
                                                    <Button onClick={this.handleFeedbackCancel}>Cancel</Button>
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
                                        title="Create a new Team"
                                        width={720}
                                        onClose={this.onAddTeamClose}
                                        visible={this.state.drawerAddTeamVisible}
                                        bodyStyle={{paddingBottom: 80}}
                                        destroyOnClose={true}
                                    >
                                        <Form layout="vertical"
                                              onFinish={this.onAddTeamFinish}
                                              onFinishFailed={this.onAddTeamFinishFailed}
                                        >
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        name="name"
                                                        label="Team Name"
                                                        rules={[{required: true, message: 'Please enter team name'}]}
                                                    >
                                                        <Input showCount maxLength={256}
                                                               placeholder="Please enter team name"/>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        name="project"
                                                        label="Project"
                                                        rules={[{required: true, message: 'Please select a Project'}]}
                                                    >
                                                        <Select placeholder="Please select a Project">
                                                            {this.state.projects.map(project => {
                                                                return <Option
                                                                    key={project.id}>{project.description}</Option>
                                                            })}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        name="candidates"
                                                        label="Students"
                                                        rules={[{required: true, message: 'Please select Students'}]}
                                                    >
                                                        <Select
                                                            mode="multiple"
                                                            allowClear
                                                            style={{width: '100%'}}
                                                            placeholder="Please select"
                                                        >
                                                            {this.state.candidates.map(candidate => {
                                                                return <Option
                                                                    key={candidate.id}>{candidate.id + ' - ' + candidate.name}</Option>
                                                            })}
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col span={3}>
                                                    <Button onClick={this.onAddTeamClose}>Cancel</Button>
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
                                </Col>
                            </Row>
                            <Divider/>
                            <Table columns={this.columns} dataSource={this.state.teams}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Team;