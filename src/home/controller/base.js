const path = require('path');
const pack = require('../../../package.json');
const i18next = require('i18next');

const isPkg = think.env === 'pkg';

i18next.init({
    lng: 'zh', // 设定语言
    fallbackLng: 'zh', // 默认语言包
    resources: {
        //语言包资源
        en: { translation: require('../../i18n/en.json') },
        zh: { translation: require('../../i18n/zh.json') },
    },
});
module.exports = class extends think.Controller {
    constructor(...args) {
        super(...args);
        //home view path
        this.HOME_VIEW_PATH = path.join(think.ROOT_PATH, 'view', 'home');
    }
    /**
     * some base method in here
     */
    async __before() {
        if (this.ctx.action === 'install') {
            return;
        }
        if (!firekylin.isInstalled) {
            return this.redirect('/index/install');
        }

        // 初始化国际化信息
        const lang = this.get('lang') || 'zh';

        i18next.changeLanguage(lang);

        let model = this.model('options');
        let cateModel = this.model('cate');
        let postModel = this.model('post');
        let options = await model.getOptions();
        this.options = options;
        let { navigation, themeConfig } = options;
        try {
            navigation = JSON.parse(navigation);
        } catch (e) {
            navigation = [];
        }
        try {
            themeConfig = JSON.parse(themeConfig);
        } catch (e) {
            themeConfig = {};
        }

        //remove github pwd
        let commentConfigName = {};
        try {
            commentConfigName = JSON.parse(options.comment.name);
            delete commentConfigName.githubPassWord;
            options.comment.name = JSON.stringify(commentConfigName);
        } catch (e) {
            commentConfigName = {};
        }
        this.assign('lang', lang);
        this.assign('i18n', i18next);
        this.assign('options', options);
        this.assign('navigation', navigation);
        this.assign('themeConfig', themeConfig);
        this.assign('VERSION', pack.version);
        //set theme view root path
        let theme = options.theme || 'firekylin';
        this.THEME_VIEW_PATH = path.join(
            isPkg ? process.cwd() : think.ROOT_PATH,
            'www',
            'theme',
            theme,
        );

        //网站地址
        let siteUrl = this.options.site_url;
        if (!siteUrl) {
            siteUrl = 'http://' + this.ctx.host;
        }
        this.assign('site_url', siteUrl);

        this.assign('currentYear', new Date().getFullYear());
        this.assign('currentUrl', this.ctx.action);

        // 获取栏目封面
        const {
            options: { cover },
            name,
            description,
        } = await cateModel.getCateByName(this.ctx.action);

        // 按栏目获取最新5篇内容
        const lastPostListByCate = await postModel.getLastPostListByCate();

        lastPostListByCate.forEach((item) => {});

        this.assign('section_cover', cover);
        this.assign('section_name', name);
        this.assign('section_description', description);
    }
    /**
     * display view page
     * @param  {} name []
     * @return {}      []
     */
    async displayView(name) {
        if (this.ctx.url.match(/\.json(?:\?|$)/)) {
            let jsonOutput = {},
                assignObj = this.assign();
            Object.keys(assignObj).forEach((key) => {
                if (
                    ['controller', 'http', 'config', '_', 'options'].indexOf(key) === -1
                ) {
                    jsonOutput[key] = assignObj[key];
                }
            });

            this.ctx.type = 'application/json';
            this.ctx.body = jsonOutput;
            return true;
        }

        return this.display(path.join(this.THEME_VIEW_PATH, 'html', name + '.html'));
    }
};
