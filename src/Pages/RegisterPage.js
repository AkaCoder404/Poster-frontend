import { Button, Steps, Form, Input, Select, Radio, Upload, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './RegisterPage.css';


const { Option } = Select;
// const { Dragger } = Upload;
const formData = new FormData();
function RegisterPage() {
    const [form] = Form.useForm();
    const formRef = React.useRef(null);
    const [fileList, setFileList] = useState([]);
    // const [formData, setFormData] = useState(new FormData());
    const [current, setCurrent] = useState(0);


    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };

    useEffect(() => {
        console.log("Page Loaded");
        const searchParams = new URLSearchParams(window.location.search);
        console.log("Url Params: ", searchParams);
    }, []);

    const onFinish = (values) => {
        // console.log('Success:', values);
        // if ('fullname' in values) console.log(values.fullname);
        // if ('chinesename' in values) console.log(values.chinesename);
        // if ('email' in values) console.log(values.email);
        // if ('phone' in values) console.log(values.phone);
        // if ('institution' in values) console.log(values.institution);
        // if ('publication' in values) console.log(values.publications);
        // if ('poster' in values) console.log(values.poster);

        // TODO: Check if formData already has the key, if so, delete it
        if ('fullname' in values) {
            if (formData.has('fullname')) {
                formData.delete('fullname');
            }
            formData.append('fullname', values.fullname);
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

        if ('phone' in values) {
            if (formData.has('phone')) {
                formData.delete('phone');
            }
            formData.append('phone', values.phone);
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

        // 
        if (current !== 3) {
            next();
            return;
        }

        console.log("Submitted Form...");
        for (let i = 0; i < fileList.length; i++) {
            formData.append('files', fileList[i].originFileObj);
            console.log(fileList[i].name);
        }

        console.log("submitted files count: ", fileList.length);

 
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
        // TODO: Send formData to backend
        handleSubmitForm();
    };

    let navigate = useNavigate();
    const handleSubmitForm = async () => {
        await axios.post('http://localhost:5000/api/register', formData).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });

        // TODO: Redirect to success page
        navigate('/success');
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onChange = (info) => {
        console.log("onChange", fileList);
        setFileList([...info.fileList]);

        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        //   }
        //   if (info.file.status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully`);
        //   } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        // }
    }

    const onRemove = (file) => {
        console.log("Removed file: " + file.name);
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    }

    const beforeUpload = (file) => {
        // console.log("beforeUpload", file);
        // Test if file is pdf or docx
        const regex = new RegExp(/^.+\.(pdf|doc|docx)$/);
        var correctFormat = regex.test(file.name);
        var correctSize = file.size < 10000000;

        // Return a promise
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
            return correctFormat && correctSize;
        });

    }


    const steps = [
        {
            // title: 'First',
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
                        <Form.Item label="Full Name" name="fullname"
                            rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="Chinese Name" name="chinesename"
                            rules={[{ required: true, message: 'Please input your chinese name!', },]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="Email" name="email"
                            rules={[{ required: true, message: 'Please input your email!', type: "email" },]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item label="Phone Number" name="number"
                            rules={[{ required: true, message: 'Please input your phone number!' },]}
                        >
                            <Input size="large" />
                        </Form.Item>
                        <Form.Item >
                            <Button size="large" className="RegisterPage-rightColumn-form-continueButton" htmlType="Continue">
                                Continue
                            </Button>
                        </Form.Item>
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
                                // onChange={onGenderChange}
                                size="large"
                                // lineHeight="120px"
                                allowClear
                            >
                                <Option value="combinatorics">Combinatorics</Option>
                                <Option value="discrete-geometry">Discrete Geometry</Option>
                                <Option value="graph-theory">Graph theory</Option>
                                <Option value="mathematical-logic">Mathematical Logic</Option>
                                <Option value="foundations-and-category-theory">Foundations and Category Theory</Option>
                                <Option value="number-theory">Number Theory</Option>
                                <Option value="commutative-algebra-and-algebraic-geometry">Commutative Algebra and Algebraic Geometry</Option>
                                <Option value="homological-algebra">Homological Algebra</Option>
                                <Option value="k-theory-and-noncommutative-algebra">K-Theory and Noncommutative Algebra</Option>
                                <Option value="one-and-several-complex-variables">One and Several Complex variables</Option>
                                <Option value="complex-dynamical-syste">Complex Dynamical Syste</Option>
                                <Option value="ordinary-differential-equations-and-special-functions">Ordinary Differential Equations and Special Functions</Option>
                                <Option value="d-module">D Module</Option>
                                <Option value="partial-differential-equations">Partial Differential Equations</Option>
                                <Option value="dynamics-systems">Dynamics Systems</Option>
                                <Option value="ergodic-theory-and-diophantine-approximation">Ergodic Theory and Diophantine Approximation</Option>
                                <Option value="fourier-analysis-and-harmonic-analysis">Fourier Analysis and Harmonic Analysis</Option>
                                <Option value="functional-analysis-and-operator-theory">Functional Analysis and Operator Theory</Option>
                                <Option value="calculus-of-variations-and-optimal-control">Calculus of Variations and Optimal Control</Option>
                                <Option value="general-relativity">General Relativity</Option>
                                <Option value="geometric-analysis">Geometric Analysis</Option>
                                <Option value="algebraic-and-geometric-topology">Algebraic and Geometric Topology</Option>
                                <Option value="symplectic-and-differential-topology">Symplectic and Differential Topology</Option>
                                <Option value="probability-theory-and-stochastic-processes">Probability Theory and Stochastic Processes</Option>
                                <Option value="statistics">Statistics</Option>
                                <Option value="numerical-analysis-and-scientific-computation">Numerical Analysis and Scientific Computation</Option>
                                <Option value="differential-geometry">Differential Geometry</Option>
                                <Option value="lie-theory-and-representation-theory">Lie Theory and Representation Theory</Option>
                                <Option value="mathematics-of-string-theory-and-condensed-matter">Mathematics of String Theory and Condensed Matter</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
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
                        </Form.Item>
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
                    <Form.Item
                        label="CV and Publications"
                        name="publications"
                        rules={[{ required: true, message: 'Please upload your CV and publications!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Recommendation Letters"
                        name="recommendations"
                        rules={[{ required: true, message: 'Please input your recommendation letters!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label="Recommendation Letters" name="letters" rules={[{ required: true, message: 'Please input your recommendation letters!' }]}
                    >
                        <Upload
                            name="file"
                            // showUploadList={false}
                            fileList={fileList}
                            multiple
                            beforeUpload={beforeUpload}
                            onChange={onChange}
                            onRemove={onRemove}
                        >
                            <Button>Select Files</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
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
                    </Form.Item>
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
                    <Form.Item
                        label="Poster"
                        name="poster"
                        rules={[{ required: true, message: 'Please input your publications' }]}
                    >
                        <Input />
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

                    <Form.Item>
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
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        }
    ];


    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));

    return (
        <div className="RegisterPage">
            <div className="RegisterPage-leftColumn">
                <div className="RegisterPage-leftColumn-box">
                    <div className="RegisterPage-leftColumn-title"> POSTER SESSION </div>
                    <div className="RegisterPage-leftColumn-text"> This is an opportunity for worldwide outstanding undergraduate and graduate students to display and introduce their recent works, to communicate and discuss with various fields of mathematicians and scholars.  </div>
                    <div className="RegisterPage-leftColumn-innerBox">  </div>
                </div>
            </div>
            <div className="RegisterPage-rightColumn">
                <div className="RegisterPage-rightColumn-box">
                    <div className="RegisterPage-rightColumn-title"> Applications </div>
                    <div className="RegisterPage-rightColumn-subtitle"> Please fill in the following information </div>
                    <div className="RegisterPage-rightColumn-application">
                        {steps[current].content}
                    </div>
                    {/* <div className="RegisterPage-rightColumn-form-buttons">
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
                                onClick={onSubmit} htmlType="submit">
                                Continue
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button className="RegisterPage-rightColumn-form-completeButton" onClick={onSubmit} htmlType="submit">
                                Done
                            </Button>
                        )}
                    </div> */}
                    <Steps className="RegisterPage-steps"
                        progressDot
                        // description={false}
                        current={current}
                        items={items} />
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;