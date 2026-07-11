import type { LocaleKey } from './translations';
import type { SeoPageKey } from './seo';

export type SeoMeta = {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
};

type SeoCopyMap = Record<Exclude<SeoPageKey, 'artwork'>, SeoMeta>;

/**
 * Per-locale meta titles/descriptions drawn from existing site copy (bios, section intros, roles).
 * Artwork pages build title/description from the artwork record at render time.
 */
export const seoCopy: Record<LocaleKey, SeoCopyMap> = {
  en: {
    home: {
      title: 'Anna Dauyl Rockswell — Writer & Artist',
      description:
        'Kazakh multidisciplinary artist based in Seoul and Almaty — writer, ghostwriter, painter, and visual artist. Portfolio of paintings, exhibitions, publishings, research, and press.',
    },
    about: {
      title: 'About — Anna Dauyl Rockswell',
      description:
        'A Kazakh multidisciplinary artist working between Seoul and Almaty. Writing, ghostwriting, painting, and visual art shaped by dark expressionism, Jungian psychoanalysis, and the dark feminine.',
    },
    art: {
      title: 'Art — Anna Dauyl Rockswell',
      description:
        'Paintings and visual works by Anna Dauyl Rockswell — oil and mixed media exploring body, memory, and transformation.',
    },
    exhibitions: {
      title: 'Exhibitions — Anna Dauyl Rockswell',
      description:
        'Chronological exhibition history — museum and gallery shows including MUST Museum, Contemporary Venice, HCMY, and The Holy Art.',
    },
    publications: {
      title: 'Publishings — Anna Dauyl Rockswell',
      description:
        'Magazine features, the From Utero chapbook, and literary publications by Anna Dauyl Rockswell.',
    },
    research: {
      title: 'Academic Research — Anna Dauyl Rockswell',
      description:
        'Published articles and commentary on influencer marketing, storytelling, and culture — including Forbes Agency Council and industry platforms.',
    },
    press: {
      title: 'Press — Anna Dauyl Rockswell',
      description:
        'Press coverage and exhibition listings — HCMY, Verger Gallery, The Korea Times, and more.',
    },
    contacts: {
      title: 'Contact — Anna Dauyl Rockswell',
      description:
        'Contact Anna Dauyl Rockswell — writer and artist based in Seoul and Almaty. Email contact@annadauylrockswell.com.',
    },
  },
  kr: {
    home: {
      title: '안나 다우일 록스웰 — 작가 & 아티스트',
      description:
        '서울과 알마티를 기반으로 활동하는 카자흐 다학제 예술가 — 작가, 고스트라이터, 화가, 시각 예술가. 회화, 전시, 출판, 연구, 언론 포트폴리오.',
    },
    about: {
      title: '소개 — 안나 다우일 록스웰',
      description:
        '서울과 알마티를 오가며 작업하는 카자흐 다학제 예술가. 글쓰기, 고스트라이팅, 회화, 시각 예술 — 다크 표현주의와 융 심리학의 영향을 받습니다.',
    },
    art: {
      title: '예술 — 안나 다우일 록스웰',
      description: '안나 다우일 록스웰의 회화와 시각 작품 — 신체, 기억, 변신을 탐구하는 오일 및 혼합 매체.',
    },
    exhibitions: {
      title: '전시 — 안나 다우일 록스웰',
      description: '연대기 전시 기록 — MUST Museum, Contemporary Venice, HCMY, The Holy Art 등 박물관·갤러리 전시.',
    },
    publications: {
      title: '출판 — 안나 다우일 록스웰',
      description: '매거진 피처, From Utero 챕북, 문학 출판물.',
    },
    research: {
      title: '학술 연구 — 안나 다우일 록스웰',
      description: '인플루언서 마케팅, 스토리텔링, 문화에 대한 기고와 논평.',
    },
    press: {
      title: '언론 — 안나 다우일 록스웰',
      description: '언론 보도와 전시 소개 — HCMY, Verger Gallery, The Korea Times 등.',
    },
    contacts: {
      title: '연락처 — 안나 다우일 록스웰',
      description: '안나 다우일 록스웰에게 연락하기 — 서울·알마티 기반. contact@annadauylrockswell.com.',
    },
  },
  kk: {
    home: {
      title: 'Анна Дауыл Роксвелл — Жазушы & Суретші',
      description:
        'Сеул мен Алматыда жұмыс істейтін қазақ мультидисциплинарлы суретші — жазушы, гострайтер, суретші. Кескіндеме, көрме, басылым, зерттеу портфолиосы.',
    },
    about: {
      title: 'Туралы — Анна Дауыл Роксвелл',
      description:
        'Сеул мен Алматы арасында жұмыс істейтін қазақ мультидисциплинарлы суретші. Жазу, гострайтинг, кескіндеме және визуалды өнер.',
    },
    art: {
      title: 'Өнер — Анна Дауыл Роксвелл',
      description: 'Анна Дауыл Роксвеллдің кескіндемелері мен визуалды жұмыстары.',
    },
    exhibitions: {
      title: 'Көрмелер — Анна Дауыл Роксвелл',
      description: 'Хронологиялық көрме тарихы — мұражай және галерея көрсетілімдері.',
    },
    publications: {
      title: 'Басылымдар — Анна Дауыл Роксвелл',
      description: 'Журнал ерекшеліктері, From Utero чапбугі және әдеби басылымдар.',
    },
    research: {
      title: 'Академиялық зерттеу — Анна Дауыл Роксвелл',
      description: 'Инфлюенсер маркетинг, сторителлинг және мәдениет туралы жарияланымдар.',
    },
    press: {
      title: 'Баспасөз — Анна Дауыл Роксвелл',
      description: 'Баспасөз қамтуы және көрме тізімдері.',
    },
    contacts: {
      title: 'Байланыс — Анна Дауыл Роксвелл',
      description: 'Анна Дауыл Роксвеллге хабарласу — Сеул · Алматы. contact@annadauylrockswell.com.',
    },
  },
  zh: {
    home: {
      title: 'Anna Dauyl Rockswell — 作家与艺术家',
      description:
        '常驻首尔与阿拉木图的哈萨克多学科艺术家——作家、代笔、画家与视觉艺术家。绘画、展览、出版、研究与媒体作品集。',
    },
    about: {
      title: '关于 — Anna Dauyl Rockswell',
      description:
        '在首尔与阿拉木图之间创作的哈萨克多学科艺术家。写作、代笔、绘画与视觉艺术，受黑暗表现主义与荣格精神分析影响。',
    },
    art: {
      title: '艺术 — Anna Dauyl Rockswell',
      description: 'Anna Dauyl Rockswell 的绘画与视觉作品——以油画与综合材料探索身体、记忆与转化。',
    },
    exhibitions: {
      title: '展览 — Anna Dauyl Rockswell',
      description: '展览年表——包括 MUST Museum、Contemporary Venice、HCMY、The Holy Art 等。',
    },
    publications: {
      title: '出版 — Anna Dauyl Rockswell',
      description: '杂志专题、From Utero 小册子与文学出版。',
    },
    research: {
      title: '学术研究 — Anna Dauyl Rockswell',
      description: '关于网红营销、叙事与文化的已发表文章与评论。',
    },
    press: {
      title: '媒体 — Anna Dauyl Rockswell',
      description: '媒体报道与展览介绍——HCMY、Verger Gallery、The Korea Times 等。',
    },
    contacts: {
      title: '联系 — Anna Dauyl Rockswell',
      description: '联系 Anna Dauyl Rockswell——常驻首尔与阿拉木图。contact@annadauylrockswell.com。',
    },
  },
  ru: {
    home: {
      title: 'Анна Дауыл Роксвелл — Писатель и художник',
      description:
        'Казахская мультидисциплинарная художница из Сеула и Алматы — писатель, гострайтер, живописец и визуальный артист. Портфолио живописи, выставок, публикаций и прессы.',
    },
    about: {
      title: 'О художнице — Анна Дауыл Роксвелл',
      description:
        'Казахская мультидисциплинарная художница, работающая между Сеулом и Алматы. Письмо, гострайтинг, живопись и визуальное искусство.',
    },
    art: {
      title: 'Искусство — Анна Дауыл Роксвелл',
      description: 'Живопись и визуальные работы Анны Дауыл Роксвелл — масло и смешанная техника.',
    },
    exhibitions: {
      title: 'Выставки — Анна Дауыл Роксвелл',
      description: 'Хронология выставок — музейные и галерейные показы.',
    },
    publications: {
      title: 'Публикации — Анна Дауыл Роксвелл',
      description: 'Журнальные публикации, чапбук From Utero и литературные издания.',
    },
    research: {
      title: 'Академические исследования — Анна Дауыл Роксвелл',
      description: 'Статьи и комментарии об инфлюенсер-маркетинге, сторителлинге и культуре.',
    },
    press: {
      title: 'Пресса — Анна Дауыл Роксвелл',
      description: 'Пресса и упоминания выставок — HCMY, Verger Gallery, The Korea Times и др.',
    },
    contacts: {
      title: 'Контакты — Анна Дауыл Роксвелл',
      description: 'Связаться с Анной Дауыл Роксвелл — Сеул · Алматы. contact@annadauylrockswell.com.',
    },
  },
};

export function getSeoMeta(locale: LocaleKey, page: Exclude<SeoPageKey, 'artwork'>): SeoMeta {
  return seoCopy[locale][page];
}
