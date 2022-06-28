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
    Radio,
    Breadcrumb,
    Checkbox,
    Cascader,
    Slider,
} from 'antd';

import {MinusCircleOutlined,PlusOutlined} from "@ant-design/icons";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import axios from "axios";

import {Link, Redirect} from "react-router-dom";
import {
    createProjectURL,
    createTemplateURL, deleteProjectURL, deleteTemplateURL, getAllRubricItemsURL, getMarkSettingURL,
    getProjectURL,
    getSubjectNameURL,
    getTemplateByIdURL,
    getTemplateURL, updateTemplateURL,
} from "../../constant";
import rubricItem from "./rubricItem";

const {Title} = Typography;
const { Option } = Select;
const {form} = Form.useForm;
const {Header, Sider, Content, Footer} = Layout;

class Rubric extends Component{

    rubric_items_example = [
        {
            markSetting:{
                increment: 0.25,
                maximum: 10,
                rubricItemId: 1,
                weighting: 20
            },
            rubricItem: {
                id: 1
            },
        }
    ];

    incrementNumber = 0;

    state = {
        visible: false,
        modifyVisible:false,
        viewVisible: false,
        addVisible: false,
        rubrics:[],
        description:'',
        rubricItems:[],
        allRubricItems: [],
        projects: [],
        rubricItemId: 0,
        rubricItemName: '',
        increment: 0,
        maximum: 0,
        weighting: 0,
        markSetting: [],
        id: 0,
        name: '',
        selectedProject: '',
    };

    rubricFormRef = React.createRef();

    increment_options = [
        {
            label: 0.25,
            value: 0.25,
        },
        {
            label: 0.5,
            value: 0.5,
        },
        {
            label: 1,
            value: 1,
        },
    ]

// add rubric drawer show function
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    showModifyDrawer = (record) => {
        let rubricItemArr = []
        console.log(record)
        for (let i = 0; i < record.rubricItems.length; i++){
            if (record.rubricItems[i].markSetting !== undefined){
                const markSettingElement = {
                    increment: record.rubricItems[i].markSetting.increment,
                    maximum: record.rubricItems[i].markSetting.maximum,
                    weighting: record.rubricItems[i].markSetting.weighting,
                }
                const rubricItemElement = {
                    id: record.rubricItems[i].rubricItem.id,
                    name: record.rubricItems[i].rubricItem.name,
                }
                const element = {
                    markSetting: markSettingElement,
                    rubricItem: rubricItemElement,
                }
                rubricItemArr.push(element)
            } else {
                const markSettingElement = null
                const rubricItemElement = {
                    id: record.rubricItems[i].rubricItem.id,
                    name: record.rubricItems[i].rubricItem.name,
                }
                const element = {
                    markSetting: markSettingElement,
                    rubricItem: rubricItemElement,
                }
                rubricItemArr.push(element)
            }
        }
        console.log(rubricItemArr)
        this.setState({
            modifyVisible: true,
            name: record.name,
            description:record.description,
            rubricItems: rubricItemArr,
            id: record.id,
        });

        for (let i =0; i <record.rubricItems.length; i++){
            this.rubricFormRef.current.setFieldsValue({
                [`rubricItem`]: record.rubricItems[i].rubricItem.name
            })
        }
    };

