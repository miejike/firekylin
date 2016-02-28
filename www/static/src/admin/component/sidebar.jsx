import React from 'react';
import Base from 'base';
import {Link} from 'react-router';
import classnames from 'classnames';

export default class extends Base {
  state = {
    routes: [
      {url: '/dashboard', icon: 'home', title:'概述'},
      {url: '/post', icon: 'setting', title: '文章管理', children: [
        {url: '/post/list', title: '文章列表'},
        {url: '/post/create', title: '添加文章'}
      ]},
      {url: '/page', icon: 'reply', title: '页面管理', children: [
        {url: '/page/list', title: '页面列表'},
        {url: '/page/new', title: '添加页面'}
      ]},
      {url: '/cate', icon: 'report', title: '分类管理', children: [
        {url: '/cate/list', title: '分类列表'},
        {url: '/cate/create', title: '添加分类'}
      ]},
      {url: '/user', icon: 'user', title: '用户管理', children: [
        {url: '/user/list', title: '用户列表'},
        {url: '/user/create', title: '添加用户'}
      ]},
      {url: '/tag', icon: 'report', title: '标签管理', children: [
        {url: '/tag/list', title: '内容审核'},
        {url: '/tag/verify', title: '认证审核'}
      ]},
      {url: '/options', icon: 'report', title: '系统设置', children: [
        {url: '/options/general', title: '基本设置'},
        {url: '/options/two_factor_auth', title: '二步验证'},
        {url: '/options/upload', title: '文件上传'}
      ]}
    ]
  };
  /**
   * 是否是高亮状态
   * @param  {[type]}  routeUrl [description]
   * @return {Boolean}          [description]
   */
  isActive(routeUrl){
    return this.context.router.isActive(routeUrl);
  }
  getClassName(icon, routeUrl){
    let active = this.isActive(routeUrl);
    return classnames({
      icon: true,
      [`icon-${icon}`]: true,
      active: active
    })
  }
  getSubUlClassName(routeUrl){
    if(this.isActive(routeUrl)){
      return 'block';
    }
    return 'hide';
  }
  getSubLinkClassName(routeUrl){
    return classnames({
      active: this.isActive(routeUrl)
    })
  }
  open(routeUrl){
    this.context.router.push(routeUrl)
  }
  render(){
    return (
      <div className="fk-side ps-container" id="fk-side">
        <div className="mod">
          <div className="mod-logo">
            <h1><a href="/">{SysConfig.options.title}</a></h1>
          </div>
        </div>
        <ul className="mod-bar" style={{marginTop: 10}}>
          <input type="hidden" id="hide_values" val="0" />
          {this.state.routes.map( (route, i) =>
            <li key={i}>
              {route.children ? <a onClick={this.open.bind(this, route.children && route.children[0].url || route.url)} className={this.getClassName(route.icon, route.url)}><span>{route.title}</span></a>
              :
              <Link to={route.url} onClick={this.open.bind(this, route.children && route.children[0].url || route.url)} className={this.getClassName(route.icon, route.url)}>
                <span>{route.title}</span>
              </Link>
              }
              {route.children ?
                <ul className={this.getSubUlClassName(route.url)}>
                  {route.children.map((child, j) =>
                    <li key={j}>
                      <Link to={child.url} onClick={this.open.bind(this, child.url)} className={this.getSubLinkClassName(child.url)}>
                        <span>{child.title}</span>
                      </Link>
                    </li>
                  )}
                </ul>
              : null}
            </li>
          )}
        </ul>
      </div>
    );
  }
}
