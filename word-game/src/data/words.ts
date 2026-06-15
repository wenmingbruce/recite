export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  unit: string;
  semester: 1 | 2;
}

export const WORDS: Word[] = [
  // 上册 Unit 1 - My New Teachers
  { id: "u1_1", word: "young", phonetic: "/jʌŋ/", meaning: "年轻的", example: "My teacher is young.", unit: "Unit 1", semester: 1 },
  { id: "u1_2", word: "kind", phonetic: "/kaɪnd/", meaning: "和蔼的；善良的", example: "She is very kind.", unit: "Unit 1", semester: 1 },
  { id: "u1_3", word: "funny", phonetic: "/ˈfʌni/", meaning: "有趣的；滑稽的", example: "The story is funny.", unit: "Unit 1", semester: 1 },
  { id: "u1_4", word: "strict", phonetic: "/strɪkt/", meaning: "严格的", example: "Our teacher is strict.", unit: "Unit 1", semester: 1 },
  { id: "u1_5", word: "smart", phonetic: "/smɑːrt/", meaning: "聪明的", example: "He is a smart boy.", unit: "Unit 1", semester: 1 },
  { id: "u1_6", word: "active", phonetic: "/ˈæktɪv/", meaning: "积极的；活跃的", example: "She is very active in class.", unit: "Unit 1", semester: 1 },
  { id: "u1_7", word: "quiet", phonetic: "/ˈkwaɪət/", meaning: "安静的", example: "Please be quiet.", unit: "Unit 1", semester: 1 },
  { id: "u1_8", word: "hard-working", phonetic: "/ˌhɑːrd ˈwɜːrkɪŋ/", meaning: "勤劳的", example: "She is hard-working.", unit: "Unit 1", semester: 1 },
  { id: "u1_9", word: "principal", phonetic: "/ˈprɪnsɪpəl/", meaning: "校长", example: "The principal is kind.", unit: "Unit 1", semester: 1 },
  { id: "u1_10", word: "short", phonetic: "/ʃɔːrt/", meaning: "矮的；短的", example: "He is short.", unit: "Unit 1", semester: 1 },
  { id: "u1_11", word: "thin", phonetic: "/θɪn/", meaning: "瘦的", example: "She is thin.", unit: "Unit 1", semester: 1 },

  // 上册 Unit 2 - My Days of the Week
  { id: "u2_1", word: "Monday", phonetic: "/ˈmʌndeɪ/", meaning: "星期一", example: "I have P.E. on Monday.", unit: "Unit 2", semester: 1 },
  { id: "u2_2", word: "Tuesday", phonetic: "/ˈtuːzdeɪ/", meaning: "星期二", example: "We have art on Tuesday.", unit: "Unit 2", semester: 1 },
  { id: "u2_3", word: "Wednesday", phonetic: "/ˈwenzdeɪ/", meaning: "星期三", example: "It's Wednesday today.", unit: "Unit 2", semester: 1 },
  { id: "u2_4", word: "Thursday", phonetic: "/ˈθɜːrzdeɪ/", meaning: "星期四", example: "We have music on Thursday.", unit: "Unit 2", semester: 1 },
  { id: "u2_5", word: "Friday", phonetic: "/ˈfraɪdeɪ/", meaning: "星期五", example: "Friday is fun!", unit: "Unit 2", semester: 1 },
  { id: "u2_6", word: "Saturday", phonetic: "/ˈsætərdeɪ/", meaning: "星期六", example: "I play football on Saturday.", unit: "Unit 2", semester: 1 },
  { id: "u2_7", word: "Sunday", phonetic: "/ˈsʌndeɪ/", meaning: "星期日", example: "Sunday is my day off.", unit: "Unit 2", semester: 1 },
  { id: "u2_8", word: "subject", phonetic: "/ˈsʌbdʒɪkt/", meaning: "学科；科目", example: "My favourite subject is science.", unit: "Unit 2", semester: 1 },
  { id: "u2_9", word: "favourite", phonetic: "/ˈfeɪvərɪt/", meaning: "最喜爱的", example: "What is your favourite food?", unit: "Unit 2", semester: 1 },
  { id: "u2_10", word: "science", phonetic: "/ˈsaɪəns/", meaning: "科学", example: "Science is interesting.", unit: "Unit 2", semester: 1 },
  { id: "u2_11", word: "computer", phonetic: "/kəmˈpjuːtər/", meaning: "电脑；计算机", example: "I use a computer every day.", unit: "Unit 2", semester: 1 },

  // 上册 Unit 3 - What's Your Favourite Food?
  { id: "u3_1", word: "eggplant", phonetic: "/ˈeɡplænt/", meaning: "茄子", example: "I like eggplant.", unit: "Unit 3", semester: 1 },
  { id: "u3_2", word: "green beans", phonetic: "/ɡriːn biːnz/", meaning: "青豆；四季豆", example: "Green beans are healthy.", unit: "Unit 3", semester: 1 },
  { id: "u3_3", word: "tofu", phonetic: "/ˈtoʊfuː/", meaning: "豆腐", example: "I eat tofu every day.", unit: "Unit 3", semester: 1 },
  { id: "u3_4", word: "mutton", phonetic: "/ˈmʌtən/", meaning: "羊肉", example: "Do you like mutton?", unit: "Unit 3", semester: 1 },
  { id: "u3_5", word: "potato", phonetic: "/pəˈteɪtoʊ/", meaning: "土豆；马铃薯", example: "I want a potato.", unit: "Unit 3", semester: 1 },
  { id: "u3_6", word: "tomato", phonetic: "/təˈmeɪtoʊ/", meaning: "西红柿", example: "Tomatoes are red.", unit: "Unit 3", semester: 1 },
  { id: "u3_7", word: "tasty", phonetic: "/ˈteɪsti/", meaning: "好吃的；美味的", example: "This food is tasty!", unit: "Unit 3", semester: 1 },
  { id: "u3_8", word: "healthy", phonetic: "/ˈhelθi/", meaning: "健康的", example: "Fruits are healthy.", unit: "Unit 3", semester: 1 },
  { id: "u3_9", word: "sour", phonetic: "/saʊər/", meaning: "酸的", example: "Lemons are sour.", unit: "Unit 3", semester: 1 },
  { id: "u3_10", word: "sweet", phonetic: "/swiːt/", meaning: "甜的", example: "Candy is sweet.", unit: "Unit 3", semester: 1 },

  // 上册 Unit 4 - What Can You Do?
  { id: "u4_1", word: "cook", phonetic: "/kʊk/", meaning: "做饭；烹调", example: "My mum can cook well.", unit: "Unit 4", semester: 1 },
  { id: "u4_2", word: "clean", phonetic: "/kliːn/", meaning: "打扫；清洁", example: "I can clean the room.", unit: "Unit 4", semester: 1 },
  { id: "u4_3", word: "wash clothes", phonetic: "/wɒʃ kloʊðz/", meaning: "洗衣服", example: "Can you wash clothes?", unit: "Unit 4", semester: 1 },
  { id: "u4_4", word: "water flowers", phonetic: "/ˈwɔːtər ˈflaʊərz/", meaning: "浇花", example: "I water flowers every morning.", unit: "Unit 4", semester: 1 },
  { id: "u4_5", word: "set the table", phonetic: "/set ðə ˈteɪbəl/", meaning: "摆桌子", example: "Please set the table.", unit: "Unit 4", semester: 1 },
  { id: "u4_6", word: "sweep the floor", phonetic: "/swiːp ðə flɔːr/", meaning: "扫地", example: "He sweeps the floor.", unit: "Unit 4", semester: 1 },
  { id: "u4_7", word: "do the dishes", phonetic: "/duː ðə ˈdɪʃɪz/", meaning: "洗碗", example: "She does the dishes.", unit: "Unit 4", semester: 1 },
  { id: "u4_8", word: "make the bed", phonetic: "/meɪk ðə bed/", meaning: "整理床铺", example: "I make the bed every day.", unit: "Unit 4", semester: 1 },
  { id: "u4_9", word: "use a computer", phonetic: "/juːz ə kəmˈpjuːtər/", meaning: "使用电脑", example: "Can you use a computer?", unit: "Unit 4", semester: 1 },

  // 上册 Unit 5 - Whose Dog Is It?
  { id: "u5_1", word: "tiger", phonetic: "/ˈtaɪɡər/", meaning: "老虎", example: "A tiger is in the zoo.", unit: "Unit 5", semester: 1 },
  { id: "u5_2", word: "elephant", phonetic: "/ˈelɪfənt/", meaning: "大象", example: "Elephants are big.", unit: "Unit 5", semester: 1 },
  { id: "u5_3", word: "mouse", phonetic: "/maʊs/", meaning: "鼠；老鼠", example: "A mouse is small.", unit: "Unit 5", semester: 1 },
  { id: "u5_4", word: "snake", phonetic: "/sneɪk/", meaning: "蛇", example: "A snake can swim.", unit: "Unit 5", semester: 1 },
  { id: "u5_5", word: "strong", phonetic: "/strɒŋ/", meaning: "强壮的", example: "The tiger is strong.", unit: "Unit 5", semester: 1 },
  { id: "u5_6", word: "gentle", phonetic: "/ˈdʒentəl/", meaning: "温柔的；温顺的", example: "The sheep is gentle.", unit: "Unit 5", semester: 1 },
  { id: "u5_7", word: "ugly", phonetic: "/ˈʌɡli/", meaning: "丑陋的", example: "Is it ugly?", unit: "Unit 5", semester: 1 },
  { id: "u5_8", word: "cute", phonetic: "/kjuːt/", meaning: "可爱的", example: "The puppy is cute.", unit: "Unit 5", semester: 1 },
  { id: "u5_9", word: "scary", phonetic: "/ˈskeri/", meaning: "可怕的", example: "The spider is scary.", unit: "Unit 5", semester: 1 },

  // 上册 Unit 6 - In a Nature Park
  { id: "u6_1", word: "forest", phonetic: "/ˈfɔːrɪst/", meaning: "森林", example: "There is a big forest.", unit: "Unit 6", semester: 1 },
  { id: "u6_2", word: "river", phonetic: "/ˈrɪvər/", meaning: "河流", example: "The river is long.", unit: "Unit 6", semester: 1 },
  { id: "u6_3", word: "lake", phonetic: "/leɪk/", meaning: "湖", example: "We swim in the lake.", unit: "Unit 6", semester: 1 },
  { id: "u6_4", word: "mountain", phonetic: "/ˈmaʊntən/", meaning: "山", example: "The mountain is high.", unit: "Unit 6", semester: 1 },
  { id: "u6_5", word: "hill", phonetic: "/hɪl/", meaning: "小山；丘陵", example: "There are hills nearby.", unit: "Unit 6", semester: 1 },
  { id: "u6_6", word: "bridge", phonetic: "/brɪdʒ/", meaning: "桥", example: "Let's cross the bridge.", unit: "Unit 6", semester: 1 },
  { id: "u6_7", word: "path", phonetic: "/pæθ/", meaning: "小路；小径", example: "Follow the path.", unit: "Unit 6", semester: 1 },
  { id: "u6_8", word: "building", phonetic: "/ˈbɪldɪŋ/", meaning: "建筑物", example: "It is a tall building.", unit: "Unit 6", semester: 1 },

  // 下册 Unit 1 - My Future
  { id: "d1_1", word: "engineer", phonetic: "/ˌendʒɪˈnɪər/", meaning: "工程师", example: "I want to be an engineer.", unit: "Unit 1", semester: 2 },
  { id: "d1_2", word: "actress", phonetic: "/ˈæktrəs/", meaning: "女演员", example: "She wants to be an actress.", unit: "Unit 1", semester: 2 },
  { id: "d1_3", word: "pilot", phonetic: "/ˈpaɪlət/", meaning: "飞行员", example: "My dad is a pilot.", unit: "Unit 1", semester: 2 },
  { id: "d1_4", word: "writer", phonetic: "/ˈraɪtər/", meaning: "作家", example: "I want to be a writer.", unit: "Unit 1", semester: 2 },
  { id: "d1_5", word: "scientist", phonetic: "/ˈsaɪəntɪst/", meaning: "科学家", example: "Scientists do research.", unit: "Unit 1", semester: 2 },
  { id: "d1_6", word: "coach", phonetic: "/koʊtʃ/", meaning: "教练", example: "Our coach is strict.", unit: "Unit 1", semester: 2 },
  { id: "d1_7", word: "future", phonetic: "/ˈfjuːtʃər/", meaning: "未来；将来", example: "What will you do in the future?", unit: "Unit 1", semester: 2 },
  { id: "d1_8", word: "dream", phonetic: "/driːm/", meaning: "梦想；梦", example: "My dream is to fly.", unit: "Unit 1", semester: 2 },

  // 下册 Unit 2 - The Days of the Week
  { id: "d2_1", word: "usually", phonetic: "/ˈjuːʒuəli/", meaning: "通常；经常", example: "I usually get up at 7.", unit: "Unit 2", semester: 2 },
  { id: "d2_2", word: "sometimes", phonetic: "/ˈsʌmtaɪmz/", meaning: "有时；有时候", example: "I sometimes go hiking.", unit: "Unit 2", semester: 2 },
  { id: "d2_3", word: "often", phonetic: "/ˈɔːfən/", meaning: "经常；常常", example: "She often reads books.", unit: "Unit 2", semester: 2 },
  { id: "d2_4", word: "always", phonetic: "/ˈɔːlweɪz/", meaning: "总是；一直", example: "He always helps others.", unit: "Unit 2", semester: 2 },
  { id: "d2_5", word: "never", phonetic: "/ˈnevər/", meaning: "从不；绝不", example: "I never eat sweets.", unit: "Unit 2", semester: 2 },
  { id: "d2_6", word: "homework", phonetic: "/ˈhoʊmwɜːrk/", meaning: "家庭作业", example: "I do homework after school.", unit: "Unit 2", semester: 2 },
  { id: "d2_7", word: "exercise", phonetic: "/ˈeksərsaɪz/", meaning: "锻炼；练习", example: "I exercise every day.", unit: "Unit 2", semester: 2 },
  { id: "d2_8", word: "read a book", phonetic: "/riːd ə bʊk/", meaning: "读书", example: "I read a book at night.", unit: "Unit 2", semester: 2 },
  { id: "d2_9", word: "watch TV", phonetic: "/wɒtʃ ˌtiːˈviː/", meaning: "看电视", example: "I watch TV on weekends.", unit: "Unit 2", semester: 2 },

  // 下册 Unit 3 - Weather
  { id: "d3_1", word: "spring", phonetic: "/sprɪŋ/", meaning: "春天；春季", example: "Spring is warm and wet.", unit: "Unit 3", semester: 2 },
  { id: "d3_2", word: "summer", phonetic: "/ˈsʌmər/", meaning: "夏天；夏季", example: "Summer is hot.", unit: "Unit 3", semester: 2 },
  { id: "d3_3", word: "autumn", phonetic: "/ˈɔːtəm/", meaning: "秋天；秋季", example: "Autumn is cool.", unit: "Unit 3", semester: 2 },
  { id: "d3_4", word: "winter", phonetic: "/ˈwɪntər/", meaning: "冬天；冬季", example: "Winter is cold.", unit: "Unit 3", semester: 2 },
  { id: "d3_5", word: "season", phonetic: "/ˈsiːzən/", meaning: "季节", example: "What season do you like?", unit: "Unit 3", semester: 2 },
  { id: "d3_6", word: "weather", phonetic: "/ˈweðər/", meaning: "天气", example: "What's the weather like?", unit: "Unit 3", semester: 2 },
  { id: "d3_7", word: "warm", phonetic: "/wɔːrm/", meaning: "暖和的", example: "It is warm in spring.", unit: "Unit 3", semester: 2 },
  { id: "d3_8", word: "cool", phonetic: "/kuːl/", meaning: "凉爽的", example: "It is cool in autumn.", unit: "Unit 3", semester: 2 },
  { id: "d3_9", word: "rainy", phonetic: "/ˈreɪni/", meaning: "多雨的；下雨的", example: "It is rainy today.", unit: "Unit 3", semester: 2 },
  { id: "d3_10", word: "snowy", phonetic: "/ˈsnoʊi/", meaning: "多雪的；下雪的", example: "It is snowy in winter.", unit: "Unit 3", semester: 2 },
  { id: "d3_11", word: "windy", phonetic: "/ˈwɪndi/", meaning: "刮风的；有风的", example: "It is windy outside.", unit: "Unit 3", semester: 2 },
  { id: "d3_12", word: "cloudy", phonetic: "/ˈklaʊdi/", meaning: "多云的；阴天的", example: "It is cloudy today.", unit: "Unit 3", semester: 2 },
  { id: "d3_13", word: "sunny", phonetic: "/ˈsʌni/", meaning: "晴朗的；阳光充足的", example: "It is sunny and hot.", unit: "Unit 3", semester: 2 },

  // 下册 Unit 4 - When Is Your Birthday?
  { id: "d4_1", word: "January", phonetic: "/ˈdʒænjueri/", meaning: "一月", example: "January is the first month.", unit: "Unit 4", semester: 2 },
  { id: "d4_2", word: "February", phonetic: "/ˈfebrueri/", meaning: "二月", example: "My birthday is in February.", unit: "Unit 4", semester: 2 },
  { id: "d4_3", word: "March", phonetic: "/mɑːrtʃ/", meaning: "三月", example: "Spring starts in March.", unit: "Unit 4", semester: 2 },
  { id: "d4_4", word: "April", phonetic: "/ˈeɪprəl/", meaning: "四月", example: "April has thirty days.", unit: "Unit 4", semester: 2 },
  { id: "d4_5", word: "May", phonetic: "/meɪ/", meaning: "五月", example: "Labour Day is in May.", unit: "Unit 4", semester: 2 },
  { id: "d4_6", word: "June", phonetic: "/dʒuːn/", meaning: "六月", example: "Children's Day is in June.", unit: "Unit 4", semester: 2 },
  { id: "d4_7", word: "July", phonetic: "/dʒuˈlaɪ/", meaning: "七月", example: "July is hot.", unit: "Unit 4", semester: 2 },
  { id: "d4_8", word: "August", phonetic: "/ˈɔːɡəst/", meaning: "八月", example: "My dad's birthday is in August.", unit: "Unit 4", semester: 2 },
  { id: "d4_9", word: "September", phonetic: "/sepˈtembər/", meaning: "九月", example: "School starts in September.", unit: "Unit 4", semester: 2 },
  { id: "d4_10", word: "October", phonetic: "/ɒkˈtoʊbər/", meaning: "十月", example: "National Day is in October.", unit: "Unit 4", semester: 2 },
  { id: "d4_11", word: "November", phonetic: "/noʊˈvembər/", meaning: "十一月", example: "November is cool.", unit: "Unit 4", semester: 2 },
  { id: "d4_12", word: "December", phonetic: "/dɪˈsembər/", meaning: "十二月", example: "Christmas is in December.", unit: "Unit 4", semester: 2 },
  { id: "d4_13", word: "birthday", phonetic: "/ˈbɜːrθdeɪ/", meaning: "生日", example: "When is your birthday?", unit: "Unit 4", semester: 2 },

  // 下册 Unit 5 - Whose Dog Is It?
  { id: "d5_1", word: "library", phonetic: "/ˈlaɪbreri/", meaning: "图书馆", example: "I go to the library.", unit: "Unit 5", semester: 2 },
  { id: "d5_2", word: "post office", phonetic: "/poʊst ˈɒfɪs/", meaning: "邮局", example: "Where is the post office?", unit: "Unit 5", semester: 2 },
  { id: "d5_3", word: "hospital", phonetic: "/ˈhɒspɪtəl/", meaning: "医院", example: "My aunt works in a hospital.", unit: "Unit 5", semester: 2 },
  { id: "d5_4", word: "cinema", phonetic: "/ˈsɪnɪmə/", meaning: "电影院", example: "Let's go to the cinema.", unit: "Unit 5", semester: 2 },
  { id: "d5_5", word: "bookstore", phonetic: "/ˈbʊkstɔːr/", meaning: "书店", example: "I buy books at the bookstore.", unit: "Unit 5", semester: 2 },
  { id: "d5_6", word: "supermarket", phonetic: "/ˈsuːpərmɑːrkɪt/", meaning: "超市", example: "We shop at the supermarket.", unit: "Unit 5", semester: 2 },
  { id: "d5_7", word: "restaurant", phonetic: "/ˈrestrɒnt/", meaning: "餐厅；饭店", example: "We eat at a restaurant.", unit: "Unit 5", semester: 2 },

  // 下册 Unit 6 - In a Nature Park
  { id: "d6_1", word: "traffic light", phonetic: "/ˈtræfɪk laɪt/", meaning: "红绿灯", example: "Stop at the red traffic light.", unit: "Unit 6", semester: 2 },
  { id: "d6_2", word: "left", phonetic: "/left/", meaning: "左边；向左", example: "Turn left here.", unit: "Unit 6", semester: 2 },
  { id: "d6_3", word: "right", phonetic: "/raɪt/", meaning: "右边；向右", example: "Turn right at the corner.", unit: "Unit 6", semester: 2 },
  { id: "d6_4", word: "straight", phonetic: "/streɪt/", meaning: "直走；笔直的", example: "Go straight ahead.", unit: "Unit 6", semester: 2 },
  { id: "d6_5", word: "far", phonetic: "/fɑːr/", meaning: "远的；遥远", example: "Is it far from here?", unit: "Unit 6", semester: 2 },
  { id: "d6_6", word: "near", phonetic: "/nɪər/", meaning: "近的；附近", example: "The school is near.", unit: "Unit 6", semester: 2 },
  { id: "d6_7", word: "next to", phonetic: "/nekst tuː/", meaning: "紧靠；在…旁边", example: "The bank is next to the school.", unit: "Unit 6", semester: 2 },
  { id: "d6_8", word: "across from", phonetic: "/əˈkrɒs frɒm/", meaning: "在…对面", example: "The park is across from the bank.", unit: "Unit 6", semester: 2 },
];

export const getWordsByUnit = (unit: string, semester: 1 | 2) =>
  WORDS.filter(w => w.unit === unit && w.semester === semester);

export const getAllUnits = () => {
  const units = new Set(WORDS.map(w => `${w.semester}-${w.unit}`));
  return Array.from(units).map(key => {
    const [sem, ...unitParts] = key.split('-');
    return { semester: Number(sem) as 1 | 2, unit: unitParts.join('-') };
  });
};
