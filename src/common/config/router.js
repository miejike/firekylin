module.exports = [
    // [/^admin/, 'admin'],

    [/^cate\/(.+)(?:\.html|\.json)$/i, 'post/list?cate=:1'],
    [/^tag\/(.+)(?:\.html|\.json)$/i, 'post/list?tag=:1'],
    [/^author\/([^/]+)(?:\.html|\.json)$/i, 'post/list?name=:1'],
    [/^tags(?:\.html|\.json)$/i, 'post/tag'],
    [/^search(?:\.html|\.json)$/i, 'post/search'],
    [/^page\/([^/]+)(?:\.html|\.json)$/i, 'post/page?pathname=:1'],
    [/^post\/([^/]+)(?:\.html|\.json)$/i, 'post/detail?pathname=:1'],

    [/^about\/?$/i, 'post/about'],
    [/^advantage\/?$/i, 'post/advantage'],
    [/^team\/([^/]+)\/?$/i, 'post/team?pathname=:1'],
    [/^team\/?$/i, 'post/team'],
    [/^enterprise\/([^/]+)\/?$/i, 'post/enterprise?pathname=:1'],
    [/^enterprise\/?$/i, 'post/enterprise'],
    [/^investment\/([^/]+)\/?$/i, 'post/investment?pathname=:1'],
    [/^investment\/?$/i, 'post/investment'],
    [/^public\/([^/]+)\/?$/i, 'post/public?pathname=:1'],
    [/^public\/?$/i, 'post/public'],
    [/^news\/?$/i, 'post/news'],
    [/^product\/([^/]+)\/?$/i, 'post/product?pathname=:1'],
    [/^product\/?$/i, 'post/product'],
    [/^job\/([^/]+)\/?$/i, 'post/job?pathname=:1'],
    [/^job\/?$/i, 'post/job'],
    [/^contact\/?$/i, 'post/contact'],
    [/^archives\/?$/i, 'post/archive'],
    [/^cate\/(.+)\/?$/i, 'post/list?cate=:1'],
    [/^tag\/(.+)\/?$/i, 'post/list?tag=:1'],
    [/^author\/([^/]+)\/?$/i, 'post/list?name=:1'],
    [/^tags\/?$/i, 'post/tag'],
    [/^links\/?$/i, 'post/page?pathname=links'],
    [/^rss(?:\.xml)?\/?$/i, 'index/rss'],
    [/^sitemap(?:\.xml)?\/?$/i, 'index/sitemap'],
    [/^search\/?$/i, 'post/search'],
    [/^page\/([^/]+)\/?$/i, 'post/page?pathname=:1'],
    [/^post\/sitemap\/?$/i, 'post/sitemap'],
    [/^post\/([^/]+)\/?$/i, 'post/detail?pathname=:1'],
    ['opensearch.xml', 'index/opensearch'],
];
