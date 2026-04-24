export interface Game {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tag?: string;
}

export const GUEST_GAMES: Game[] = [
  {
    id: "grad-2024",
    title: "فعاليات التخرج",
    description: "منافسة حماسية تعتمد على الذكاء والسرعة، مصممة خصيصاً لمناسبات التخرج.",
    imageUrl: "https://www.dropbox.com/scl/fi/vzl9tjyod1xe2ycx50xb8/Photo-12-04-2026-1-28-54-PM.jpg?rlkey=eup7txw2qg9omzsminzgbvhsv&st=2k8t0k7z&raw=1",
    tag: "جديد"
  },
  {
    id: "mysteries-1",
    title: "غموض الدهاليز",
    description: "رحلة عبر ألغاز تاريخية تتطلب مهارات تحليلية عالية للوصول إلى الحقيقة.",
    imageUrl: "https://www.dropbox.com/scl/fi/g5i22vcxp6ymsykhzw4ff/Photo-11-04-2026-7-54-55-AM.jpg?rlkey=sg4bsp8r42kj58qmdbsbzkxfn&st=803zg5qm&raw=1",
  },
  {
    id: "social-fun",
    title: "لمة أهل",
    description: "أسئلة مضحكة ومواقف غريبة تجمع العائلة في سهرة لا تنسى.",
    imageUrl: "https://www.dropbox.com/scl/fi/7uciimcp5ppj3d3hqni95/Photo-12-04-2026-11-25-57-PM.jpg?rlkey=bw14grx4tpxq8xegf1rpjnyso&st=fqe89yho&raw=1",
  }
];
