export interface Project {
  id: string;
  slug: string;
  title: string;
  type: string;
  size: 'short' | 'tall';
  image: string;
  tags: string[];
  description: string;
  credits: { role: string; name: string }[];
  specifications: { label: string; value: string }[];
}

export const PROJECTS: Project[] = [
  {
    id: '01',
    slug: 'lorem-ipsum-dolor',
    title: 'Lorem Ipsum Dolor',
    type: 'Sit Amet Consectetur',
    size: 'tall',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop',
    tags: ['Adipiscing', 'Elit Proin', 'Elementum', 'Id Arcu'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elementum id arcu id feugiat. Duis finibus sollicitudin lacus eget interdum. Cras sed elementum magna. Suspendisse sit amet interdum elit, eget molestie lectus. Morbi dictum, lectus ut cursus accumsan, leo dolor condimentum velit, eu elementum arcu felis sed nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam interdum pretium purus sed hendrerit. Etiam imperdiet tristique magna, sed tristique lorem elementum sed. Quisque pulvinar magna eget pretium interdum. Aliquam ut eleifend tellus. Phasellus sed libero sed erat feugiat interdum eget ac tortor.',
    credits: [
      { role: 'Feugiat Duis', name: 'Finibus Sollicitudin' },
      { role: 'Lacus Eget', name: 'Interdum Cras' }
    ],
    specifications: [
      { label: 'Suspendisse', value: 'Sit Amet Interdum' },
      { label: 'Eget Molestie', value: 'Lectus Morbi' },
      { label: 'Dictum Lectus', value: 'Ut Cursus Accumsan' }
    ]
  },
  {
    id: '02',
    slug: 'sed-elementum-magna',
    title: 'Sed Elementum Magna',
    type: 'Morbi Dictum Lectus',
    size: 'short',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    tags: ['Cursus', 'Accumsan Leo', 'Condimentum', 'Velit Eu'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras rhoncus, nulla ac tristique tristique, leo dolor condimentum velit, eu elementum arcu felis sed nisl. Mauris tristique elementum tristique. Suspendisse sodales est sit amet lorem hendrerit pulvinar. Proin vitae risus pretium, posuere erat ac, semper ipsum. Nam pretium tortor vitae lectus dictum scelerisque. Curabitur vel accumsan ligula, at condimentum nisi. Sed volutpat, odio ac vestibulum convallis, libero eros fringilla magna, nec feugiat lectus eros quis sem.',
    credits: [
      { role: 'Elementum Arcu', name: 'Felis Sed Nisl' },
      { role: 'Mauris Tristique', name: 'Elementum Tristique' }
    ],
    specifications: [
      { label: 'Suspendisse', value: 'Sodales Est Sit' },
      { label: 'Amet Lorem', value: 'Hendrerit Pulvinar' },
      { label: 'Proin Vitae', value: 'Risus Pretium Posuere' }
    ]
  },
  {
    id: '03',
    slug: 'accumsan-ligula-at',
    title: 'Accumsan Ligula At',
    type: 'Condimentum Nisi Sed',
    size: 'short',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop',
    tags: ['Volutpat', 'Odio Ac', 'Vestibulum', 'Convallis'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut feugiat scelerisque purus, ac vulputate lectus maximus id. Aliquam nec arcu id justo iaculis eleifend. Duis ac lectus erat. Proin eget lectus rhoncus, pretium sem tempor, finibus erat. Ut sit amet justo id libero dictum sodales ac a augue. Sed varius tortor sed pretium volutpat. Nam imperdiet tempor sem, non convallis ante tempor non. Morbi facilisis interdum turpis nec finibus. Proin vestibulum volutpat justo vel pretium. Cras volutpat sollicitudin ipsum ut tempor. In eleifend ex vitae vulputate facilisis.',
    credits: [
      { role: 'Libero Eros', name: 'Fringilla Magna' },
      { role: 'Nec Feugiat', name: 'Lectus Eros Quis' }
    ],
    specifications: [
      { label: 'Sem Integer', value: 'A Congue Ipsum' },
      { label: 'Non Elementum', value: 'Tortor Class Aptent' }
    ]
  },
  {
    id: '04',
    slug: 'taciti-sociosqu-ad',
    title: 'Taciti Sociosqu Ad',
    type: 'Litora Torquent Per',
    size: 'tall',
    image: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=600&auto=format&fit=crop',
    tags: ['Conubia', 'Nostra Per', 'Inceptos', 'Himenaeos'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Nunc interdum elementum lectus id vulputate. Proin in nisl luctus, tristique sapien ac, porta sem. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus eget nulla eget purus vulputate imperdiet sed nec erat. Ut congue erat massa, ut lacinia tortor placerat ut. Ut dictum eleifend nisi. Pellentesque dictum metus eros, ac iaculis ante efficitur vel. Phasellus vulputate elit arcu, pulvinar rhoncus massa porta sit amet.',
    credits: [
      { role: 'Phasellus Eget', name: 'Nulla Eget Purus' }
    ],
    specifications: [
      { label: 'Vulputate', value: 'Imperdiet Sed Nec' },
      { label: 'Erat Ut Congue', value: 'Erat Massa Ut' }
    ]
  },
  {
    id: '05',
    slug: 'lacinia-tortor-placerat',
    title: 'Lacinia Tortor Placerat',
    type: 'Ut Dictum Eleifend',
    size: 'short',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop',
    tags: ['Nisi Pellentesque', 'Dictum Metus', 'Eros Ac', 'Iaculis Ante'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut feugiat scelerisque purus, ac vulputate lectus maximus id. Aliquam nec arcu id justo iaculis eleifend. Duis ac lectus erat. Proin eget lectus rhoncus, pretium sem tempor, finibus erat. Ut sit amet justo id libero dictum sodales ac a augue. Sed varius tortor sed pretium volutpat. Nam imperdiet tempor sem, non convallis ante tempor non. Morbi facilisis interdum turpis nec finibus. Proin vestibulum volutpat justo vel pretium.',
    credits: [
      { role: 'Efficitur Vel', name: 'Phasellus Vulputate' }
    ],
    specifications: [
      { label: 'Elit Arcu', value: 'Pulvinar Rhoncus' },
      { label: 'Massa Porta', value: 'Sit Amet Sed' }
    ]
  },
  {
    id: '06',
    slug: 'hendrerit-finibus-arcu',
    title: 'Hendrerit Finibus Arcu',
    type: 'At Tempus Purus',
    size: 'tall',
    image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=600&auto=format&fit=crop',
    tags: ['Interdum', 'Iaculis Integer', 'Aliquet Libero', 'Et Est'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elementum id arcu id feugiat. Duis finibus sollicitudin lacus eget interdum. Cras sed elementum magna. Suspendisse sit amet interdum elit, eget molestie lectus. Morbi dictum, lectus ut cursus accumsan, leo dolor condimentum velit, eu elementum arcu felis sed nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam interdum pretium purus sed hendrerit.',
    credits: [
      { role: 'Eleifend', name: 'Pellentesque Dictum' },
      { role: 'Metus Eros', name: 'Ac Iaculis' }
    ],
    specifications: [
      { label: 'Ante Efficitur', value: 'Vel Phasellus' },
      { label: 'Vulputate Elit', value: 'Arcu Pulvinar' }
    ]
  },
  {
    id: '07',
    slug: 'quisque-pulvinar-magna',
    title: 'Quisque Pulvinar Magna',
    type: 'Eget Pretium Interdum',
    size: 'short',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    tags: ['Aliquam Ut', 'Eleifend Tellus', 'Phasellus', 'Sed Libero'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi dictum, lectus ut cursus accumsan, leo dolor condimentum velit, eu elementum arcu felis sed nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam interdum pretium purus sed hendrerit. Etiam imperdiet tristique magna, sed tristique lorem elementum sed. Quisque pulvinar magna eget pretium interdum.',
    credits: [
      { role: 'Erat Feugiat', name: 'Interdum Eget' }
    ],
    specifications: [
      { label: 'Accumsan Lectus', value: 'Sed A Tristique' },
      { label: 'Condimentum Mi', value: 'Ut Elementum' }
    ]
  },
  {
    id: '08',
    slug: 'curabitur-vel-accumsan',
    title: 'Curabitur Vel Accumsan',
    type: 'Ligula At Condimentum',
    size: 'tall',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop',
    tags: ['Nisi Sed', 'Volutpat Odio', 'Vestibulum', 'Convallis'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elementum id arcu id feugiat. Duis finibus sollicitudin lacus eget interdum. Cras sed elementum magna. Suspendisse sit amet interdum elit, eget molestie lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Aliquam interdum pretium purus sed hendrerit. Etiam imperdiet tristique magna, sed tristique lorem elementum sed.',
    credits: [
      { role: 'Libero Eros', name: 'Fringilla Magna' },
      { role: 'Nec Feugiat', name: 'Lectus Eros Quis' }
    ],
    specifications: [
      { label: 'Integer A', value: 'Congue Ipsum Non' },
      { label: 'Elementum Tortor', value: 'Class Aptent Taciti' }
    ]
  },
  {
    id: '09',
    slug: 'sociosqu-ad-litora',
    title: 'Sociosqu Ad Litora',
    type: 'Torquent Per Conubia',
    size: 'short',
    image: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600&auto=format&fit=crop',
    tags: ['Nostra Per', 'Inceptos', 'Himenaeos', 'Nam Pretium'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras rhoncus, nulla ac tristique tristique, leo dolor condimentum velit, eu elementum arcu felis sed nisl. Mauris tristique elementum tristique. Suspendisse sodales est sit amet lorem hendrerit pulvinar. Proin vitae risus pretium, posuere erat ac, semper ipsum. Nam pretium tortor vitae lectus dictum scelerisque.',
    credits: [
      { role: 'Curabitur Vel', name: 'Accumsan Ligula' }
    ],
    specifications: [
      { label: 'Condimentum Nisi', value: 'Sed Volutpat Odio' },
      { label: 'Vestibulum', value: 'Convallis Libero' }
    ]
  },
  {
    id: '10',
    slug: 'fringilla-magna-nec',
    title: 'Fringilla Magna Nec',
    type: 'Feugiat Lectus Eros',
    size: 'tall',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop',
    tags: ['Quis Sem', 'Integer A', 'Congue Ipsum', 'Non Elementum'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut feugiat scelerisque purus, ac vulputate lectus maximus id. Aliquam nec arcu id justo iaculis eleifend. Duis ac lectus erat. Proin eget lectus rhoncus, pretium sem tempor, finibus erat. Ut sit amet justo id libero dictum sodales ac a augue. Sed varius tortor sed pretium volutpat. Nam imperdiet tempor sem, non convallis ante tempor non. Morbi facilisis interdum turpis nec finibus.',
    credits: [
      { role: 'Proin Vestibulum', name: 'Volutpat Justo' },
      { role: 'Pretium Cras', name: 'Vollicitudin Ipsum' }
    ],
    specifications: [
      { label: 'Tempor In', value: 'Eleifend Ex Vitae' },
      { label: 'Vulputate', value: 'Facilisis Ut Non' }
    ]
  }
];