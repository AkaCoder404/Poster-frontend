// eslint-disable-next-line no-unused-vars
import { Button, Steps, Form, Input, Select, Radio, Upload, Table, Popconfirm, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { FaQuoteLeft } from 'react-icons/fa';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import axios from 'axios';
import './RegisterPage.css';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);
    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };
    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({
                ...record,
                ...values,
            });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;
    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }
    return <td {...restProps}>{childNode}</td>;
};


const { Option } = Select;
const { Dragger } = Upload;
const formData = new FormData();
function RegisterPage() {
    const location = useLocation();
    const [uuid, setUuid] = useState('');
    const [form] = Form.useForm();
    const formRef = React.useRef(null);
    const [fileList, setFileList] = useState([]);
    const [publicationFileList, setPublicationFileList] = useState([]);
    const [publicationDefaultFileList, setPublicationDefaultFileList] = useState([]);
    const [recommendationFileList, setRecommendationFileList] = useState([]);
    const [posterFileList, setPosterFileList] = useState([]);
    const [posterDefaultFileList, setPosterDefaultFileList] = useState([]);
    const [studentcardFileList, setStudentcardFileList] = useState([]);
    const [studentcardDefaultFileList, setStudentcardDefaultFileList] = useState([]);

    // const [formData, setFormData] = useState(new FormData());
    const [current, setCurrent] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [submitLoading, setSubmitLoading] = useState(false);

    // Default recommendation letter files
    const [dataSource, setDataSource] = useState([
        {
            key: '0',
            name: 'Edward King 0',
            email: 'EdwardKing@gmail.com',
        },
        {
            key: '1',
            name: 'Edward King 1',
            email: 'EdwardKing2@gmail.com',
        },
    ]);

    const [count, setCount] = useState(2);
    const handleDelete = (key) => {
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
    };

    const handleSend = (key) => {
        const newData = dataSource.filter((item) => item.key === key);
        console.log(newData)
        // TODO: Send email to the professor
    }

    const defaultColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '40%',
            editable: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '30%',
        },
        {
            title: 'Action',
            dataIndex: 'operation',

            render: (_, record) =>
                dataSource.length >= 1 ? (
                    <>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <Button size="small" style={{ color: 'red', marginRight: "4px" }}> Delete </Button>
                        </Popconfirm>
                        <Popconfirm title="Sure to send?" onConfirm={() => handleSend(record.key)}>
                            <Button size="small" style={{ color: 'blue' }}> Send </Button>
                        </Popconfirm>
                    </>
                ) : null,
        },
    ];
    // eslint-disable-next-line no-unused-vars
    const handleAdd = () => {
        const newData = {
            key: count,
            name: `Professor ${count}`,
            email: 'email@gmail.com'
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };
    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
    };
    // eslint-disable-next-line no-unused-vars
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    // eslint-disable-next-line no-unused-vars
    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    // eslint-disable-next-line
    const loadData = async (uuid) => {
        // console.log("Loading data from backend");
        var data = { "id": uuid }

        await axios.post('/api/info/', data).then((response) => {
            if (response.data.code !== 0) {
                message.error(response.data.message);
                return;
            }
            message.success("Data loaded successfully");
            console.log(response.data.data);

            // TODO: Set form data
            form.setFieldsValue({ "familyName": response.data.data.familyName });
            form.setFieldsValue({ "firstName": response.data.data.firstName });
            form.setFieldsValue({ "chinesename": response.data.data.chinesename });
            form.setFieldsValue({ "email": response.data.data.email });
            form.setFieldsValue({ "number": response.data.data.number });
            form.setFieldsValue({ "institution": response.data.data.institution });
            form.setFieldsValue({ "title": response.data.data.title });
            form.setFieldsValue({ "research": response.data.data.research });
            form.setFieldsValue({ "professorname": response.data.data.professorname });
            form.setFieldsValue({ "professoremail": response.data.data.professoremail });

            // console.log(response.data.data.publication_files.split('/')[response.data.data.publication_files.split('/').length - 1])
            // console.log(response.data.data.poster_files.split('/')[response.data.data.poster_files.split('/').length - 1])
            // TODO: Set file list

            const defaultPublicationFileList = [
                {
                    uid: "0",
                    name: response.data.data.publication_files.split('/')[response.data.data.publication_files.split('/').length - 1],
                    status: 'done',
                    response: "",
                    url: response.data.data.publication_files
                }
            ];
            setPublicationDefaultFileList(defaultPublicationFileList);
            setPublicationFileList(defaultPublicationFileList);

            const defaultPosterFileList = [
                {
                    uid: "0",
                    name: response.data.data.poster_files.split('/')[response.data.data.poster_files.split('/').length - 1],
                    status: 'done',
                    response: "",
                    url: response.data.data.poster_files
                }
            ];
            setPosterDefaultFileList(defaultPosterFileList);
            setPosterFileList(defaultPosterFileList);

            const defaultStudentcardFileList = [
                {
                    uid: "0",
                    name: response.data.data.studentcard_files.split('/')[response.data.data.studentcard_files.split('/').length - 1],
                    status: 'done',
                    response: "",
                    url: response.data.data.studentcard_files
                }
            ];
            setStudentcardDefaultFileList(defaultStudentcardFileList);
            setStudentcardFileList(defaultStudentcardFileList);

        }).catch((error) => {
            console.log(error);
        });
    }

    // eslint-disable-next-line
    useEffect(() => {
        // console.log("Page Loaded");
        const searchParams = new URLSearchParams(location.search);
        // console.log("Url Params: ", searchParams.get('uuid'));

        // TODO: Check if uuid is valid
        if (searchParams.get('uuid') !== null && dataLoaded === false) {
            setDataLoaded(true);
            setUuid(searchParams.get('uuid'));
            loadData(searchParams.get('uuid'));
        } else {
            // console.log("Invalid uuid");
        }

        // TODO: Load previously submitted data from backend

        // TODO: Disable form fields if data is already submitted

        // TODO: Set publicationFileList, recommendationFileList, posterFileList
    }, [location.search, dataLoaded, loadData]);



    const onFinish = (values) => {
        // Add ID
        if (!formData.has('id')) {
            formData.append('id', uuid);
        }

        // Check if formData already has the key, if so, delete it
        if ('familyName' in values) {
            if (formData.has('familyName')) {
                formData.delete('familyName');
            }
            formData.append('familyName', values.familyName);
        }


        if ('firstName' in values) {
            if (formData.has('firstName')) {
                formData.delete('firstName');
            }
            formData.append('firstName', values.firstName);
        }

        if ('chinesename' in values) {
            if (formData.has('chinesename')) {
                formData.delete('chinesename');
            }
            formData.append('chinesename', values.chinesename);
        }



        if ('email' in values) {
            if (formData.has('email')) {
                formData.delete('email');
            }
            formData.append('email', values.email);
        }

        if ('number' in values) {
            if (formData.has('number')) {
                formData.delete('number');
            }
            formData.append('number', values.number);
        }

        if ('institution' in values) {
            if (formData.has('institution')) {
                formData.delete('institution');
            }
            formData.append('institution', values.institution);
        }

        if ('title' in values) {
            if (formData.has('title')) {
                formData.delete('title');
            }
            formData.append('title', values.title);
        }

        if ('research' in values) {
            if (formData.has('research')) {
                formData.delete('research');
            }
            formData.append('research', values.research);
        }

        if ('professorname' in values) {
            if (formData.has('professorname')) {
                formData.delete('professorname');
            }
            formData.append('professorname', values.professorname);
        }

        if ('professoremail' in values) {
            if (formData.has('professoremail')) {
                formData.delete('professoremail');
            }
            formData.append('professoremail', values.professoremail);
        }

        // 
        if (current !== 3) {
            next();
            return;
        }

        console.log("Submitted Form...");
        // Append files to formData
        for (let i = 0; i < fileList.length; i++) {
            formData.append('files', fileList[i].originFileObj);
            console.log(fileList[i].name);
        }
        // console.log("submitted files count: ", fileList.length);


        // Append publication files to formData
        for (let i = 0; i < publicationFileList.length; i++) {
            formData.append('publication_files', publicationFileList[i].originFileObj);
        }

        // Append recommendation files to formData
        for (let i = 0; i < recommendationFileList.length; i++) {
            formData.append('recommendation_files', recommendationFileList[i].originFileObj);
        }

        // Append poster files to formData
        for (let i = 0; i < posterFileList.length; i++) {
            formData.append('poster_files', posterFileList[i].originFileObj);
        }

        // Append studentcard files to formData
        for (let i = 0; i < studentcardFileList.length; i++) {
            formData.append('studentcard_files', studentcardFileList[i].originFileObj);
        }

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
        // TODO: Send formData to backend
        handleSubmitForm();
    };

    let navigate = useNavigate();

    // eslint-disable-next-line
    const config = {
        maxBodyLength: Infinity,
        withCredentials: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'multipart/form-data',
        },

    };

    const handleSubmitForm = async () => {
        setSubmitLoading(true);
        await axios.post('/api/upload/', formData).then((response) => {

            if (response.data.code !== 0) {
                setSubmitLoading(false);
                message.error(response.data.message);
                return;
            }
            console.log(response);
            var uuid = response.data.uuid;

            // TODO: Redirect to success page
            setSubmitLoading(false);
            navigate("/postersession/success?uuid=" + uuid);
        }).catch((error) => {
            setSubmitLoading(false);
            message.error("Failed to submit form");
            console.log(error);
        });
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // const onChange = (info) => {
    //     console.log("onChange", fileList);
    //     setFileList([...info.fileList]);
    // }

    // const onRemove = (file) => {
    //     console.log("Removed file: " + file.name);
    //     const index = fileList.indexOf(file);
    //     const newFileList = fileList.slice();
    //     newFileList.splice(index, 1);
    //     setFileList(newFileList);
    // }

    const onPublicationChange = (info) => {
        console.log("onPublicationChange", fileList);
        setPublicationFileList([...info.fileList]);
    }

    // eslint-disable-next-line
    const onRecommendationChange = (info) => {
        console.log("onRecommdationChange", fileList);
        setRecommendationFileList([...info.fileList]);
    }

    // eslint-disable-next-line
    const onPublicationDownload = (file) => {
        console.log("Download file: " + file.name);
    }

    const onStudentcardChange = (info) => {
        console.log("onStudentcardChange", fileList);
        setStudentcardFileList([...info.fileList]);
    }

    // eslint-disable-next-line
    const onStudentcardDownload = (file) => {
        console.log("Download file: " + file.name);
    }

    const onStudentcardRemove = (file) => {
        console.log("Removed file: " + file.name);
        const index = studentcardFileList.indexOf(file);
        const newFileList = studentcardFileList.slice();
        newFileList.splice(index, 1);
        setStudentcardFileList(newFileList);
    }

    // eslint-disable-next-line
    const onPosterChange = (info) => {
        // console.log("onPosterChange", fileList);
        setPosterFileList([...info.fileList]);
    }

    const onPublicationRemove = (file) => {
        console.log("Removed file: " + file.name);
    }

    // eslint-disable-next-line
    const onRecommendationRemove = (file) => {
        // console.log("Removed file: " + file.name);
        const index = recommendationFileList.indexOf(file);
        const newFileList = recommendationFileList.slice();
        newFileList.splice(index, 1);
        setRecommendationFileList(newFileList);
    }

    // eslint-disable-next-line
    const onPosterRemove = (file) => {
        // console.log("Removed file: " + file.name);
        const index = posterFileList.indexOf(file);
        const newFileList = posterFileList.slice();
        newFileList.splice(index, 1);
        setPosterFileList(newFileList);
    }

    const beforeUpload = (file) => {
        // console.log("beforeUpload", file);
        // Test if file is pdf or docx
        const regex = new RegExp(/^.+\.(pdf|doc|docx)$/);
        var correctFormat = regex.test(file.name);
        var correctSize = file.size < 10000000;

        // console.log("correctFormat: ", correctFormat);
        // console.log("correctSize: ", correctSize);

        // return false

        // Return a promise
        // eslint-disable-next-line
        return new Promise((resolve, reject) => {
            if (!correctFormat) {
                setFileList((state) => [...state]);
                message.warning(`${file.name} is not a pdf or docx file`);
                return false;
            } else { // Test if file size is less than 10MB
                if (!correctSize) {
                    message.warning(`${file.name} is too large`);
                }
            }
            resolve();
            // return correctFormat && correctSize;
            return false;
        });

        // eslint-disable-next-line
        return false;
    }

    const beforeUploadStudentcard = (file) => {
        // console.log("beforeUploadStudentcard", file);
         const regex = new RegExp(/^.+\.(pdf|png|jpeg)$/);
         var correctFormat = regex.test(file.name);
         var correctSize = file.size < 10000000;

         // return false
 
         // Return a promise
         // eslint-disable-next-line
         return new Promise((resolve, reject) => {
             if (!correctFormat) {
                 setFileList((state) => [...state]);
                 message.warning(`${file.name} is not PNG/JPEG/PDF file`);
                 return false;
             } else { // Test if file size is less than 10MB
                 if (!correctSize) {
                     message.warning(`${file.name} is too large`);
                 }
             }
             resolve();
             // return correctFormat && correctSize;
             return false;
         });
 
         // eslint-disable-next-line
         return false;
    }

    const steps = [
        {
            content: <>
                <div className="form1">
                    <Form
                        form={form}
                        ref={formRef}
                        layout="vertical"
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item label="Family Name" name="familyName"
                            rules={[{ required: true, message: 'Please input your family name!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="First Name" name="firstName"
                            rules={[{ required: true, message: 'Please input your first name!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="Chinese Name" name="chinesename"
                            rules={[{ required: true, message: 'Please input your chinese name!', },]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <div className="RegisterPage-rightColumn-form-callout">
                            <div className="callout-col">
                                <div className="callout-icon"> <ExclamationCircleOutlined /> </div>
                                <div className="callout-text"> Please fill "none" if not applicable </div>
                            </div>
                        </div>

                        <Form.Item label="Email" name="email"
                            rules={[{ required: true, message: 'Please input a valid email!', type: "email" },]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="number"
                            rules={[{ required: true, message: 'Please input your phone number!' },]}
                        >
                            <Input size="large" />
                        </Form.Item>
                        {/* <Form.Item >
                            <Button size="large" className="RegisterPage-rightColumn-form-continueButton" htmlType="Continue">
                                Continue
                            </Button>
                        </Form.Item> */}
                    </Form>
                </div>
            </>
        },
        {
            // title: 'Second',
            content: <>
                <div className="form2">
                    <Form
                        form={form}
                        ref={formRef}
                        layout="vertical"
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Institution" name="institution"
                            rules={[{ required: true, message: 'Please input your institution!', },]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="Title / Appellation" name="title" rules={[{ required: true, message: 'Please select your title!', },]}>
                            <Radio.Group size="large" style={{ width: "100%" }} >
                                <Radio value="undegraduate" size="large"
                                    style={{ border: "1px solid #D9D9D9", borderRadius: "5px", width: "46%", marginRight: "6%", paddingBottom: "15px", paddingTop: "15px", paddingLeft: "10px" }}
                                > Undegraduate </Radio>
                                <Radio value="postgraduate" size="large"
                                    style={{ border: "1px solid #D9D9D9", borderRadius: "5px", width: "46%", paddingBottom: "15px", paddingTop: "15px", paddingLeft: "10px" }}
                                > Postgraduate </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="research"
                            label="Research Area"
                            rules={[{ required: true, message: 'Please select your research area!', },]}
                        >
                            <Select
                                placeholder="Select your research area"
                                size="large"
                                allowClear
                            >
                                <Option value="0">Combinatorics, Discrete Geometry, and Graph Theory </Option>
                                <Option value="1">Mathematical Logic, Foundations, and Category Theory</Option>
                                <Option value="2">Number Theory</Option>
                                <Option value="3">Communtative Algebra and Algebraic Geometry</Option>
                                <Option value="4">Homological Algebra, K-Theory, and Noncommutative Algebra</Option>
                                <Option value="5">One and Several Variables Complex Dynamical Systems</Option>
                                <Option value="6">Ordinary Differential Equations, Special Functions, and D-Module</Option>
                                <Option value="7">Partial Differential Equations</Option>
                                <Option value="8">Dynamics, Systems, Ergodic Theory and Diophantine Approximation</Option>
                                <Option value="9">Fourier Analysis and Harmonic Analysis</Option>
                                <Option value="10">Functional Analysis and Operator Theory</Option>
                                <Option value="11">Calculus of Variations and Optimal Control</Option>
                                <Option value="12">General Relativity</Option>
                                <Option value="13">Geometric Analysis</Option>
                                <Option value="14">Algebraic and Geometric Topology</Option>
                                <Option value="15">Symplectic and Differential Topology</Option>
                                <Option value="16">Probabiliy Theory and Stochasitc Processes</Option>
                                <Option value="17">Statistics</Option>
                                <Option value="18">Numerical Analysis and Scientific Computation</Option>
                                <Option value="19">Differential Geometry</Option>
                                <Option value="20">Lie Theory and Representation Theory</Option>
                                <Option value="21">Mathematics of String Theory and Condensed Matter</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Student Card" name="studentcard" rules={[{
                            required: true, message: 'Please upload the photo or scan of your student card', validator: (_, value) => {
                                if (studentcardFileList.length > 0) {
                                    return Promise.resolve();
                                } else {
                                    return Promise.reject('Please upload a pdf/png/jpeg file');
                                }
                            }
                        }]}>
                            <Dragger
                                name="file"
                                defaultFileList={studentcardDefaultFileList}
                                fileList={studentcardFileList}
                                beforeUpload={beforeUploadStudentcard}
                                onChange={onStudentcardChange}
                                onRemove={onStudentcardRemove}
                                maxCount={1}
                            >
                                <p className="Dragger-Text">Please upload a pdf/png/jpeg file</p>
                            </Dragger>
                        </Form.Item>

                        {/* <Form.Item>
                            <Button className="RegisterPage-rightColumn-form-previousButton"
                                style={{ width: "48%", marginRight: "4%", }}
                                htmlType="button"
                                onClick={() => prev()}>
                                Back
                            </Button>
                            <Button className="RegisterPage-rightColumn-form-continueButton"
                                type="primary"
                                style={{ width: "48%" }}
                                htmlType="Continue">
                                Continue
                            </Button>
                        </Form.Item> */}
                    </Form>
                </div>
            </>
        },
        {
            content: <div className="form3">
                <Form
                    form={form}
                    ref={formRef}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item label="CV and Publications" name="publications" rules={[{
                        required: true, message: 'Please upload your publications', validator: (_, value) => {
                            if (publicationFileList.length > 0) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject('Please upload an publication');
                            }
                        }
                    }]}
                    >
                        <Dragger
                            name="file"
                            defaultFileList={publicationDefaultFileList}
                            fileList={publicationFileList}
                            // multiple
                            beforeUpload={beforeUpload}
                            onChange={onPublicationChange}
                            onRemove={onPublicationRemove}
                            maxCount={1}
                        >
                            {/* <Button>Select Files</Button> */}
                            {/* <p className="Dragger-Icon"><InboxOutlined /></p> */}
                            <p className="Dragger-Text">Click or drag file to this area to upload</p>
                        </Dragger>
                    </Form.Item>
                    <div className="RegisterPage-rightColumn-form-callout">
                        <div className="callout-col">
                            <div className="callout-icon"> <ExclamationCircleOutlined /> </div>
                            <div className="callout-text"> Please upload only PDF or DOC/DOCX files. </div>
                        </div>
                    </div>
                    <Form.Item label="Name of Referee" name="professorname"
                        rules={[{ required: true, message: 'Please input referee name' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <Form.Item label="Email of Referee" name="professoremail"
                        rules={[{ required: true, message: 'Please input referee email', type: 'email' }]}
                    >
                        <Input size="large" />
                    </Form.Item>
                    <div className="RegisterPage-rightColumn-form-callout">
                        <div className="callout-col">
                            <div className="callout-icon"> <ExclamationCircleOutlined /> </div>
                            <div className="callout-text"> Only one recommendation letter is required. Please use the above email of the referee to send your recommendation letter to <a href="mailto:ifbs@tsinghua.edu.cn">ifbs@tsinghua.edu.cn</a> before 24:00, 9th April, 2023（Beijing Time） </div>
                        </div>
                    </div>
                    {/* <div className="RegisterPage-rightColumn-form-callout">
                        <div className="callout-col">
                            <div className="callout-icon"> <ExclamationCircleOutlined /> </div>
                            <div className="callout-text"> Please add at least two recommenders of relevent fields. </div>
                        </div>
                    </div> */}
                    {/* <Form.Item label="Recommendation Letters" name="recommendations">
                        <>
                            <Table
                                components={components}
                                rowClassName={() => 'editable-row'}
                                bordered
                                dataSource={dataSource}
                                columns={columns}
                                pagination={{ pageSize: 2 }}
                                size="small"
                                rows
                            />
                            <Button className="RegisterPage-rightColumn-form-addRecommenderButton"
                                onClick={handleAdd}
                                type="primary"
                                style={{
                                    marginBottom: 16,
                                }}
                            >
                                Add a recommender
                            </Button>
                        </>
                    </Form.Item> */}

                    {/* <Form.Item>
                        <Button className="RegisterPage-rightColumn-form-previousButton"
                            style={{ width: "48%", marginRight: "4%", }}
                            htmlType="button"
                            onClick={() => prev()}>
                            Back
                        </Button>
                        <Button className="RegisterPage-rightColumn-form-continueButton"
                            type="primary"
                            style={{ width: "48%" }}
                            htmlType="Continue">
                            Continue
                        </Button>
                    </Form.Item> */}
                </Form>
            </div>
        },
        {
            content: <div className="form4">
                <Form
                    form={form}
                    ref={formRef}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item label="Poster" name="posters" rules={[{
                        required: true, message: 'Please upload your poster', validator: (_, value) => {
                            if (posterFileList.length > 0) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject('Please upload an poster');
                            }
                        }
                    }]}
                    >
                        <Dragger
                            name="file"
                            defaultFileList={posterDefaultFileList}
                            fileList={posterFileList}
                            // multiple
                            beforeUpload={beforeUpload}
                            onChange={onPosterChange}
                            onRemove={onPosterRemove}
                            maxCount={1}
                        >
                            <p className="Dragger-Text">Click or drag file to this area to upload</p>
                        </Dragger>
                    </Form.Item>
                    <div className="RegisterPage-rightColumn-form-callout">
                        <div className="callout-icon"> <ExclamationCircleOutlined /> </div>
                        <div className="callout-text"> Please note application without Poster file or CV will be regarded as incomplete and will not be considered.
                        </div>
                    </div>

                    <div className="RegisterPage-rightColumn-form-callout">
                        <div className="callout-icon"> <ExclamationCircleOutlined /> </div>
                        <div className="callout-text"> Please complete all the required information before your submission, no change will be accepted once you submit.
                        </div>
                    </div>

                    {/* <Form.Item>
                        <Button className="RegisterPage-rightColumn-form-previousButton"
                            style={{ width: "48%", marginRight: "4%", }}
                            htmlType="button"
                            onClick={() => prev()}>
                            Back
                        </Button>
                        <Button className="RegisterPage-rightColumn-form-continueButton"
                            loading={submitLoading}
                            type="primary"
                            style={{ width: "48%" }}
                            htmlType="Continue">
                            Submit
                        </Button>
                    </Form.Item> */}
                </Form>
            </div>
        }
    ];

    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    const faQuoteLeftStyle = {
        color: "white",
        fontSize: "70px"
    }

    return (
        <div className="RegisterPage">
            <div className="RegisterPage-leftColumn">
                <div className="RegisterPage-leftColumn-box">
                    <div className="RegisterPage-leftColumn-title"> POSTER SESSION </div>
                    <div className="RegisterPage-leftColumn-text"> This is an opportunity for worldwide outstanding undergraduate and graduate students to display and introduce their recent works, to communicate and discuss with various fields of mathematicians and scholars.  </div>
                    <div className="RegisterPage-leftColumn-innerBox">

                        <div className="RegisterPage-leftColumn-innerBox-icon"> <FaQuoteLeft style={faQuoteLeftStyle} /> </div>
                        <div className="RegisterPage-leftColumn-innerBox-text"> This is a quote. </div>
                    </div>
                </div>
            </div>
            <div className="RegisterPage-rightColumn">
                <div className="RegisterPage-rightColumn-box">
                    <div className="RegisterPage-rightColumn-title"> Application </div>
                    <div className="RegisterPage-rightColumn-subtitle"> Please fill in the following information </div>
                    <div className="RegisterPage-rightColumn-application">
                        {steps[current].content}
                    </div>
                    <div className="RegisterPage-rightColumn-form-buttons">
                        {current > 0 && (
                            <Button className="RegisterPage-rightColumn-form-previousButton"
                                onClick={() => prev()}
                            >
                                Previous
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button className="RegisterPage-rightColumn-form-continueButton"
                                style={{ width: current === 0 ? "100%" : "48%" }}
                                onClick={() => form.submit()} htmlType="submit">
                                Continue
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button className="RegisterPage-rightColumn-form-completeButton"
                                loading={submitLoading}
                                onClick={() => form.submit()} htmlType="submit">
                                Submit
                            </Button>
                        )}
                    </div>
                    <div className="RegisterPage-steps-container">
                        <Steps className="RegisterPage-steps"
                            style={{}}
                            progressDot
                            responsive={false}
                            direction='horizontal'
                            // description={false}
                            current={current}
                            items={items} />
                    </div>

                </div>
            </div>
        </div>
    );
}
export default RegisterPage;