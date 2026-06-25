export type Locale = 'en' | 'kr' | 'kk';

export interface LocaleStrings {
  nav: {
    art: string;
    exhibitions: string;
    feature: string;
    virtual: string;
    publications: string;
    magazines: string;
    academic: string;
    press: string;
    contact: string;
    about: string;
  };
  hero: {
    tag: string;
    subtitle: string;
  };
  contact: {
    heading: string;
    name: string;
    email: string;
    message: string;
    send: string;
  };
  footer: {
    email: string;
    licenses: string;
    socials: string;
    based: string;
    location: string;
    copyright: string;
  };
}

export const locales: Record<Locale, LocaleStrings> = {
  en: {
    nav: {
      art: "Art",
      exhibitions: "Exhibitions",
      feature: "Feature",
      virtual: "Virtual",
      publications: "Publications & Writing",
      magazines: "Magazines",
      academic: "Academic Research",
      press: "Press",
      contact: "Contact",
      about: "About",
    },
    hero: {
      tag: "(ARTIST PORTFOLIO)",
      subtitle: "Multidisciplinary artist exploring the threshold between material and memory.",
    },
    contact: {
      heading: "Contact Me",
      name: "Name:",
      email: "Email:",
      message: "Message:",
      send: "Send message",
    },
    footer: {
      email: "Email",
      licenses: "Licenses",
      socials: "Socials",
      based: "Based in",
      location: "Seoul · Almaty",
      copyright: "© 2026 Anna Dauyl Rockswell. All rights reserved.",
    },
  },
  kr: {
    nav: {
      art: "작품",
      exhibitions: "전시",
      feature: "특집",
      virtual: "가상",
      publications: "출판 및 저술",
      magazines: "매거진",
      academic: "학술 연구",
      press: "프레스",
      contact: "연락처",
      about: "소개",
    },
    hero: {
      tag: "(작가 포트폴리오)",
      subtitle: "물질과 기억 사이의 경계를 탐구하는 multidisciplinary 예술가.",
    },
    contact: {
      heading: "연락하기",
      name: "이름:",
      email: "이메일:",
      message: "메시지:",
      send: "보내기",
    },
    footer: {
      email: "이메일",
      licenses: "라이선스",
      socials: "소셜",
      based: "기반",
      location: "서울 · 알마티",
      copyright: "© 2026 안나 다우일 록스웰. All rights reserved.",
    },
  },
  kk: {
    nav: {
      art: "Өнер",
      exhibitions: "Көрме",
      feature: "Фичер",
      virtual: "Виртуалды",
      publications: "Басылымдар",
      magazines: "Журналдар",
      academic: "Академиялық зерттеу",
      press: "Баспасөз",
      contact: "Байланыс",
      about: "Туралы",
    },
    hero: {
      tag: "(СУРЕТШІ ПОРТФОЛИОСЫ)",
      subtitle: "Материал мен естелік арасындағы шекараны зерттейтін мультидисциплинарлы суретші.",
    },
    contact: {
      heading: "Хабарласу",
      name: "Аты:",
      email: "Электрондық пошта:",
      message: "Хабарлама:",
      send: "Жіберу",
    },
    footer: {
      email: "Электрондық пошта",
      licenses: "Лицензиялар",
      socials: "Әлеуметтік",
      based: "Негізделген",
      location: "Сеул · Алматы",
      copyright: "© 2026 Анна Дауыл Роксвелл. Барлық құқықтар қорғалған.",
    },
  },
};
