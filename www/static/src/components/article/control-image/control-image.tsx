import * as React from 'react';
import { Input, Upload, Button, message } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';

interface ACImageProps {
    imageUrl: string;
    handleImageChange: (e: string) => void;
}

class ArticleControlImage extends React.Component<ACImageProps, any> {
    constructor(props: any) {
        super(props);
    }

    handleChange = (info: UploadChangeParam, type: 'logo' | 'favicon' | 'header') => {
        if (info.file.status === 'done') {
            this.handleFile(info, type);
        }
    };

    handleFile = (fileInfo: UploadChangeParam, type: 'logo' | 'favicon' | 'header') => {
        if (fileInfo.file.response.errno !== 0) {
            message.error(fileInfo.file.response.errmsg);
        } else {
            const url = fileInfo.file.response.data;
            this.props.handleImageChange(url);
        }
    };

    render() {
        const imageUrl = this.props.imageUrl;

        return (
            <>
                <Upload
                    name="file"
                    accept=""
                    className="avatar-uploader"
                    showUploadList={false}
                    style={{ width: 160, height: 40 }}
                    action="/admin/api/file"
                    onChange={(e) => this.handleChange(e, 'logo')}
                >
                    <Button>Upload</Button>
                </Upload>
                <Input
                    value={this.props.imageUrl}
                    onChange={(e) => this.props.handleImageChange(e.target.value)}
                    placeholder="请输入图片链接"
                />
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        title={imageUrl}
                        className="img-thumbnail featured-image"
                        onClick={() => window.open(imageUrl, '_blank')}
                    />
                ) : null}
            </>
        );
    }
}

export default ArticleControlImage;
