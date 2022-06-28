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
    Breadcrumb, Menu, Dropdown, Upload, Modal,
} from 'antd';

import {MinusCircleOutlined, PlusOutlined, MinusCircleFilled, UploadOutlined} from "@ant-design/icons";
import SideBar from "../../components/sideBar";
import HeaderBar from "../../components/headerBar";
import axios from "axios";

import {Link, Redirect} from "react-router-dom";
import Search from "antd/es/input/Search";
import {
    createRubricItemURL,
    getAllRubricItemsURL,
    searchRubricItemsURL,
    deleteRubricItemURL,
    getRubricSubitemsByIdURL, addByCsvURL, getCandidateURL, addRubricItemByCsvURL, updateRubricItemURL
} from "../../constant";

const {Title} = Typography;
const { Option } = Select;
const {Header, Sider, Content, Footer} = Layout;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};
const formItemLayoutWithOutLabel = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8},
    },
};

class RubricItem extends Component{

    state = {
        visible: false,
        rubricVisible:false,
        modifyVisible: false,
        viewVisible: false,
        rubrics: [],
        rubricItemName: '',
        rubricItems:[],
        rubricSubitems: [],
        displaySubitems: [],
        subitems: [],
        comments: [],
        subjectName:'',
        subjectCode:'',
        description:'',
        uploadFile: null,
        id: 0,
    };

    rubric_subitem_example = [
        {comments:[{
                content: "Your Structure is OK",
                level: "neutral"
            }],
            rubricSubItem:{
                name: "Main Body of the Presentation",
            },
        }
    ];

    comment_level = [
        {
            label: 'positive',
            value: 'positive',
        },
        {
            label: 'neutral',
            value: 'neutral',
        },
        {
            label: 'negative',
            value: 'negative',
        }
    ]

// add rubric drawer show function
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    showModifyDrawer = (record) =>{
        let rubricSubItemArr = []
        console.log(record)
        for (let i = 0; i< record.subitems.length; i++){
            const element = {
                name: record.subitems[i],
            }
            rubricSubItemArr.push(element)
        }
        console.log(rubricSubItemArr)
        this.setState({
            modifyVisible: true,
            rubricItemName: record.item,
            rubricSubitems: rubricSubItemArr,
            id: record.id,
        })
    };

    showViewDrawer = (record) =>{
        let rubricSubItemArr = []
        console.log(record)
        for (let i = 0; i< record.subitems.length; i++){
            const element = {
                name: record.subitems[i],
            }
            rubricSubItemArr.push(element)
        }
        console.log(rubricSubItemArr)
        this.setState({
            viewVisible: true,
            rubricItemName: record.item,
            rubricSubitems: rubricSubItemArr,
            id: record.id,
        })
    };

    // add project drawer close function
    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onModifyDrawerClose = () => {
        this.setState({
            modifyVisible: false,
        });
    };

    onViewDrawerClose = () =>{
        this.setState({
            viewVisible: false,
        })
    }

