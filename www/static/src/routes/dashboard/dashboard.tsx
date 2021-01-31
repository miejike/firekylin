import * as React from 'react';
import './dashboard.less';
import { observer, inject } from 'mobx-react';
import { DashBoardProps } from './dashboard.model';
import BreadCrumb from '../../components/breadcrumb';
import { NavLink } from 'react-router-dom';
import * as moment from 'moment';
import { Modal } from 'antd';
import { Subscription } from 'rxjs';
const confirm = Modal.confirm;

const UPDATE_STEPS = [
    [1, '正在下载 Firekylin 最新版本...', 'Firekylin 下载成功！'],
    [2, '正在解压更新文件...', '文件更新成功！'],
    [3, '正在重新安装依赖...', '依赖安装成功！'],
    [4, '正在重启程序...', '程序重启成功，将在 %d 秒后刷新页面！'],
];
const COUNT_DOWN = 3;
@inject('dashBoardStore', 'sharedStore')
@observer
class DashBoard extends React.Component<DashBoardProps, any> {
    updateSubscription$: Subscription;
    state = {
        posts: [],
        step: 1,
        downCount: COUNT_DOWN,
        showUpdate: false,
    };

    componentWillMount() {
        this.props.dashBoardStore.getSelectLast();
        this.props.dashBoardStore.getSystemInfo();
    }

    handleClick() {
        this.props.dashBoardStore.setPosts('hello');
    }

    renderUpdate() {
        return (
            <div
                className="modal fade in"
                style={{ display: this.state.showUpdate ? 'block' : 'none' }}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button
                                type="button"
                                onClick={() => {
                                    this.setState({ showUpdate: false });
                                    this.updateSubscription$.unsubscribe();
                                }}
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                            <h4 className="modal-title">在线更新</h4>
                        </div>
                        <div className="modal-body">
                            <div className="dialog-panel anim-modal ">
                                <a href="###" className="close-btn" />
                                <div className="dialog-content">
                                    <ul className="update-step">
                                        {UPDATE_STEPS.map((step) => (
                                            <li
                                                key={step[0]}
                                                className={
                                                    this.state.step >= step[0]
                                                        ? 'show'
                                                        : ''
                                                }
                                            >
                                                <i
                                                    className={
                                                        this.state.step > step[0]
                                                            ? 'success'
                                                            : ''
                                                    }
                                                >
                                                    {step[0]}
                                                </i>
                                                <div className="pipe">
                                                    <div className="half" />
                                                </div>
                                                <span className="loading">
                                                    {step[1]}
                                                </span>
                                                <span className="ok">
                                                    {(step[2] as string).replace(
                                                        '%d',
                                                        this.state.downCount.toString(),
                                                    )}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderUpdateConfirm() {
        confirm({
            title: '在线更新警告!',
            content:
                '在线更新会覆盖文件，请确认你已经备份好对程序的修改，如果没有修改请忽略该警告。',
            onOk: () => {
                this.setState({ showUpdate: true });
                this.updateSystem();
            },
        });
    }

    updateSystem() {
        this.updateSubscription$ = this.props.sharedStore
            .updateSystem(this.state.step)
            .subscribe((res) => {
                if (this.state.step <= UPDATE_STEPS.length) {
                    this.setState({ step: this.state.step + 1 }, () =>
                        this.updateSystem(),
                    );
                }
                if (this.state.step > UPDATE_STEPS.length) {
                    setTimeout(location.reload.bind(location), COUNT_DOWN * 1000);
                    setInterval(
                        () =>
                            this.setState({
                                downCount: Math.max(0, --this.state.downCount),
                            }),
                        1000,
                    );
                }
            });
    }

    render() {
        const links = [
            { url: '/post/create', title: '撰写新文章', type: 2 },
            { url: '/page/create', title: '创建页面', type: 1 },
            { url: '/appearance/theme', title: '更改外观', type: 1 },
            { url: '/options/general', title: '系统设置', type: 1 },
        ].filter((link) => link.type >= window.SysConfig.userInfo.type);

        const { versions, count } = this.props.dashBoardStore.systemInfo;
        const { posts } = this.props.dashBoardStore;

        return (
            <div className="fk-content-wrap">
                <BreadCrumb className="breadcrumb" {...this.props} />
                <div className="manage-container">
                    <div className="row">
                        <div className="col-md-5">
                            <h4>最近发布的文章</h4>
                            <ul>
                                {(posts as any[]).map((post) => (
                                    <li key={post.id}>
                                        <label>
                                            {moment(new Date(post.create_time)).format(
                                                'MM.DD',
                                            )}
                                            ：
                                        </label>
                                        <a
                                            href={`/post/${post.pathname}`}
                                            target="_blank"
                                        >
                                            {post.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-md-3">
                            <h4>系统概况</h4>
                            <ul>
                                <li>
                                    <label>服务器系统：</label>
                                    {versions.platform}
                                </li>
                                <li>
                                    <label>Node.js版本：</label>
                                    {versions.nodeVersion}
                                </li>
                                <li>
                                    <label>V8引擎版本：</label>
                                    {versions.v8Version}
                                </li>
                                <li>
                                    <label>MySQL版本：</label>
                                    {versions.mysqlVersion}
                                </li>
                                <li>
                                    <label>ThinkJS版本：</label>
                                    {versions.thinkjsVersion}
                                </li>
                                <li>
                                    <label>FireKylin版本：</label>
                                    {versions.firekylinVersion}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {this.renderUpdate()}
            </div>
        );
    }
}

export default DashBoard;
