import React, {Component} from 'react';
import {Button, Col, Divider, Layout, Row, Space, Typography} from "antd";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import {Redirect} from "react-router-dom";

const {Title, Text} = Typography;
const {Header, Sider, Content, Footer} = Layout;

class Home extends Component {

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
                                <Col span={24}>
                                    <Title level={2}>Home Page</Title>
                                </Col>
                            </Row>
                            <Divider/>
                            {coordinator === 1 && admin !==1 ?
                                <Space direction="vertical" style={{display: 'flex'}}>
                                    <Row justify="space-around" align="middle">
                                        <Col span={8}>
                                            <Title level={2}>Coordinator Additional Authorities</Title>
                                        </Col>
                                    </Row>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Rubric Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        The Coordinator can manage rubrics of projects in this page
                                    </Text>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Tutor Management Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        Coordinator can manage all tutors in this page<br/>
                                        It is similar to students management, you can register account for a single tutor or upload a CSV file for batch registering
                                    </Text>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Project Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        Coordinator can manage all projects created under this subject<br/>
                                        You can add new project by click <Text keyboard>Add Project</Text> button, when creating a project, if you there is no desirable existing rubric, you can create one yourself and connect it to the project later<br/>
                                        The <Text keyboard>Rubric</Text> button is for you to select a rubric<br/>
                                        You can also delete a project by clicking <Text keyboard>Delete</Text> button
                                    </Text>
                                </Space>
                                : ''
                            }
                            {admin === 1 ?
                                <Space direction="vertical" style={{display: 'flex'}}>
                                    <Row justify="space-around" align="middle">
                                        <Col span={8}>
                                            <Title level={2}>Admin Authorities</Title>
                                        </Col>
                                    </Row>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Subject Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        The admin can manage all subjects in this page <br/>
                                        You can add a new subject by clicking <Text keyboard>Add Subject</Text> button<br/>
                                        And delete a subject by clicking <Text keyboard>Delete</Text> button
                                    </Text>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Add Coordinator Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        Admin can manage all coordinators in this page<br/>
                                        You can add a subject coordinator to the system by clicking <Text keyboard>Add Coordinator</Text> button, and assign the coordinator to a subject
                                    </Text>
                                </Space>
                                :
                                <Space direction="vertical" style={{display: 'flex'}}>
                                    <Row justify="space-around" align="middle">
                                        <Col span={8}>
                                            <Title level={2}>Tutor Authorities</Title>
                                        </Col>
                                    </Row>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Students Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        This page is for you to manage students, and this page is the first page that you need
                                        to access<br/>
                                        You can access this page by clicking the left side bar <Text keyboard>Student</Text> button<br/>
                                        You can add students by clicking <Text keyboard>+ Add Student</Text> button, and there will
                                        be a drop down menu for you to choose to add a single student by filling a form or batch uploading multiple
                                        students by uploading a CSV file
                                    </Text>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Team Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        This page is for you to manage teams, since some projects need to be completed in a
                                        group of students, you can choose to form teams in this page<br/>
                                        You can access this page by click left bar <Text keyboard>Team</Text> button<br/>
                                        You can form a team by clicking <Text keyboard>+ Add Team</Text> button
                                    </Text>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Project Page</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        This page is for you to access the projects created under a subject, you can have a view of each project<br/>
                                        You can access this page by clicking left bar <Text keyboard>Project</Text> button<br/>
                                        You can can't manage projects if you are a tutor. If this project is an individual
                                        project, you can access students who will be assessed in this project by clicking <Text keyboard>Students</Text> button, or if this
                                        is a team-based project, you
                                        can access all teams to be assessed by clicking <Text keyboard>Teams</Text> button<br/>
                                        You can start marking each student or team in this page as well
                                    </Text>
                                    <Row justify="space-around" align="middle">
                                        <Col span={24}>
                                            <Title level={3}>Give Feedback</Title>
                                        </Col>
                                    </Row>
                                    <Text strong>
                                        By access Team or Student page through project, you can click <Text
                                        keyboard>Start Assessment</Text> button to start marking (you can just see this button through
                                        click <Text keyboard>Start Assessment</Text> button from Project page<br/>
                                        After marking and providing comments, you can click <Text keyboard>Finish and Submit</Text> button to submit final feedback <br/>
                                        You can also see a new button <Text keyboard>Email</Text> You could send email with result PDF to students or yourself and a CSV file containing all results to yourself
                                    </Text>
                                </Space>
                            }
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Home;