    columns = [
        {
            title: 'Criteria',
            dataIndex: 'item',
        },
        {
            title: 'Criteria Category',
            dataIndex: 'subitems',
            render(arr) {
                return arr.map(item => {
                    return item;
                }).join(', ');
            }
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record) =>
                <Space>
                    <Button onClick={()=> {
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
                            title="Are you sure to delete this Criterion?"
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

    handleOk = () =>{
        const {uploadFile} = this.state
        if (uploadFile !== null){
            let data = new FormData()
            data.append("file", uploadFile)
            const finalCSVURL = addRubricItemByCsvURL + this.props.location.state.subject
            axios.post(finalCSVURL, data, {withCredentials:true}).then((response) => {
                if (response.data.success === true) {
                    const finalURL = getAllRubricItemsURL+this.props.location.state.subject
                    this.getAllRubricItems(finalURL, true)
                    this.setState({
                        modalVisible: false,
                        uploadFile: null,
                    });
                    message.success('All Criteria Added');
                } else {
                    message.error(response.data.message);
                }
            }).catch(error => {
                console.log(error);
            })
        } else {
            message.error('Please select a CSV file');
        }
    }

    handleCancel = () =>{
        this.setState({
            uploadFile: null,
            modalVisible: false,
        })
    }

    showModal= () =>{
        this.setState({
            modalVisible:true,
        })
    }

    menu = (
        <Menu>
            <Menu.Item key="0" onClick={this.showDrawer}>
                Add One Criterion
            </Menu.Item>
            <Menu.Item key="1" onClick={this.showModal}>
                Add More Criteria by CSV
            </Menu.Item>
        </Menu>
    )

    getAllRubricItems = (finalURL, flag) =>{
        axios.get(finalURL, {withCredentials:true}).then(
            async response=> {
                if (response.data.success === true) {
                    let rubricItemArr = []
                    let element
                    for (let i=0; i<response.data.data.rubricItems.length;i++) {
                        const finalURL = getRubricSubitemsByIdURL + response.data.data.rubricItems[i].rubricItem.id;
                        await  axios.get(finalURL, {withCredentials:true}).then(
                            res =>{
                                if(res.data.success ===true){
                                    let rubricSubitemArr = []
                                    for (let j = 0; j<res.data.data.rubricSubItems.length;j++){
                                        if (res.data.data.rubricSubItems[j].rubricItemId === response.data.data.rubricItems[i].rubricItem.id){
                                            rubricSubitemArr.push(res.data.data.rubricSubItems[j].name)
                                        }
                                    }
                                    element = {
                                        id: response.data.data.rubricItems[i].rubricItem.id,
                                        item: response.data.data.rubricItems[i].rubricItem.name,
                                        subitems: rubricSubitemArr,
                                    }
                                    rubricItemArr.push(element)
                                }
                                else {
                                    message.error(res.data.message);
                                }
                            },
                            error2 =>{
                                console.log(error2.error)
                            }
                        )
                    }
                    console.log(rubricItemArr)
                    this.setState({
                        rubricItems: rubricItemArr,
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

    getRubricSubitemsByID = (id) =>{
        let rubricSubitemArr = []
        const finalURL = getRubricSubitemsByIdURL + id;
        axios.get(finalURL, {withCredentials:true}).then(
            response => {
                if (response.data.success === true) {
                    for (let i=0; i<response.data.data.rubricSubItems.length;i++) {
                        rubricSubitemArr.push(response.data.data.rubricSubItems[i].name)
                        //rubricSubitemArr.push(response.data.data.rubricSubItems[i].name)
                    }
                    //console.log("here")
                    // console.log(rubricSubitemArr)
                    const element = {
                        subitemList: rubricSubitemArr,
                    }
                    this.state.displaySubitems.push(element)
                    //console.log(this.state.displaySubitems)
                    this.setState({
                        rubricSubitems: rubricSubitemArr,
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

    componentDidMount() {
        if (this.props.location.state !== undefined){
            const finalURL = getAllRubricItemsURL + this.props.location.state.subject;
            this.getAllRubricItems(finalURL, true)
            this.getRubricSubitemsByID(1)
        }
    };

    // Confirm for Delete function
    confirm = (record) => {
        console.log(record)
        const url = deleteRubricItemURL + record.id
        console.log(url)
        axios.delete(url, {withCredentials:true}).then(
            response => {
                if (response.data.success === true) {
                    const finalURL = getAllRubricItemsURL + this.props.location.state.subject;
                    this.getAllRubricItems(finalURL, true)
                    message.success('Criterion Deleted');
                } else {
                    message.error(response.data.message);
                }
            },
            error => {
                console.log(error.error)
            }
        )
    }

    onSearch = (input) =>{
        console.log(input)
        const finalURL = searchRubricItemsURL + input
        axios.post(finalURL, input, {withCredentials: true}).then((response) => {
            if (response.data.success === true) {
                this.setState({
                    visible: false
                });
                message.success('Rubric item found');
            } else {
                message.error(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        })
    };

    onFinish = (values) =>{
        let element = {}
        let testElement = {}
        let subitemArr = []
        let testElementArr = []
        //console.log(values.subitemList[0].commentList)
        for (let i = 0; i<values.subitemList.length; i++){
            let commentArr = []
            const subitem = {
                name: values.subitemList[i].subitem,
            }
            for (let j = 0; j < values.subitemList[i].commentList.length; j++){
                const comments = {
                    content: values.subitemList[i].commentList[j].content,
                    level: values.subitemList[i].commentList[j].level,
                }
                commentArr.push(comments)
            }
            console.log("commentArr: ")
            console.log(commentArr)
            testElement = {
                comments: commentArr,
                rubricSubItem: subitem,
            }
            console.log("check testElement")
            console.log(testElement)
            testElementArr.push(testElement)
        }
        console.log("test element array: ")
        console.log(testElementArr)
        element = {
            rubricItem: {
                name: values.name,
                subjectId: this.props.location.state.subject,
            },
            rubricSubItems: testElementArr,
        }
        console.log(element)
        axios.post(createRubricItemURL, element, {withCredentials:true}).then((response)=>{
            if (response.data.success===true){
                const finalURL = getAllRubricItemsURL + this.props.location.state.subject;
                this.getAllRubricItems(finalURL, true)
                this.setState({
                    visible: false
                });
                message.success('Rubric Item Added');
            }else{
                message.error(response.data.message);
            }
        }).catch(error=>{
            console.log(error);
        })
    };

    onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    onModifyFinish = (values) =>{
        console.log(values)
        let element = {}
        let testElement = {}
        let subitemArr = []
        let testElementArr = []
        //console.log(values.subitemList[0].commentList)
        for (let i = 0; i<values.subitemList.length; i++){
            let commentArr = []
            const subitem = {
                name: values.subitemList[i].subitem,
            }
            for (let j = 0; j < values.subitemList[i].commentList.length; j++){
                const comments = {
                    content: values.subitemList[i].commentList[j].content,
                    level: values.subitemList[i].commentList[j].level,
                }
                commentArr.push(comments)
            }
            console.log("commentArr: ")
            console.log(commentArr)
            testElement = {
                comments: commentArr,
                rubricSubItem: subitem,
            }
            console.log("check testElement")
            console.log(testElement)
            testElementArr.push(testElement)
        }
        console.log("test element array: ")
        console.log(testElementArr)
        element = {
            rubricItem: {
                id: this.state.id,
                name: values.name,
                subjectId: this.props.location.state.subject,
            },
            rubricSubItems: testElementArr,
        }
        console.log(element)
        axios.put(updateRubricItemURL, element,{withCredentials:true}).then(
            response=>{
                if (response.data.success === true){
                    const finalURL = getAllRubricItemsURL + this.props.location.state.subject;
                    this.getAllRubricItems(finalURL, true)
                    this.setState({
                        modifyVisible: false,
                    });
                    message.success('Criterion Updated')
                } else {
                    message.error(response.data.message)
                }
            }
        ).catch(error =>{console.log(error)})

    };

    onModifyFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

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
                        <HeaderBar/>
                    </Header>
                    <Content style={{margin: '16px 16px'}}>

                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {this.props.location.state.admin=== 1 || this.props.location.state.coordinator===1 ?
                                <Row justify="space-around" align="middle">
                                    <Col span={20}>
                                        <Title level={2}>Criteria</Title>
                                    </Col>
                                    <Col span={4}>
                                        {this.props.location.state.projectId === undefined ?
                                            <Dropdown overlay={this.menu} trigger={['click']}>
                                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                    <Button type="primary" shape="round" icon={<PlusOutlined/>}>
                                                        Add Criteria
                                                    </Button>
                                                </a>
                                            </Dropdown>:
                                            <Button type="primary" shape="round" icon={<PlusOutlined/>} onClick={this.showMoveStudentDrawer}>
                                                Add Student to Project
                                            </Button>
                                        }
                                    </Col>
                                    <Modal title="Upload CSV File to Batch Add" visible={this.state.modalVisible} onOk={this.handleOk}
                                           onCancel={this.handleCancel}>
                                        <Upload {...uploadState}>
                                            <Button icon={<UploadOutlined />}>Select a CSV File</Button>
                                        </Upload>
                                    </Modal>
                                    <Col span={5} >
                                        <Search
                                            placeholder="input criteria or category"
                                            allowClear
                                            enterButton="Search"
                                            size="large"
                                            onSearch={this.onSearch}
                                        />
                                    </Col>
                                </Row>:
                                <Row justify="space-around" align="middle">
                                    <Col span={24}>
                                        <Title level={2}>Project</Title>
                                    </Col>
                                </Row>
                            }
                            <Drawer
                                title="Create a new criterion"
                                width={720}
                                onClose={this.onClose}
                                visible={this.state.visible}
                                bodyStyle={{ paddingBottom: 80 }}
                                destroyOnClose={true}>
                                <Form
                                    onFinish={this.onFinish}
                                    onFinishFailed={this.onFinishFailed}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="name"
                                                label="Criterion"
                                                rules={[{ required: true, message: 'Please enter criterion name' }]}
                                            >
                                                <Input placeholder="Please enter criterion name" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.List name="subitemList">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                        <Form.Item
                                                            {...restField}
                                                            label="Category Name"
                                                            name={[name, 'subitem']}
                                                            rules={[{ required: true, message: 'Missing category name' }]}
                                                        >
                                                            <Input placeholder="Category Name" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            label="Comment"
                                                        >
                                                            <Form.List
                                                                name={[name, 'commentList']}
                                                            >
                                                                {(fields, { add, remove }) => (
                                                                    <>
                                                                        {fields.map((field, index) => (
                                                                            <Form.Item
                                                                                //{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                                                                //label={index === 0 ? 'Comments' : ''}
                                                                                required={false}
                                                                                key={field.key}
                                                                            >
                                                                                <Form.Item
                                                                                    {...field}
                                                                                    rules={[
                                                                                        {
                                                                                            whitespace: true,
                                                                                            message: "Please input comment or delete this field.",
                                                                                        },
                                                                                    ]}
                                                                                    name={[index, 'content']}
                                                                                    noStyle
                                                                                >
                                                                                    <Input placeholder="comment" style={{ width: '100%' }} />
                                                                                </Form.Item>
                                                                                <Form.Item
                                                                                    name={[index, 'level']}>
                                                                                    <Select options={this.comment_level} placeholder="level"></Select>
                                                                                </Form.Item>
                                                                                {fields.length > 1 ? (
                                                                                    <MinusCircleOutlined
                                                                                        className="dynamic-delete-button"
                                                                                        onClick={() => remove(field.name)}
                                                                                    />
                                                                                ) : null}
                                                                            </Form.Item>
                                                                        ))}
                                                                        <Form.Item>
                                                                            <Button
                                                                                type="dashed"
                                                                                onClick={() => add()}
                                                                                style={{ width: '100%' }}
                                                                                icon={<PlusOutlined />}
                                                                            >
                                                                                Add comment
                                                                            </Button>
                                                                        </Form.Item>
                                                                    </>
                                                                )}
                                                            </Form.List>
                                                            <MinusCircleFilled onClick={() => remove(name)} />
                                                        </Form.Item>
                                                    </Space>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                        Add criteria category
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
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
                                title="Modify criterion"
                                width={720}
                                onClose={this.onModifyDrawerClose}
                                visible={this.state.modifyVisible}
                                bodyStyle={{ paddingBottom: 80 }}
                                destroyOnClose={true}>
                                <Form
                                    onFinish={this.onModifyFinish}
                                    onFinishFailed={this.onModifyFinishFailed}
                                initialValues={{name: this.state.rubricItemName,}}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="name"
                                                label="Criterion"
                                                rules={[{ required: true, message: 'Please enter criterion name' }]}
                                            >
                                                <Input placeholder="Please enter criterion name" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={16}>
                                        <Col>
                                            <h4>Previous Settings</h4>
                                        </Col>
                                    </Row>
                                    {this.state.rubricSubitems.map(subitem=>{
                                        console.log("subitems:")
                                        console.log(subitem)
                                        return(
                                            <Space direction="horizontal" style={{display: 'flex'}}
                                                   key={subitem.name + 'item'}
                                            >
                                                <Row gutter={16}>
                                                    <Col flex={2}>
                                                        <Form.Item
                                                            name={subitem.name}
                                                            label="Category Name"
                                                            >
                                                            <Input defaultValue={subitem.name}
                                                                    disabled={true}></Input>
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
                                    <Form.List name="subitemList">
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                        <Form.Item
                                                            {...restField}
                                                            label="Category Name"
                                                            name={[name, 'subitem']}
                                                            rules={[{ required: true, message: 'Missing category name' }]}
                                                        >
                                                            <Input placeholder="Category Name" />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            label="Comment"
                                                        >
                                                            <Form.List
                                                                name={[name, 'commentList']}
                                                            >
                                                                {(fields, { add, remove }) => (
                                                                    <>
                                                                        {fields.map((field, index) => (
                                                                            <Form.Item
                                                                                //{...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                                                                //label={index === 0 ? 'Comments' : ''}
                                                                                required={false}
                                                                                key={field.key}
                                                                            >
                                                                                <Form.Item
                                                                                    {...field}
                                                                                    rules={[
                                                                                        {
                                                                                            whitespace: true,
                                                                                            message: "Please input comment or delete this field.",
                                                                                        },
                                                                                    ]}
                                                                                    name={[index, 'content']}
                                                                                    noStyle
                                                                                >
                                                                                    <Input placeholder="comment" style={{ width: '100%' }} />
                                                                                </Form.Item>
                                                                                <Form.Item
                                                                                    name={[index, 'level']}>
                                                                                    <Select options={this.comment_level} placeholder="level"></Select>
                                                                                </Form.Item>
                                                                                {fields.length > 1 ? (
                                                                                    <MinusCircleOutlined
                                                                                        className="dynamic-delete-button"
                                                                                        onClick={() => remove(field.name)}
                                                                                    />
                                                                                ) : null}
                                                                            </Form.Item>
                                                                        ))}
                                                                        <Form.Item>
                                                                            <Button
                                                                                type="dashed"
                                                                                onClick={() => add()}
                                                                                style={{ width: '100%' }}
                                                                                icon={<PlusOutlined />}
                                                                            >
                                                                                Add comment
                                                                            </Button>
                                                                        </Form.Item>
                                                                    </>
                                                                )}
                                                            </Form.List>
                                                            <MinusCircleFilled onClick={() => remove(name)} />
                                                        </Form.Item>
                                                    </Space>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                        Add criteria category
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
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
                                title="View criterion"
                                width={720}
                                onClose={this.onViewDrawerClose}
                                visible={this.state.viewVisible}
                                bodyStyle={{ paddingBottom: 80 }}
                                destroyOnClose={true}>
                                <Form
                                    initialValues={{name: this.state.rubricItemName,}}>
                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <Form.Item
                                                name="name"
                                                label="Criterion"
                                                rules={[{ required: true, message: 'Please enter criterion name' }]}
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {this.state.rubricSubitems.map(subitem=>{
                                        console.log("subitems:")
                                        console.log(subitem)
                                        return(
                                            <Space direction="horizontal" style={{display: 'flex'}}
                                                   key={subitem.name + 'item'}
                                            >
                                                <Row gutter={16}>
                                                    <Col flex={2}>
                                                        <Form.Item
                                                            name={subitem.name}
                                                            label="Category Name"
                                                        >
                                                            <Input defaultValue={subitem.name}
                                                                   disabled={true}></Input>
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
                            <Table columns={this.columns} dataSource={this.state.rubricItems}/>
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>Fast Feedback</Footer>
                </Layout>
            </Layout>
        );
    }
}

export default RubricItem;