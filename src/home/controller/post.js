const fs = require('fs');
const path = require('path');
const Base = require('./base');

const stats = think.promisify(fs.stat);

module.exports = class extends (
    Base
) {
    /**
     * index action
     * @return {[type]} [description]
     */
    indexAction() {
        return this.listAction();
    }
    /**
     * post list
     * @return {Promise} []
     */
    async listAction() {
        // let model = this.model('post');
        // // 按栏目获取最新5篇内容
        // const lastPostListByCate = await model.getLastPostListByCate();
        // lastPostListByCate.forEach((cate) => {
        //     const { pathname, result } = cate;

        //     this.assign(`${pathname}_last`, result.data);
        // });
        let cateModel = this.model('cate');
        let postModel = this.model('post');
        let { id } = await cateModel.getCateByName('team');
        let teams = await postModel.getPostByCate(id);

        this.assign('teams', teams);
        return this.displayView('index');
    }
    /**
     * post detail
     * @return {[type]} [description]
     */
    async detailAction() {
        this.ctx.url = decodeURIComponent(this.ctx.url);
        let pathname = this.get('pathname');
        //列表页
        if (pathname === 'list') {
            return this.listAction();
        }

        let detail;
        //在线预览
        if (this.get('preview')) {
            try {
                let previewData = JSON.parse(this.post('previewData'));
                detail = await think
                    .model('post', null, 'admin')
                    .getContentAndSummary(previewData);
            } catch (e) {
                // Ignore JSON parse error
            }
        }

        detail = detail || (await this.model('post').getPostDetail(pathname));
        if (think.isEmpty(detail)) {
            return this.redirect('/');
        }
        detail.pathname = encodeURIComponent(detail.pathname);
        try {
            detail.options = JSON.parse(detail.options) || {};
            detail.featuredImage = detail.options.featuredImage;
        } catch (e) {
            detail.options = {};
            detail.featuredImage = '';
        }
        this.assign('post', detail);

        return this.displayView('post');
    }

    async pageAction() {
        let pathname = this.get('pathname');
        let detail;
        if (this.get('preview')) {
            try {
                let previewData = JSON.parse(this.post('previewData'));
                detail = await think
                    .model('post', null, 'admin')
                    .getContentAndSummary(previewData);
            } catch (e) {
                // Ignore JSON parse error
            }
        }
        detail =
            detail ||
            (await this.model('post')
                .setRelation(false)
                .where({
                    pathname,
                    is_public: 1, //公开
                    type: 1, //文章
                    status: 3, //已经发布
                })
                .find());
        detail.pathname = encodeURIComponent(detail.pathname);
        try {
            detail.options = JSON.parse(detail.options) || {};
            detail.featuredImage = detail.options.featuredImage;
        } catch (e) {
            detail.options = {};
            detail.featuredImage = '';
        }
        this.assign('page', detail);
        this.assign('pathname', pathname);

        let template = 'page';
        if (detail.options) {
            try {
                if (detail.options.template) {
                    /*let stat = */ await stats(
                        path.join(
                            this.THEME_VIEW_PATH,
                            'template',
                            detail.options.template,
                        ),
                    );
                    template = path.join(
                        'template',
                        detail.options.template.slice(0, -5),
                    );
                }
            } catch (e) {
                console.log(e); // eslint-disable-line no-console
            }
        }

        return this.displayView(template);
    }
    /**
     * post archive
     * @return {[type]} [description]
     */
    async archiveAction() {
        let model = this.model('post');
        let data = await model.getPostArchive();
        for (let i in data) {
            data[i].map((post) => (post.pathname = encodeURIComponent(post.pathname)));
        }
        this.assign('list', data);
        return this.displayView('archive');
    }

    async tagAction() {
        return this.displayView('tag');
    }

    /**
     * 关于我们页面
     */
    async aboutAction() {
        let cateModel = this.model('cate');
        let postModel = this.model('post');
        let { id } = await cateModel.getCateByName('about');
        let {
            content,
            options: { featuredImage },
        } = await postModel.getFirstPostByCate(id);

        this.assign('content', content);
        this.assign('featuredImage', featuredImage);
        return this.displayView('about');
    }

    /**
     * 核心优势页面
     */
    async advantageAction() {
        let cateModel = this.model('cate');
        let postModel = this.model('post');
        let { id } = await cateModel.getCateByName('advantage');
        let { content, options } = await postModel.getFirstPostByCate(id);

        this.assign('content', content);
        this.assign('options', options);
        return this.displayView('advantage');
    }

    /**
     * 团队介绍页面
     */
    async teamAction() {
        let pathname = this.get('pathname');
        let postModel = this.model('post');

        if (!pathname) {
            let cateModel = this.model('cate');
            let { id } = await cateModel.getCateByName('team');
            let teams = await postModel.getPostByCate(id);

            console.log(teams);

            this.assign('teams', teams);
            return this.displayView('teamlist');
        }

        let team = await postModel.getPostById(pathname);

        console.log(team);

        this.assign('team', team);
        return this.displayView('team');
    }

    async newsAction() {
        let pathname = this.get('pathname');
        if (!pathname) {
            return this.displayView('newslist');
        }
        return this.displayView('news');
    }

    async productAction() {
        let pathname = this.get('pathname');
        if (!pathname) {
            return this.displayView('productlist');
        }
        return this.displayView('product');
    }

    async jobAction() {
        let pathname = this.get('pathname');
        if (!pathname) {
            return this.displayView('joblist');
        }
        return this.displayView('job');
    }

    async caseAction() {
        let pathname = this.get('pathname');
        if (!pathname) {
            return this.displayView('caselist');
        }
        return this.displayView('case');
    }

    async contactAction() {
        return this.displayView('contact');
    }
    /**
     * search action
     * @return {[type]} [description]
     */
    async searchAction() {
        let keyword = this.get('keyword');
        if (keyword) {
            keyword = keyword.trim();
            let postModel = this.model('post');
            let searchResult = await postModel.getPostSearch(keyword, this.get('page'));
            this.assign('searchData', searchResult);
            this.assign('pagination', searchResult);
        }

        //热门标签
        let tagModel = this.model('tag');
        let hotTags = await tagModel.getHotTags();
        this.assign('hotTags', hotTags);

        this.assign('keyword', keyword);
        return this.displayView('search');
    }
};
