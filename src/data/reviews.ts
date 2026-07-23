// Verbatim customer reviews. DO NOT EDIT THE BODY TEXT.
// Edited testimonials read as fabricated; these are reproduced exactly,
// including grammar, per the build spec section 6.
export type Review = {
  id: string;
  author: string;
  profile: string;
  reviewCount: number | null;
  localGuide: boolean;
  photos: number;
  when: string;
  rating: number;
  service: string;
  body: string;
};

export const reviews: Review[] = [
  {
    id: "operations-llc",
    author: "Operations LLC",
    profile: "https://www.google.com/maps/contrib/118418934525877168530/reviews?hl=en-US",
    reviewCount: null,
    localGuide: false,
    photos: 0,
    when: "a month ago",
    rating: 5,
    service: "yard-cleanup",
    body: "We had a great experience with Green Line Lawn Care LLC. Sir Jaydin was very responsive and easy to communicate with from start to finish. He arrived on time, worked efficiently, and cleaned the property thoroughly. He was polite, professional, and respectful throughout the service. We really appreciate his fast and quality work and would definitely recommend them to anyone looking for reliable lawn care services.",
  },
  {
    id: "ryan-dunahoe",
    author: "Ryan Dunahoe",
    profile: "https://www.google.com/maps/contrib/108265717777346508581/reviews?hl=en-US",
    reviewCount: 7,
    localGuide: false,
    photos: 5,
    when: "a month ago",
    rating: 5,
    service: "mowing",
    body: "Jaydin is dependable, hardworking, and takes pride in doing quality work. He is honest, professional, and pays attention to detail. If you're looking for reliable lawn care and someone who will treat your property with care, I highly recommend him.",
  },
  {
    id: "chris-b",
    author: "Chris B",
    profile: "https://www.google.com/maps/contrib/103403786676355589518/reviews?hl=en-US",
    reviewCount: 9,
    localGuide: false,
    photos: 0,
    when: "a month ago",
    rating: 5,
    service: "mowing",
    body: "Exceptional work, and very keen to detail. This company performs quality work at a fair price. They\u2019ve established a long term relationship and I\u2019d recommend them to all my neighbors and friends!",
  },
  {
    id: "geraldine-brown",
    author: "Geraldine Brown",
    profile: "https://www.google.com/maps/contrib/114608951183130337359/reviews?hl=en-US",
    reviewCount: 93,
    localGuide: true,
    photos: 3,
    when: "Edited a month ago",
    rating: 5,
    service: "yard-cleanup",
    body: "Very professional work and always pays attention to detail guaranteed customer satisfaction.I recommended this business highly.Even the most difficult job will be awesome. Landscape detail to a perfection.",
  },
  {
    id: "josiah-barbeau",
    author: "Josiah Barbeau",
    profile: "https://www.google.com/maps/contrib/102567892405148266786/reviews?hl=en-US",
    reviewCount: 1,
    localGuide: false,
    photos: 0,
    when: "a month ago",
    rating: 5,
    service: "mowing",
    body: "Outstanding lawn care service. The business is consistently reliable, punctual, and highly professional in all aspects of their work. Every visit is completed with strong attention to detail, and the results are always clean, well-maintained, and visually impressive. Communication is clear and efficient, and the level of care shown in their work reflects a high standard of quality. I would confidently recommend this lawn care service to anyone seeking dependable and professional yard maintenance.",
  },
  {
    id: "salvador-moreno",
    author: "Salvador Moreno",
    profile: "https://www.google.com/maps/contrib/106708663472943224547/reviews?hl=en-US",
    reviewCount: 4,
    localGuide: false,
    photos: 0,
    when: "a month ago",
    rating: 5,
    service: "gutter-cleaning",
    body: "Jaydin came out and cleaned all of the gutters around our roof and did a great job. He was professional, easy to work with, and showed up when he said he would. Everything was cleaned out thoroughly, and he made sure the area was left clean before he left.\n\nIt\u2019s refreshing to find someone who takes pride in their work. I wouldn\u2019t hesitate to recommend Jaydin to anyone needing their gutters cleaned!",
  },
];

export const AGGREGATE = { rating: 5.0, count: reviews.length };