    showViewDrawer = (record) => {
        let rubricItemArr = []
        console.log(record)
        for (let i = 0; i < record.rubricItems.length; i++){
            if (record.rubricItems[i].markSetting !== undefined){
                const markSettingElement = {
                    increment: record.rubricItems[i].markSetting.increment,
                    maximum: record.rubricItems[i].markSetting.maximum,
                    weighting: record.rubricItems[i].markSetting.weighting,
                }
                const rubricItemElement = {
                    id: record.rubricItems[i].rubricItem.id,
                    name: record.rubricItems[i].rubricItem.name,
                }
                const element = {
                    markSetting: markSettingElement,
                    rubricItem: rubricItemElement,
                }
                rubricItemArr.push(element)
            } else {
                const markSettingElement = null
                const rubricItemElement = {
                    id: record.rubricItems[i].rubricItem.id,
                    name: record.rubricItems[i].rubricItem.name,
                }
                const element = {
                    markSetting: markSettingElement,
                    rubricItem: rubricItemElement,
                }
                rubricItemArr.push(element)
            }
        }
        console.log(rubricItemArr)
        this.setState({
            viewVisible: true,
            description: record.description,
            name: record.name,
            project: record.selectedProject,
            rubricItem: rubricItemArr,
            id: record.id,
        })
    }

    showAddRubricItemDrawer = (record) => {
        this.setState({
            addVisible: true,
        })
    }

    // add rubric drawer close function
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onModifyDrawerClose = () => {
        this.setState({
            modifyVisible: false,
        })
    }

    onAddRubricItemDrawerClose = () =>{
        this.setState({
            addVisible: false,
        })
    }

    onViewDrawerClose = () =>{
        this.setState({
            viewVisible: false,
        })
    }

    handleChange = () =>{
        form.setFieldsValue({rubric_items: []});
    };

