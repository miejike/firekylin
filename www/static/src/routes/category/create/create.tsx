import * as React from 'react';
import BreadCrumb from '../../../components/breadcrumb';
import { Form, Input, Button, Select, Upload, Icon, message } from 'antd';
import { inject, observer } from 'mobx-react';
import { CategoryCreateProps } from './create.model';
import { UploadChangeParam } from 'antd/lib/upload';
const FormItem = Form.Item;
const Option = Select.Option;
@inject('categoryStore', 'sharedStore')
@observer
class CategoryCreateForm extends React.Component<CategoryCreateProps, {}> {
    options: {
        cover?: string
    };

    constructor(props: CategoryCreateProps) {
        super(props);

        this.options = {};
    }

    componentDidMount() {
        this.props.categoryStore.getRootCategory();
        if (this.props.match.params.id) {
            this.props.categoryStore.getCategoryInfoById(this.props.match.params.id);
        } else {
            this.setCategoryEmpty();
        }
    }

    componentWillReceiveProps(nextProps: CategoryCreateProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.setCategoryEmpty();
        }
    }

    // 置空Create列表
    setCategoryEmpty() {
        this.props.categoryStore.setCurrentCatInfo({
            id: 0,
            name: '',
            pathname: '',
            post_cate: 0,
            pid: 0
        });
    }

    handleChange = (info: UploadChangeParam) => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          this.setState({loading: false});
          this.handleFile(info);
        }
    }

    handleFile(fileInfo: UploadChangeParam) {
        if (fileInfo.file.response.errno !== 0) {
            message.error(fileInfo.file.response.errmsg);
        } else {
            const url = fileInfo.file.response.data;
            this.options.cover = url;
        }
    }

    beforeUpload(file: File) {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('图片必须小于5MB!');
        }
        return isLt5M;
    }

    handleSubmit = (e: React.FormEvent<any>) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { createCategory, updateCategory } = this.props.categoryStore;
                const id = this.props.match.params.id;
                if (id) {
                    updateCategory(id, Object.assign({}, values, {options: JSON.stringify(this.options)}))
                    .subscribe(
                        res => {
                            if (res.errno === 0) {
                                this.props.history.push('/cate/list');
                            }
                        }
                    );
                } else {
                    createCategory(Object.assign({}, values, {options: JSON.stringify(this.options)}))
                    .subscribe(
                        res => {
                            if (res.errno === 0) {
                                this.props.history.push('/cate/list');
                            }
                        }
                    );
                }
                
            }
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xl: { span: 2 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xl: { span: 8 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xl: {
                span: 16,
                offset: 2,
              }
            },
        };
        const uploadButton = (
            <div>
              <Icon type="plus" />
              <div className="ant-upload-text">Upload</div>
            </div>
        );
        
        const { rootCategoryList, categoryInfo } = this.props.categoryStore;
        return (
            <>
                <BreadCrumb className="breadcrumb" {...this.props} />
                <div className="page-create page-list">
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="分类名称"
                        >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '请填写分类名称',
                                }],
                                initialValue: categoryInfo ? categoryInfo.name : '',
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="缩略名"
                        >
                            {getFieldDecorator('pathname', {
                                initialValue: categoryInfo ? categoryInfo.pathname : ''
                            })(
                                <Input />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="封面图片"
                        >
                            <Upload
                                name="file"
                                listType="picture"
                                accept=""
                                action="/admin/api/file"
                                beforeUpload={this.beforeUpload}
                                onChange={e => this.handleChange(e)}
                            >
                                {uploadButton}
                            </Upload>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="父级分类"
                        >
                            {getFieldDecorator('pid', {
                                initialValue: categoryInfo ? categoryInfo.pid : 0
                            })(
                                <Select
                                    placeholder="请选择分类"
                                >
                                    <Option value={0}>不选择</Option>
                                    {rootCategoryList.map((category, key) => {
                                        return <Option key={(key + 1).toString()} value={category.id}>{category.name}</Option>;
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit">提交</Button>
                        </FormItem>
                    </Form>
                </div>
            </>
        );
    }
}
const CategoryCreate = Form.create()(CategoryCreateForm);
export default CategoryCreate;
