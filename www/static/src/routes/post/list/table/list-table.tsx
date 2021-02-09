import * as React from 'react';
import { Table, Button } from 'antd';
import './list-table.less';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import { PostListProps } from '../list.model';
import { TABLE_DELAY } from '../../../../config';

const confirm = Modal.confirm;

@inject('postStore')
@observer
class PostListTable extends React.Component<PostListProps, {}> {
    delete(id: number, force: boolean = false) {
        confirm({
            title: '提示',
            content: `确定${force ? '彻底' : ''}删除吗?`,
            onOk: () => {
                this.props.postStore.deletePostById(id, force);
            },
        });
    }

    cancel(id: number) {
        this.props.postStore.cancelPostById(id);
    }

    pass(id: number) {
        this.props.postStore.passPostById(id);
    }

    refuse(id: number) {
        this.props.postStore.refusePostById(id);
    }

    renderActions(post: any) {
        const status = this.props.postStore.plReqParams.status as string;
        if (status === '') {
            return (
                <>
                    <Button
                        onClick={() => this.props.history.push(`/post/edit/${post.id}`)}
                        type="primary"
                        icon="edit"
                        size="small"
                    >
                        编辑
                    </Button>
                    <Button
                        onClick={() => this.delete(post.id)}
                        style={{ marginLeft: 8 }}
                        type="danger"
                        icon="delete"
                        size="small"
                    >
                        删除
                    </Button>
                </>
            );
        } else if (status === '4') {
            return (
                <>
                    <Button
                        onClick={() => this.cancel(post.id)}
                        type="primary"
                        icon="edit"
                        size="small"
                    >
                        撤销
                    </Button>
                    <Button
                        onClick={() => this.delete(post.id, true)}
                        style={{ marginLeft: 8 }}
                        type="danger"
                        icon="delete"
                        size="small"
                    >
                        删除
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <Button
                        disabled={status === '3'}
                        type="primary"
                        onClick={() => this.pass(post.id)}
                        className="success-button"
                        icon="check"
                        size="small"
                    >
                        通过
                    </Button>
                    <Button
                        disabled={status === '2'}
                        onClick={() => this.refuse(post.id)}
                        style={{ marginLeft: 8 }}
                        type="danger"
                        icon="close"
                        size="small"
                    >
                        拒绝
                    </Button>
                </>
            );
        }
    }

    render() {
        const Column = Table.Column;
        const { postList, loading, pagination } = this.props.postStore;
        return (
            <Table
                dataSource={postList}
                loading={{ spinning: loading, delay: TABLE_DELAY }}
                pagination={pagination}
                onChange={(e) => {
                    this.props.postStore.setPlReqParams({
                        page: e.current,
                    });
                }}
            >
                <Column
                    title="标题"
                    key="title"
                    render={(post) => (
                        <>
                            <Link to={`/post/edit/${post.id}`}>{post.title}</Link>
                            {/* 当文章为公开且发布状态时渲染文章链接 */}
                            {post.status === 3 &&
                            post.is_public &&
                            post.cate.length > 0 ? (
                                <a
                                    href={`/${post.cate[0].pathname}/${post.id}`}
                                    target="_blank"
                                    className="admin-post-link"
                                >
                                    <span className="glyphicon glyphicon-link" />
                                </a>
                            ) : null}
                        </>
                    )}
                />
                <Column title="作者" dataIndex="author" key="author" />
                <Column title="状态" dataIndex="statusText" key="statusText" />
                <Column title="发布日期" dataIndex="create_time" key="create_time" />
                <Column
                    title="操作"
                    key="action"
                    render={(post) => this.renderActions(post)}
                />
            </Table>
        );
    }
}

export default PostListTable;
