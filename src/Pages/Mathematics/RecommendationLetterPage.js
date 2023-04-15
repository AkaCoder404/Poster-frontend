// This page is for professor to upload recommendation letter
import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Form, Input, Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './RecommendationLetterPage.css';

const { Dragger } = Upload;

function RecommendationLetterPage() {
    const location = useLocation();
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState([]);
    const [formData, setFormData] = React.useState(new FormData());

    // TODO: Get name of applicant from url

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        console.log("Url Params: ", searchParams.get('uuid'));
    }, [location.search]);


    // TODO: Handle file upload
    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onRemove = (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    };

    const beforeUpload = (file) => {
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

    // TODO: Submit form to backend
    const onFinish = (values) => {
        console.log('Success:', values);
        formData.append('name', values.name);
        formData.append('email', values.email);
        for (let i = 0; i < fileList.length; i++) {
            formData.append('file', fileList[i].originFileObj);
        }
        setFormData(formData);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="RecommendationLetterPage">
            <div className="RecommendationLetterPage__content">
                <div className='RecommendationLetterPage__title'> Recommendation Letter  </div>
                <div className='RecommendationLetterPage__subtitle'> Please upload your recommendation letter for the applicant for the Poster Session held by the International Congress of Basic Science. </div>
                <div className='RecommendationLetterPage__form'>
                    <Form
                        form={form}
                        name="basic"
                        layout='vertical'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item label="Applicant UUID" name="uuid">
                            <Input disabled placeholder={"UUID"}/>
                        </Form.Item>
                        <Form.Item label="Applicant Name" name="applicantname">
                            <Input disabled placeholder={"Applicant Name"}/>
                        </Form.Item>
                        <Form.Item label="Full Name" name="name"
                            rules={[{ required: true, message: 'Please input your username!', },]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Email" name="email"
                            rules={[{ required: true, message: 'Please input a valid email!', type: "email" },]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Recommendation Letter" name="recommendationLetter">
                            <Dragger
                                name="file"
                                fileList={fileList}
                                multiple={true}
                                maxCount={1}
                                onChange={onChange}
                                onRemove={onRemove}
                                beforeUpload={beforeUpload}
                            >

                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                {/* <p className="ant-upload-hint">
                                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                    banned files.
                                </p> */}
                            </Dragger>
                        </Form.Item>
                    </Form>
                </div>
                <div className='RecommendationLetterPage__button'>
                    <Button className="RecommendationLetterPage__submitButton"
                        onClick={() => form.submit()}
                        htmlType="submit"
                        type='primary'
                    > Submit </Button>
                </div>
            </div>
        </div>
    );
}
export default RecommendationLetterPage;