module.exports = {
  title: 'Project Take Over',

  themeConfig: {
    displayAllHeaders: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Js', link: '/js/' },
      { text: 'Vue', link: '/vue/' },
      { text: 'Ts', link: '/ts/' },
      { text: '浏览器相关', link: '/browser/' },
      { text: 'Github', link: 'https://github.com/Webwwl' },
    ],
    sidebar: {
      '/js/': [
        {
          title: 'Javascript',
          path: '/js/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1,    // 可选的, 默认值是 1
          children: [
            ['', '基本类型'],
            ['clourse', '闭包'],
          ]
        }
      ],
      '/vue/': [
        {
          title: 'Vue',
          path: '/vue/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1,    // 可选的, 默认值是 1
          children: [
            ['', '响应式原理']
          ]
        }
      ],
      '/ts/': [
        {
          title: 'Typescript',
          path: '/ts/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1,    // 可选的, 默认值是 1
          children: [
            ['', '基本类型'],
          ]
        }
      ],
      '/browser/': [
        {
          title: '浏览器相关',
          path: '/browser/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 1,    // 可选的, 默认值是 1
          children: [
            ['', '跨域'],
          ]
        }
      ]
    }
  }
}