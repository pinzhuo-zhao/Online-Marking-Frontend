import React, {Component} from 'react';
import {Menu} from "antd";
import {FileOutlined, ProjectOutlined, TeamOutlined, UserOutlined, UserAddOutlined, ReconciliationOutlined, HomeOutlined} from "@ant-design/icons";
import {Link, withRouter} from "react-router-dom";

const {SubMenu} = Menu;

class SideBar extends Component {

    render() {
        const {coordinator, admin, headTutor, subject, email} = this.props
        return (
            <div>
                {admin === 1 ?
                <Menu theme="dark" mode="inline" defaultSelectedKeys={"/project"} selectedKeys={this.props.location.pathname}>
                    <Menu.Item key="/home" icon={<HomeOutlined />}>
                        <Link to={{pathname:'/home', state:{admin, coordinator, headTutor, subject, email}}}>Home</Link>
                    </Menu.Item>
                    <Menu.Item key="/addCoordinator" icon={<UserAddOutlined />}>
                        <Link to={{pathname:'/addCoordinator', state:{admin, coordinator, headTutor, subject, email}}}>Coordinator Management</Link>
                    </Menu.Item>
                    <Menu.Item key="/subject" icon={<ReconciliationOutlined />}>
                        <Link to={{pathname:'/subject', state:{admin, coordinator, headTutor, subject, email}}}>Subject Management</Link>
                    </Menu.Item>
                </Menu> :
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={"/project"} selectedKeys={this.props.location.pathname}>
                        <Menu.Item key="/home" icon={<HomeOutlined />}>
                            <Link to={{pathname:'/home', state:{admin, coordinator, headTutor, subject, email}}}>Home</Link>
                        </Menu.Item>
                        <Menu.Item key="/student" icon={<UserOutlined/>}>
                            <Link to={{pathname:'/student', state:{admin, coordinator, headTutor, subject, email}}}>Student Management</Link>
                        </Menu.Item>
                        {coordinator === 1 || headTutor ===1 ?
                            <SubMenu key="rubricSub" icon={<FileOutlined/>} title="Rubric Management">
                                <Menu.Item key="/rubric" icon={<FileOutlined/>}>
                                    <Link to={{pathname:'/rubric', state:{admin, coordinator, headTutor, subject, email}}}>Rubric</Link>
                                </Menu.Item>
                                <Menu.Item key="/rubricItem" icon={<FileOutlined/>}>
                                    <Link to={{pathname:'/rubricItem', state:{admin, coordinator, headTutor, subject, email}}}>Criteria</Link>
                                </Menu.Item>
                            </SubMenu>: ""}
                        <Menu.Item key="/team" icon={<TeamOutlined/>}>
                            <Link to={{pathname:'/team', state:{admin, coordinator, headTutor, subject, email}}}>Team Management</Link>
                        </Menu.Item>
                        <Menu.Item key="/project" icon={<ProjectOutlined/>}>
                            <Link to={{pathname:'/project', state:{admin, coordinator, headTutor, subject, email}}}>Project Management</Link>
                        </Menu.Item>
                        {coordinator === 1 ?
                            <Menu.Item key="/addInstructor" icon={<UserAddOutlined />}>
                                <Link to={{pathname:'/addInstructor', state:{admin, coordinator, headTutor, subject, email}}}>Tutor Management</Link>
                            </Menu.Item> : ""}
                    </Menu>
                }

            </div>
        );
    }
}

export default withRouter(SideBar);