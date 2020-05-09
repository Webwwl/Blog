module.exports = {
  title: 'Webwwl の Blog',

  themeConfig: {
    displayAllHeaders: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Js', link: '/js/' },
      { text: 'Vue', link: '/vue/' },
      { text: 'Ts', link: '/ts/' },
      { text: 'Nodejs', link: '/nodejs/' },
      { text: '浏览器相关', link: '/browser/' },
      { text: 'Github', link: 'https://github.com/Webwwl' },
    ],
    sidebar: {
      '/js/': [
        {
          title: 'Javascript',
          path: '/js/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 0,    // 可选的, 默认值是 1
          children: [
            ['', '基本类型'],
            ['clourse', '闭包'],
            ['promise', '实现一个Promise'],
          ]
        }
      ],
      '/vue/': [
        {
          title: 'Vue',
          path: '/vue/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 0,    // 可选的, 默认值是 1
          children: [
            ['', '响应式原理'],
            ['render', 'render过程'],
            ['update', 'update过程'],
            ['userWatcher', 'userWatcher'],
            ['computedWatcher', 'computedWatcher'],
          ]
        }
      ],
      '/ts/': [
        {
          title: 'Typescript',
          path: '/ts/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 0,    // 可选的, 默认值是 1
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
          sidebarDepth: 0,    // 可选的, 默认值是 1
          children: [
            ['', '跨域'],
          ]
        }
      ],
      '/nodejs/': [
        {
          title: 'Nodejs',
          path: '/nodejs/',
          collapsable: false, // 可选的, 默认值是 true,
          sidebarDepth: 0,    // 可选的, 默认值是 1
          children: [
            ['', 'commonjs'],
          ]
        }
      ]
    }
  }
}