    columns = [
        {
            title: 'Rubric Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Criteria',
            dataIndex: 'rubricItems',
            render(arr){
                return arr.map(item =>{
                    return item.rubricItem.name;
                }).join(', ');
            }
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Space>
                    <Button onClick={() => {
                    this.showViewDrawer(record)}
                    }>
                        View
                    </Button>
                    {this.props.location.state.admin=== 1 || this.props.location.state.coordinator===1 ?
                        <Button
                            type="primary"
                            onClick={() => {
                            this.showModifyDrawer(record)
                        }}>
                            Modify
                        </Button>: ''
                    }
                    {this.props.location.state.admin=== 1 || this.props.location.state.coordinator===1 ?
                        <Popconfirm
                            title="Are you sure to delete this Rubric?"
                            onConfirm={() => {
                                this.confirm(record)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger>
                                Delete
                            </Button>
                        </Popconfirm>: ''
                    }
                </Space>
        },
    ]

    // Confirm for Delete function
    confirm = (record) => {
        const url = deleteTemplateURL + record.id
        axios.put(url, {},{withCredentials:true}).then(
            response => {
                if (response.data.success === true) {
                    this.getAllRubrics()
                    message.success('Rubric Deleted');
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
        if (this.props.location.state !== undefined){
            this.getAllRubrics()
            this.getAllRubricItems()
            this.getAllProjects()
        }
    };

    getAllRubrics = () => {
        const finalURL = getTemplateURL+this.props.location.state.subject
        console.log(this.props.location.state.subject)
        axios.get(finalURL, {withCredentials:true}).then(
            async response=> {
                if (response.data.success === true) {
                    let rubricArr = []
                    let allItemArr = []
                    for (let i = 0; i < response.data.data.templates.length; i++){
                        let rubricItemArr = []
                        for (let j = 0; j < response.data.data.templates[i].rubricItems.length; j++){
                            let markSettingItem
                            if (response.data.data.templates[i].rubricItems[j].markSetting !== null){
                                markSettingItem = {
                                    id: response.data.data.templates[i].rubricItems[j].markSetting.id,
                                    maximum: response.data.data.templates[i].rubricItems[j].markSetting.maximum,
                                    weighting: response.data.data.templates[i].rubricItems[j].markSetting.weighting,
                                    increment: response.data.data.templates[i].rubricItems[j].markSetting.increment,
                                }
                            }
                            const rubricItem = {
                                id: response.data.data.templates[i].rubricItems[j].rubricItem.id,
                                name: response.data.data.templates[i].rubricItems[j].rubricItem.name,
                            }
                            allItemArr.push(rubricItem)
                            const testElement = {
                                markSetting: markSettingItem,
                                rubricItem: rubricItem,
                            }
                            rubricItemArr.push(testElement)
                        }
                        const element = {
                            id: response.data.data.templates[i].template.id,
                            name: response.data.data.templates[i].template.name,
                            description: response.data.data.templates[i].template.description,
                            key: response.data.data.templates[i].template.id,
                            rubricItems: rubricItemArr,
                        }
                        //console.log(element)
                        rubricArr.push(element)
                    }
                    this.setState({
                        rubrics: rubricArr,
                        // allRubricItems: allItemArr,
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

    getRubricById = (rubric) =>{
        const finalURL = getTemplateByIdURL + this.props.location.state.rubric.id
        console.log(this.props.location.state.rubric.id)
        axios.get(finalURL, {withCredentials:true}).then(
            response =>{
                if(response.data.success===true){
                    const element = {

                    }
                }
            }
        )
    }

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


    getAllRubricItems = () =>{
        const finalURL = getAllRubricItemsURL + this.props.location.state.subject;
        axios.get(finalURL, {withCredentials:true}).then(
            response => {
                if (response.data.success === true) {
                    let rubricItemArr = []
                    for (let i=0; i<response.data.data.rubricItems.length;i++) {
                        const element = {
                            id: response.data.data.rubricItems[i].rubricItem.id,
                            item: response.data.data.rubricItems[i].rubricItem.name,
                        }
                        rubricItemArr.push(element)
                    }
                    this.setState({
                            allRubricItems: rubricItemArr,
                        },
                    );
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
        //console.log(this.state.rubricItems)
    }

    // add rubric submit function
    onFinish = (values) =>{
        let element = {}
        let rubricItemArr = []
        let weightingSum = 0;
        for (let i = 0; i < values.rubricItems.length; i++){
            const markSettingItem = {increment: values.rubricItems.at(i).increment,
                    maximum: values.rubricItems.at(i).maximum,
                    rubricItemId: parseInt(values.rubricItems.at(i).name),
                    weighting: values.rubricItems.at(i).weighting}
            weightingSum = weightingSum+ values.rubricItems.at(i).weighting;
            const rubricItem = { id: parseInt(values.rubricItems.at(i).name)}
            const testElement = {
                markSetting: markSettingItem,
                rubricItem: rubricItem,
            }
            rubricItemArr.push(testElement)
        }
        element = {
            rubricItems: rubricItemArr,
            template: {name: values.name,
                description: values.description}
        }
        console.log(element);
        const finalURL = createTemplateURL + this.props.location.state.subject;
        if (weightingSum == 100){
            axios.post(finalURL, element, {withCredentials: true}).then((response) => {
                console.log(element);
                if (response.data.success === true) {
                    this.getAllRubrics()
                    this.setState({
                        visible: false,
                        selectedProject: values.project,
                    });
                    message.success('Rubric Added');
                } else {
                    message.error(response.data.message);
                }
            }).catch(error => {
                console.log(error);
            })
        } else {
            message.error('The sum of weightings should be exactly 100!')
        }

    }

    onFinishFailed = (errorInfo) =>{
        console.log('Failed:', errorInfo);
    };


    onModifyFinish = (values) =>{
        let element = {}
        let rubricItemArr = []
        let weightingSum = 0;
        console.log(values)
        for (let i = 0; i < values.rubricItems.length; i++){
            const markSettingItem = {increment: values.rubricItems.at(i).increment,
                maximum: values.rubricItems.at(i).maximum,
                rubricItemId: parseInt(values.rubricItems.at(i).name),
                weighting: values.rubricItems.at(i).weighting}
            weightingSum = weightingSum+ values.rubricItems.at(i).weighting;
            const rubricItem = { id: parseInt(values.rubricItems.at(i).name)}
            const testElement = {
                markSetting: markSettingItem,
                rubricItem: rubricItem,
            }
            rubricItemArr.push(testElement)
        }
        element = {
            rubricItems: rubricItemArr,
            template: {
                id: this.state.id,
                name: values.name,
                description: values.description}
        }
        console.log(element)
        if (weightingSum == 100){
            axios.put(updateTemplateURL, element,{withCredentials: true}).then(
                response => {
                    if (response.data.success === true){
                        this.getAllRubrics()
                        this.setState({
                            modifyVisible: false,
                        });
                        message.success('Rubric Updated')
                    } else {
                        message.error(response.data.message)
                    }
                }
            ).catch(error =>{console.log(error)})
        }else {
            message.error('The sum of new weightings should be exactly 100!')
        }
    };

    onModifyFinishFailed = (errorInfo) =>{

    };



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
                        <HeaderBar/>
                    </Header>
                    <Content style={{margin: '16px 16px'}}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {this.props.location.state.admin=== 1 || this.props.location.state.coordinator===1 ?
                                <Row justify="space-around" align="middle">
                                    <Col span={20}>
                                        <Title level={2}>Rubrics</Title>
                                    </Col>
                                    <Col span={4}>
                                        <Button type="primary" shape="round" onClick={this.showDrawer} icon={<PlusOutlined />}>
                                            Add Rubric
                                        </Button>
                                    </Col>
                                </Row>:
                                <Row justify="space-around" align="middle">
                                    <Col span={24}>
                                        <Title level={2}>Project</Title>
                                    </Col>
                                </Row>
                            }
                            <Drawer
                                title="Create a new rubric"
                                width={720}
                                onClose={this.onClose}
                                visible={this.state.visible}
                                bodyStyle={{ paddingBottom: 80 }}
                                destroyOnClose={true}>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    onFinish={this.onFinish}
                                    onFinishFailed={this.onFinishFailed}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="name"
                                                label="Rubric Name"
                                                rules={[{ required: true, message: 'Please enter rubric name' }]}
                                            >
                                                <Input disabled={false} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="description"
                                                label="Rubric Description "
                                                rules={[{ required: true, message: 'Please enter rubric description' }]}
                                            >
                                                <Input showCount maxLength={256} placeholder="Please enter rubric description" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="project"
                                                label="Select a project (not required)"
                                            >
                                                <Select
                                                    allowClear
                                                    style={{width: '100%'}}
                                                    placeholder="Please select">
                                                    {this.state.projects.map(project =>{
                                                        return<Option key={project.id}>
                                                            {project.description}
                                                        </Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.List name="rubricItems">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            <Space key={key + 'create'} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                                <Form.Item
                                                                    {...restField}
                                                                    label="Criterion Name"
                                                                    name={[name, 'name']}
                                                                    rules={[{ required: true, message: 'Missing criterion name' }]}
                                                                >
                                                                    <Select
                                                                        allowClear
                                                                        style={{width: '100%'}}
                                                                        placeholder="Please select"
                                                                    >
                                                                        {this.state.allRubricItems.map(item =>{
                                                                            console.log(this.state.allRubricItems)
                                                                            return<Option key={item.id}>
                                                                                {item.item}
                                                                            </Option>
                                                                        })}
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Mark Increment"
                                                                    {...restField}
                                                                    name={[name, 'increment']}
                                                                    rules={[{ required: true, message: 'Missing increment value' }]}
                                                                >
                                                                    <Select
                                                                        options={this.increment_options}
                                                                        allowClear
                                                                        style={{width: '100%'}}
                                                                        placeholder="Please select"
                                                                    ></Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Maximum Mark"
                                                                    {...restField}
                                                                    name={[name, 'maximum']}
                                                                    rules={[{ required: true, message: 'Missing maximum value' }]}
                                                                >
                                                                    <InputNumber
                                                                        placeholder="Maximum" min={0}/>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Weighting"
                                                                    {...restField}
                                                                    name={[name, 'weighting']}
                                                                    rules={[{ required: true, message: 'Missing weighting value' }]}
                                                                >
                                                                    <InputNumber placeholder="Weighting" min={0}/>
                                                                </Form.Item>
                                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                                            </Space>
                                                        ))}
                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                Add criteria
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col>
                                            <p>Please note that all the weightings should be added up to 100!</p>
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
                                visible={this.state.modifyVisible}
                                onClose={this.onModifyDrawerClose}
                                destroyOnClose={true}>
                                <Form
                                    layout="vertical"
                                    onFinish={this.onModifyFinish}
                                    onFinishFailed={this.onModifyFinishFailed}
                                initialValues={{id: this.state.id,
                                    name: this.state.name,
                                    description: this.state.description,
                                    project: this.state.selectedProject,}}
                                ref={this.rubricFormRef}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="name"
                                                label="Rubric Name"
                                                rules={[{ required: true, message: 'Please enter rubric name' }]}
                                            >
                                                <Input disabled={false} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="description"
                                                label="Rubric Description "
                                                rules={[{ required: true, message: 'Please enter rubric description' }]}
                                            >
                                                <Input showCount maxLength={256} placeholder="Please enter rubric description" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                label="Select a project (not required)"
                                            >
                                                <Select
                                                    allowClear
                                                    style={{width: '100%'}}
                                                    placeholder="Please select">
                                                    {this.state.projects.map(project =>{
                                                        return<Option key={project.id}>
                                                            {project.description}
                                                        </Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col>
                                            <h4>Previous Settings</h4>
                                        </Col>
                                    </Row>
                                    {this.state.rubricItems.map(item=>{
                                        console.log("items:")
                                        console.log(item)
                                        return (
                                            <Space direction="horizontal" style={{display: 'flex'}}
                                                   key={item.rubricItem.id + 'item'}
                                            >
                                                <Row gutter={16}>
                                                    <Col flex={2}>
                                                        <Form.Item
                                                            name={item.name}
                                                            label="Criterion Name"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Please select a criterion'
                                                            }]}
                                                        >
                                                            <Input defaultValue={item.rubricItem.name}
                                                            disabled={true}></Input>

                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex={3}>
                                                        <Form.Item
                                                            label="Mark Increment"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Missing increment value'
                                                            }]}
                                                        >
                                                            <Input
                                                                disabled={true}
                                                                defaultValue={item.markSetting.increment}>
                                                            </Input>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex={4}>
                                                        <Form.Item
                                                            label="Maximum Mark"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Missing Maximum value'
                                                            }]}
                                                        >
                                                            <InputNumber
                                                                disabled={true}
                                                                defaultValue={item.markSetting.maximum}></InputNumber>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex={5}>
                                                        <Form.Item
                                                            label="Weighting"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Missing Weighting value'
                                                            }]}
                                                        >
                                                            <InputNumber
                                                                disabled={true}
                                                                defaultValue={item.markSetting.weighting}
                                                                min={0}></InputNumber>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Space>

                                        )
                                    })

                                    }
                                    <Row gutter={16}>
                                        <Col>
                                            <h4>New Settings</h4>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.List name="rubricItems">
                                                {(fields, { add, remove }) => (
                                                    <>
                                                        {fields.map(({ key, name, ...restField }) => (
                                                            <Space key={key + 'create'} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                                <Form.Item
                                                                    {...restField}
                                                                    label="Criterion Name"
                                                                    name={[name, 'name']}
                                                                    rules={[{ required: true, message: 'Missing criterion name' }]}
                                                                >
                                                                    <Select
                                                                        allowClear
                                                                        style={{width: '100%'}}
                                                                        placeholder="Please select"
                                                                    >
                                                                        {this.state.allRubricItems.map(item =>{
                                                                            console.log(this.state.allRubricItems)
                                                                            return<Option key={item.id}>
                                                                                {item.item}
                                                                            </Option>
                                                                        })}
                                                                    </Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Mark Increment"
                                                                    {...restField}
                                                                    name={[name, 'increment']}
                                                                    rules={[{ required: true, message: 'Missing increment value' }]}
                                                                >
                                                                    <Select
                                                                        options={this.increment_options}
                                                                        allowClear
                                                                        style={{width: '100%'}}
                                                                        placeholder="Please select"
                                                                    ></Select>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Maximum Mark"
                                                                    {...restField}
                                                                    name={[name, 'maximum']}
                                                                    rules={[{ required: true, message: 'Missing maximum value' }]}
                                                                >
                                                                    <InputNumber
                                                                        placeholder="Maximum" min={0}/>
                                                                </Form.Item>
                                                                <Form.Item
                                                                    label="Weighting"
                                                                    {...restField}
                                                                    name={[name, 'weighting']}
                                                                    rules={[{ required: true, message: 'Missing weighting value' }]}
                                                                >
                                                                    <InputNumber placeholder="Weighting" min={0}/>
                                                                </Form.Item>
                                                                <MinusCircleOutlined onClick={() => remove(name)} />
                                                            </Space>
                                                        ))}
                                                        <Form.Item>
                                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                                Add criteria
                                                            </Button>
                                                        </Form.Item>
                                                    </>
                                                )}
                                            </Form.List>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col>
                                            <p>Please note that all the weightings should be added up to 100!</p>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={3}>
                                            <Button onClick={this.onModifyDrawerClose}>Cancel</Button>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item
                                                wrapperCol={{
                                                    span: 16,
                                                }}
                                            >
                                                <Button type="primary" htmlType="submit">
                                                    Update
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>

                            </Drawer>
                            <Drawer
                                title="View Rubric"
                                width={720}
                                visible={this.state.viewVisible}
                                onClose={this.onViewDrawerClose}
                                destroyOnClose={true}
                            >
                                <Form
                                    layout="vertical"
                                    initialValues={{
                                        name: this.state.name,
                                        description: this.state.description,
                                        project: this.state.selectedProject,
                                    }}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="name"
                                                label="Rubric Name"
                                            >
                                                <Input disabled={true}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="description"
                                                label="Rubric Description"
                                            >
                                                <Input disabled={true}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="project"
                                                label="Project"
                                            >
                                                <Input disabled={true}/>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {this.state.rubricItems.map(item=>{
                                        console.log("items:")
                                        console.log(item)
                                        return (
                                            <Space direction="horizontal" style={{display: 'flex'}}
                                                   key={item.rubricItem.id + 'item'}
                                            >
                                                <Row gutter={16}>
                                                    <Col flex={2}>
                                                        <Form.Item
                                                            name={item.name}
                                                            label="Criterion Name"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Please select a criterion'
                                                            }]}
                                                        >
                                                            <Input defaultValue={item.rubricItem.name}
                                                                   disabled={true}></Input>

                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex={3}>
                                                        <Form.Item
                                                            label="Mark Increment"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Missing increment value'
                                                            }]}
                                                        >
                                                            <Input
                                                                disabled={true}
                                                                defaultValue={item.markSetting.increment}>
                                                            </Input>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex={4}>
                                                        <Form.Item
                                                            label="Maximum Mark"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Missing Maximum value'
                                                            }]}
                                                        >
                                                            <InputNumber
                                                                disabled={true}
                                                                defaultValue={item.markSetting.maximum}></InputNumber>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col flex={5}>
                                                        <Form.Item
                                                            label="Weighting"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Missing Weighting value'
                                                            }]}
                                                        >
                                                            <InputNumber
                                                                disabled={true}
                                                                defaultValue={item.markSetting.weighting}
                                                                min={0}></InputNumber>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Space>

                                        )
                                    })

                                    }
                                </Form>
                            </Drawer>
                            <Divider/>
                            <Table columns={this.columns} dataSource={this.state.rubrics}/>
                        </div>

                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default Rubric;