export type Locale = "en" | "zh-TW";

export const LOCALES: Locale[] = ["en", "zh-TW"];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

export type TopicCopy = {
  name: string;
  description: string;
};

export type EpisodeCopy = {
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
};

export type Messages = {
  meta: {
    siteName: string;
    titleTemplate: string;
    homeTitle: string;
    homeDescription: string;
    episodesTitle: string;
    episodesDescription: string;
    topicsTitle: string;
    topicsDescription: string;
    aboutTitle: string;
    aboutDescription: string;
    newsletterTitle: string;
    newsletterDescription: string;
    blogTitle: string;
    blogDescription: string;
  };
  nav: {
    episodes: string;
    topics: string;
    about: string;
    subscribe: string;
    toggleMenu: string;
    brandSubtitle: string;
  };
  hero: {
    tagline: string;
    subtitle: string;
    latestEpisode: string;
    watchYoutube: string;
    showNotes: string;
  };
  mission: {
    label: string;
    headingLine1: string;
    headingLine2: string;
    paragraph1: string;
    paragraph2: string;
  };
  recentEpisodes: {
    label: string;
    heading: string;
    searchPlaceholder: string;
    allEpisodesLink: string;
    allFilter: string;
    noMatch: string;
    viewAllMobile: string;
  };
  topicsPreview: {
    label: string;
    heading: string;
    episode: string;
    episodes: string;
  };
  newsletterCta: {
    label: string;
    heading: string;
    body: string;
    subscribeSubstack: string;
  };
  footer: {
    linkedin: string;
    instagram: string;
    email: string;
    languageLabel: string;
  };
  about: {
    label: string;
    heading: string;
    tagline: string;
    showHeading: string;
    showP1: string;
    showP2: string;
    showP3: string;
    hostHeading: string;
    hostP1: string;
    hostP2: string;
    listenWatch: string;
    contactHeading: string;
    contactBody: string;
    photoAltHost: string;
    photoAltCover: string;
    backToHome: string;
  };
  episodesPage: {
    backHome: string;
    sectionLabel: string;
    headingPre: string;
    headingPost: string;
    intro: string;
    newEveryTwoWeeks: string;
    listenSpotify: string;
  };
  episodeDetail: {
    backHome: string;
    allEpisodes: string;
    episodeNumberPrefix: string;
    episodeNumberSuffix: string;
    watchYoutube: string;
    listenSpotify: string;
    keepListening: string;
    relatedEpisodes: string;
    neverMiss: string;
    stayHumanHeading: string;
    newsletterCopy: string;
    subscribeSubstack: string;
    viewAllEpisodes: string;
  };
  topicsPage: {
    backHome: string;
    sectionLabel: string;
    headingPre: string;
    headingPost: string;
    intro: string;
    episode: string;
    episodes: string;
  };
  topicDetail: {
    backHome: string;
    topicsBreadcrumb: string;
    episode: string;
    episodes: string;
  };
  newsletterPage: {
    backHome: string;
    sectionLabel: string;
    headingPre: string;
    headingPost: string;
    intro: string;
    substackCardBody: string;
    subscribeSubstack: string;
    orFollow: string;
  };
  blogPage: {
    backHome: string;
    sectionLabel: string;
    headingPre: string;
    headingPost: string;
    introPre: string;
    introPost: string;
    noPosts: string;
    substackCta: string;
    subscribeSubstack: string;
  };
  notFound: {
    fourOhFour: string;
    heading: string;
    body: string;
    backHome: string;
  };
  languageSwitcher: {
    ariaLabel: string;
    english: string;
    traditionalMandarin: string;
  };
  topics: Record<string, TopicCopy>;
  episodes: Record<string, EpisodeCopy>;
};
