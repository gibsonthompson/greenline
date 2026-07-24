// Verbatim customer reviews. DO NOT EDIT THE BODY TEXT.
// Review counts are deliberately NOT shown: the Google Business Profile has
// far more reviews than the six reproduced here, so stating a count would
// understate the business.
export type Review = {
  id: string;
  author: string;
  profile: string;
  localGuide: boolean;
  when: string;
  rating: number;
  service: string;
  context: string;      // what they hired us for, shown instead of a review count
  avatarColor: string;
  body: string;
};

export const reviews: Review[] = [
  {
    id: "ryan-dunahoe",
    author: "Ryan Dunahoe",
    profile: "https://www.google.com/maps/contrib/108265717777346508581/reviews?hl=en-US",
    localGuide: false,
    when: "a month ago",
    rating: 5,
    service: "mowing",
    context: "5 photos",
    avatarColor: "#1A73E8",
    body: "Jaydin is dependable, hardworking, and takes pride in doing quality work. He is honest, professional, and pays attention to detail. If you're looking for reliable lawn care and someone who will treat your property with care, I highly recommend him.",
  },
  {
    id: "geraldine-brown",
    author: "Geraldine Brown",
    profile: "https://www.google.com/maps/contrib/114608951183130337359/reviews?hl=en-US",
    localGuide: true,
    when: "Edited a month ago",
    rating: 5,
    service: "yard-cleanup",
    context: "3 photos",
    avatarColor: "#E8710A",
    body: "Very professional work and always pays attention to detail guaranteed customer satisfaction.I recommended this business highly.Even the most difficult job will be awesome. Landscape detail to a perfection.",
  },
  {
    id: "salvador-moreno",
    author: "Salvador Moreno",
    profile: "https://www.google.com/maps/contrib/106708663472943224547/reviews?hl=en-US",
    localGuide: false,
    when: "a month ago",
    rating: 5,
    service: "gutter-cleaning",
    context: "Gutter cleaning",
    avatarColor: "#137333",
    body: "Jaydin came out and cleaned all of the gutters around our roof and did a great job. He was professional, easy to work with, and showed up when he said he would. Everything was cleaned out thoroughly, and he made sure the area was left clean before he left.\n\nIt's refreshing to find someone who takes pride in their work. I wouldn't hesitate to recommend Jaydin to anyone needing their gutters cleaned!",
  },
  {
    id: "operations-llc",
    author: "Operations LLC",
    profile: "https://www.google.com/maps/contrib/118418934525877168530/reviews?hl=en-US",
    localGuide: false,
    when: "a month ago",
    rating: 5,
    service: "yard-cleanup",
    context: "Yard cleanup",
    avatarColor: "#9334E6",
    body: "We had a great experience with Green Line Lawn Care LLC. Sir Jaydin was very responsive and easy to communicate with from start to finish. He arrived on time, worked efficiently, and cleaned the property thoroughly. He was polite, professional, and respectful throughout the service. We really appreciate his fast and quality work and would definitely recommend them to anyone looking for reliable lawn care services.",
  },
  {
    id: "chris-b",
    author: "Chris B",
    profile: "https://www.google.com/maps/contrib/103403786676355589518/reviews?hl=en-US",
    localGuide: false,
    when: "a month ago",
    rating: 5,
    service: "mowing",
    context: "Weekly mowing",
    avatarColor: "#C5221F",
    body: "Exceptional work, and very keen to detail. This company performs quality work at a fair price. They've established a long term relationship and I'd recommend them to all my neighbors and friends!",
  },
  {
    id: "josiah-barbeau",
    author: "Josiah Barbeau",
    profile: "https://www.google.com/maps/contrib/102567892405148266786/reviews?hl=en-US",
    localGuide: false,
    when: "a month ago",
    rating: 5,
    service: "mowing",
    context: "Weekly mowing",
    avatarColor: "#1A73E8",
    body: "Outstanding lawn care service. The business is consistently reliable, punctual, and highly professional in all aspects of their work. Every visit is completed with strong attention to detail, and the results are always clean, well-maintained, and visually impressive. Communication is clear and efficient, and the level of care shown in their work reflects a high standard of quality. I would confidently recommend this lawn care service to anyone seeking dependable and professional yard maintenance.",
  },
];

// Rating only. No count, per above.
export const AGGREGATE = { rating: 5.0 };
