export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  unit: string;
  grade: number;
  semester: 1 | 2;
}

export interface WordBook {
  grade: number;
  semester: 1 | 2;
  label: string;
  words: Word[];
}

/** Helper to build a Word */
const w = (
  grade: number, sem: 1 | 2, unit: string, idx: number,
  word: string, phonetic: string, meaning: string, example: string
): Word => ({
  id: `g${grade}s${sem}_${unit}_${idx}`,
  word, phonetic, meaning, example, unit, grade, semester: sem,
});

// ════════════════════════════════════════════════════════════════
//  一年级上册 Grade 1 Semester 1
// ════════════════════════════════════════════════════════════════
const G1S1: Word[] = [
  // Colors
  w(1,1,'colors',1,'red','/red/','红色的','I see a red apple.'),
  w(1,1,'colors',2,'yellow','/ˈjeloʊ/','黄色的','The sun is yellow.'),
  w(1,1,'colors',3,'blue','/bluː/','蓝色的','The sky is blue.'),
  w(1,1,'colors',4,'green','/ɡriːn/','绿色的','Leaves are green.'),
  w(1,1,'colors',5,'white','/waɪt/','白色的','Snow is white.'),
  w(1,1,'colors',6,'black','/blæk/','黑色的','The cat is black.'),
  w(1,1,'colors',7,'purple','/ˈpɜːrpl/','紫色的','She likes purple.'),
  w(1,1,'colors',8,'pink','/pɪŋk/','粉色的','The flower is pink.'),
  w(1,1,'colors',9,'orange','/ˈɔːrɪndʒ/','橙色的','An orange is orange.'),
  w(1,1,'colors',10,'brown','/braʊn/','棕色的','The bear is brown.'),
  // Numbers
  w(1,1,'numbers',1,'one','/wʌn/','一','I have one dog.'),
  w(1,1,'numbers',2,'two','/tuː/','二','I see two birds.'),
  w(1,1,'numbers',3,'three','/θriː/','三','Three cats play.'),
  w(1,1,'numbers',4,'four','/fɔːr/','四','Four ducks swim.'),
  w(1,1,'numbers',5,'five','/faɪv/','五','Five fish swim.'),
  w(1,1,'numbers',6,'six','/sɪks/','六','Six eggs in a nest.'),
  w(1,1,'numbers',7,'seven','/ˈsevən/','七','Seven stars shine.'),
  w(1,1,'numbers',8,'eight','/eɪt/','八','Eight apples on the tree.'),
  w(1,1,'numbers',9,'nine','/naɪn/','九','Nine flowers bloom.'),
  w(1,1,'numbers',10,'ten','/ten/','十','Ten fingers.'),
  // Greetings
  w(1,1,'greetings',1,'hello','/həˈloʊ/','你好','Hello! I am Lucy.'),
  w(1,1,'greetings',2,'hi','/haɪ/','嗨；你好','Hi! How are you?'),
  w(1,1,'greetings',3,'goodbye','/ˌɡʊdˈbaɪ/','再见','Goodbye! See you tomorrow.'),
  w(1,1,'greetings',4,'please','/pliːz/','请','Please sit down.'),
  w(1,1,'greetings',5,'thank you','/θæŋk juː/','谢谢','Thank you very much.'),
  w(1,1,'greetings',6,'sorry','/ˈsɔːri/','对不起','I am sorry.'),
  w(1,1,'greetings',7,'yes','/jes/','是；对','Yes, I can.'),
  w(1,1,'greetings',8,'no','/noʊ/','不；不是','No, I cannot.'),
  // Shapes
  w(1,1,'shapes',1,'circle','/ˈsɜːrkl/','圆形','Draw a circle.'),
  w(1,1,'shapes',2,'square','/skwer/','正方形','A square has four sides.'),
  w(1,1,'shapes',3,'triangle','/ˈtraɪæŋɡl/','三角形','A triangle has three corners.'),
  w(1,1,'shapes',4,'star','/stɑːr/','星形；星星','I see a bright star.'),
  w(1,1,'shapes',5,'heart','/hɑːrt/','心形；心','Draw a red heart.'),
];

// ════════════════════════════════════════════════════════════════
//  一年级下册 Grade 1 Semester 2
// ════════════════════════════════════════════════════════════════
const G1S2: Word[] = [
  // Animals
  w(1,2,'animals',1,'cat','/kæt/','猫','The cat is cute.'),
  w(1,2,'animals',2,'dog','/dɔːɡ/','狗','My dog is big.'),
  w(1,2,'animals',3,'bird','/bɜːrd/','鸟','A bird can fly.'),
  w(1,2,'animals',4,'fish','/fɪʃ/','鱼','Fish swim in water.'),
  w(1,2,'animals',5,'rabbit','/ˈræbɪt/','兔子','The rabbit is white.'),
  w(1,2,'animals',6,'panda','/ˈpændə/','熊猫','I love pandas.'),
  w(1,2,'animals',7,'monkey','/ˈmʌŋki/','猴子','Monkeys like bananas.'),
  w(1,2,'animals',8,'duck','/dʌk/','鸭子','The duck says quack.'),
  w(1,2,'animals',9,'bear','/ber/','熊','The bear is brown.'),
  w(1,2,'animals',10,'pig','/pɪɡ/','猪','The pig is pink.'),
  // Body parts
  w(1,2,'body',1,'head','/hed/','头','Touch your head.'),
  w(1,2,'body',2,'eye','/aɪ/','眼睛','I have two eyes.'),
  w(1,2,'body',3,'ear','/ɪr/','耳朵','My ears are small.'),
  w(1,2,'body',4,'nose','/noʊz/','鼻子','My nose is long.'),
  w(1,2,'body',5,'mouth','/maʊθ/','嘴巴','Open your mouth.'),
  w(1,2,'body',6,'hand','/hænd/','手','Wash your hands.'),
  w(1,2,'body',7,'foot','/fʊt/','脚','My feet are big.'),
  w(1,2,'body',8,'arm','/ɑːrm/','胳膊；手臂','Wave your arms.'),
  w(1,2,'body',9,'leg','/leɡ/','腿','I have two legs.'),
  w(1,2,'body',10,'hair','/her/','头发','Her hair is long.'),
  // Family
  w(1,2,'family',1,'mother','/ˈmʌðər/','妈妈；母亲','My mother is kind.'),
  w(1,2,'family',2,'father','/ˈfɑːðər/','爸爸；父亲','My father is tall.'),
  w(1,2,'family',3,'sister','/ˈsɪstər/','姐妹','My sister is funny.'),
  w(1,2,'family',4,'brother','/ˈbrʌðər/','兄弟','My brother is smart.'),
  w(1,2,'family',5,'grandmother','/ˈɡrændmʌðər/','奶奶；姥姥','My grandmother cooks well.'),
  w(1,2,'family',6,'grandfather','/ˈɡrændfɑːðər/','爷爷；姥爷','My grandfather tells stories.'),
  w(1,2,'family',7,'baby','/ˈbeɪbi/','婴儿；宝宝','The baby is sleeping.'),
  // Adjectives
  w(1,2,'adjectives',1,'big','/bɪɡ/','大的','An elephant is big.'),
  w(1,2,'adjectives',2,'small','/smɔːl/','小的','A mouse is small.'),
  w(1,2,'adjectives',3,'tall','/tɔːl/','高的','The tree is tall.'),
  w(1,2,'adjectives',4,'short','/ʃɔːrt/','矮的；短的','My friend is short.'),
  w(1,2,'adjectives',5,'fat','/fæt/','胖的','The panda is fat.'),
  w(1,2,'adjectives',6,'thin','/θɪn/','瘦的','The cat is thin.'),
  w(1,2,'adjectives',7,'cute','/kjuːt/','可爱的','The puppy is cute.'),
];

// ════════════════════════════════════════════════════════════════
//  二年级上册 Grade 2 Semester 1
// ════════════════════════════════════════════════════════════════
const G2S1: Word[] = [
  // School supplies
  w(2,1,'school',1,'pen','/pen/','钢笔；圆珠笔','I write with a pen.'),
  w(2,1,'school',2,'pencil','/ˈpensəl/','铅笔','Use a pencil to draw.'),
  w(2,1,'school',3,'eraser','/ɪˈreɪsər/','橡皮擦','Can I use your eraser?'),
  w(2,1,'school',4,'ruler','/ˈruːlər/','尺子','The ruler is 30 cm.'),
  w(2,1,'school',5,'book','/bʊk/','书','I read a book.'),
  w(2,1,'school',6,'bag','/bæɡ/','书包；包','My bag is heavy.'),
  w(2,1,'school',7,'pencil case','/ˈpensəl keɪs/','铅笔盒','My pencil case is blue.'),
  w(2,1,'school',8,'notebook','/ˈnoʊtbʊk/','笔记本','Write in your notebook.'),
  w(2,1,'school',9,'desk','/desk/','课桌；书桌','Sit at your desk.'),
  w(2,1,'school',10,'chair','/tʃer/','椅子','Sit on the chair.'),
  w(2,1,'school',11,'blackboard','/ˈblækbɔːrd/','黑板','Look at the blackboard.'),
  w(2,1,'school',12,'classroom','/ˈklæsruːm/','教室','Our classroom is clean.'),
  // Days of week
  w(2,1,'days',1,'Monday','/ˈmʌndeɪ/','星期一','Monday is the first day.'),
  w(2,1,'days',2,'Tuesday','/ˈtuːzdeɪ/','星期二','We have PE on Tuesday.'),
  w(2,1,'days',3,'Wednesday','/ˈwenzdeɪ/','星期三','Wednesday is in the middle.'),
  w(2,1,'days',4,'Thursday','/ˈθɜːrzdeɪ/','星期四','I like Thursday.'),
  w(2,1,'days',5,'Friday','/ˈfraɪdeɪ/','星期五','Friday is fun!'),
  w(2,1,'days',6,'Saturday','/ˈsætərdeɪ/','星期六','I rest on Saturday.'),
  w(2,1,'days',7,'Sunday','/ˈsʌndeɪ/','星期日','Sunday is a holiday.'),
  w(2,1,'days',8,'weekend','/ˈwiːkend/','周末','I love the weekend.'),
  // Actions/verbs
  w(2,1,'actions',1,'run','/rʌn/','跑步','I can run fast.'),
  w(2,1,'actions',2,'jump','/dʒʌmp/','跳','Can you jump high?'),
  w(2,1,'actions',3,'swim','/swɪm/','游泳','Fish can swim.'),
  w(2,1,'actions',4,'fly','/flaɪ/','飞','Birds can fly.'),
  w(2,1,'actions',5,'dance','/dæns/','跳舞','I love to dance.'),
  w(2,1,'actions',6,'sing','/sɪŋ/','唱歌','Can you sing?'),
  w(2,1,'actions',7,'read','/riːd/','读；阅读','I read every day.'),
  w(2,1,'actions',8,'write','/raɪt/','写','Write your name.'),
  w(2,1,'actions',9,'draw','/drɔː/','画画','I like to draw.'),
  w(2,1,'actions',10,'play','/pleɪ/','玩；演奏','Let us play together.'),
];

// ════════════════════════════════════════════════════════════════
//  二年级下册 Grade 2 Semester 2
// ════════════════════════════════════════════════════════════════
const G2S2: Word[] = [
  // Food & drink
  w(2,2,'food',1,'rice','/raɪs/','米饭','I eat rice every day.'),
  w(2,2,'food',2,'noodles','/ˈnuːdlz/','面条','I like noodles.'),
  w(2,2,'food',3,'bread','/bred/','面包','Bread is my breakfast.'),
  w(2,2,'food',4,'milk','/mɪlk/','牛奶','Drink your milk.'),
  w(2,2,'food',5,'juice','/dʒuːs/','果汁','Apple juice is sweet.'),
  w(2,2,'food',6,'egg','/eɡ/','鸡蛋','I eat one egg a day.'),
  w(2,2,'food',7,'cake','/keɪk/','蛋糕','The cake is sweet.'),
  w(2,2,'food',8,'apple','/ˈæpl/','苹果','An apple a day is healthy.'),
  w(2,2,'food',9,'banana','/bəˈnænə/','香蕉','Monkeys like bananas.'),
  w(2,2,'food',10,'water','/ˈwɔːtər/','水','Drink more water.'),
  // Clothes
  w(2,2,'clothes',1,'coat','/koʊt/','外套；大衣','Wear a coat in winter.'),
  w(2,2,'clothes',2,'jacket','/ˈdʒækɪt/','夹克；上衣','His jacket is blue.'),
  w(2,2,'clothes',3,'shirt','/ʃɜːrt/','衬衫','He wears a white shirt.'),
  w(2,2,'clothes',4,'dress','/dres/','连衣裙','She wears a pink dress.'),
  w(2,2,'clothes',5,'skirt','/skɜːrt/','裙子','The skirt is short.'),
  w(2,2,'clothes',6,'pants','/pænts/','裤子','His pants are black.'),
  w(2,2,'clothes',7,'shoes','/ʃuːz/','鞋子','My shoes are red.'),
  w(2,2,'clothes',8,'hat','/hæt/','帽子','Put on your hat.'),
  w(2,2,'clothes',9,'socks','/sɑːks/','袜子','My socks are white.'),
  // Feelings
  w(2,2,'feelings',1,'happy','/ˈhæpi/','高兴的；快乐的','I am happy today.'),
  w(2,2,'feelings',2,'sad','/sæd/','伤心的；难过的','She is sad.'),
  w(2,2,'feelings',3,'angry','/ˈæŋɡri/','生气的','Don\'t be angry.'),
  w(2,2,'feelings',4,'scared','/skerd/','害怕的','I am scared of thunder.'),
  w(2,2,'feelings',5,'tired','/taɪrd/','疲倦的','I am tired now.'),
  w(2,2,'feelings',6,'hungry','/ˈhʌŋɡri/','饥饿的','I am hungry.'),
  w(2,2,'feelings',7,'thirsty','/ˈθɜːrsti/','口渴的','I am thirsty.'),
  // Time
  w(2,2,'time',1,'morning','/ˈmɔːrnɪŋ/','早晨；上午','Good morning!'),
  w(2,2,'time',2,'afternoon','/ˌæftərˈnuːn/','下午','See you this afternoon.'),
  w(2,2,'time',3,'evening','/ˈiːvnɪŋ/','傍晚；晚上','Good evening!'),
  w(2,2,'time',4,'night','/naɪt/','夜晚','Good night!'),
  w(2,2,'time',5,'today','/təˈdeɪ/','今天','What day is today?'),
  w(2,2,'time',6,'tomorrow','/təˈmɑːroʊ/','明天','See you tomorrow!'),
  w(2,2,'time',7,'yesterday','/ˈjestərdeɪ/','昨天','I went to the park yesterday.'),
];

// ════════════════════════════════════════════════════════════════
//  三年级上册 PEP Grade 3 Semester 1
// ════════════════════════════════════════════════════════════════
const G3S1: Word[] = [
  // Unit 1 - Greetings & Introduction
  w(3,1,'U1',1,'name','/neɪm/','名字','What\'s your name?'),
  w(3,1,'U1',2,'teacher','/ˈtiːtʃər/','老师','My teacher is Miss Li.'),
  w(3,1,'U1',3,'student','/ˈstuːdənt/','学生','I am a student.'),
  w(3,1,'U1',4,'friend','/frend/','朋友','She is my best friend.'),
  w(3,1,'U1',5,'class','/klæs/','班级；课','We are in the same class.'),
  w(3,1,'U1',6,'school','/skuːl/','学校','I go to school by bus.'),
  // Unit 2 - Colors & Classroom
  w(3,1,'U2',1,'colour','/ˈkʌlər/','颜色','What colour is it?'),
  w(3,1,'U2',2,'window','/ˈwɪndoʊ/','窗户','Open the window please.'),
  w(3,1,'U2',3,'door','/dɔːr/','门','Close the door.'),
  w(3,1,'U2',4,'picture','/ˈpɪktʃər/','图画；照片','Draw a picture.'),
  w(3,1,'U2',5,'light','/laɪt/','灯；光','Turn on the light.'),
  w(3,1,'U2',6,'fan','/fæn/','电风扇','Turn on the fan.'),
  // Unit 3 - Animals at the Zoo
  w(3,1,'U3',1,'tiger','/ˈtaɪɡər/','老虎','The tiger is strong.'),
  w(3,1,'U3',2,'elephant','/ˈelɪfənt/','大象','Elephants have big ears.'),
  w(3,1,'U3',3,'lion','/ˈlaɪən/','狮子','The lion roars loudly.'),
  w(3,1,'U3',4,'giraffe','/dʒɪˈræf/','长颈鹿','The giraffe has a long neck.'),
  w(3,1,'U3',5,'zebra','/ˈziːbrə/','斑马','The zebra has stripes.'),
  w(3,1,'U3',6,'crocodile','/ˈkrɑːkədaɪl/','鳄鱼','Crocodiles live in rivers.'),
  w(3,1,'U3',7,'hippo','/ˈhɪpoʊ/','河马','Hippos like water.'),
  w(3,1,'U3',8,'kangaroo','/ˌkæŋɡəˈruː/','袋鼠','Kangaroos live in Australia.'),
  // Unit 4 - Food
  w(3,1,'U4',1,'beef','/biːf/','牛肉','I like beef noodles.'),
  w(3,1,'U4',2,'pork','/pɔːrk/','猪肉','Pork dumplings are yummy.'),
  w(3,1,'U4',3,'chicken','/ˈtʃɪkɪn/','鸡肉','I love roast chicken.'),
  w(3,1,'U4',4,'soup','/suːp/','汤','The soup is hot.'),
  w(3,1,'U4',5,'salad','/ˈsæləd/','沙拉','The salad is fresh.'),
  w(3,1,'U4',6,'hamburger','/ˈhæmbɜːrɡər/','汉堡包','I want a hamburger.'),
  w(3,1,'U4',7,'hot dog','/hɑːt dɑːɡ/','热狗','He eats a hot dog.'),
  w(3,1,'U4',8,'sandwich','/ˈsænwɪdʒ/','三明治','She has a sandwich.'),
  // Unit 5 - Numbers & Birthday
  w(3,1,'U5',1,'eleven','/ɪˈlevən/','十一','There are eleven apples.'),
  w(3,1,'U5',2,'twelve','/twelv/','十二','She is twelve years old.'),
  w(3,1,'U5',3,'thirteen','/ˌθɜːrˈtiːn/','十三','He is thirteen.'),
  w(3,1,'U5',4,'fourteen','/ˌfɔːrˈtiːn/','十四','I am fourteen.'),
  w(3,1,'U5',5,'fifteen','/ˌfɪfˈtiːn/','十五','There are fifteen students.'),
  w(3,1,'U5',6,'twenty','/ˈtwenti/','二十','Twenty students in class.'),
  w(3,1,'U5',7,'birthday','/ˈbɜːrθdeɪ/','生日','Happy birthday to you!'),
  w(3,1,'U5',8,'present','/ˈprezənt/','礼物','I got a nice present.'),
  w(3,1,'U5',9,'candle','/ˈkændl/','蜡烛','Blow out the candles!'),
  // Unit 6 - Actions
  w(3,1,'U6',1,'walk','/wɔːk/','走路；步行','I walk to school.'),
  w(3,1,'U6',2,'stop','/stɑːp/','停止；停','Stop at the red light.'),
  w(3,1,'U6',3,'look','/lʊk/','看；瞧','Look at the board.'),
  w(3,1,'U6',4,'listen','/ˈlɪsən/','听','Listen to the teacher.'),
  w(3,1,'U6',5,'speak','/spiːk/','说；讲','Speak louder please.'),
  w(3,1,'U6',6,'sit','/sɪt/','坐','Sit down please.'),
  w(3,1,'U6',7,'stand','/stænd/','站立','Stand up please.'),
];

// ════════════════════════════════════════════════════════════════
//  三年级下册 PEP Grade 3 Semester 2
// ════════════════════════════════════════════════════════════════
const G3S2: Word[] = [
  // Unit 1 - Back to School
  w(3,2,'U1',1,'new','/njuː/','新的','I have a new friend.'),
  w(3,2,'U1',2,'classmate','/ˈklæsmeɪt/','同学；同班同学','She is my classmate.'),
  w(3,2,'U1',3,'nice','/naɪs/','好的；美好的','Nice to meet you!'),
  w(3,2,'U1',4,'meet','/miːt/','遇见；见到','Nice to meet you.'),
  w(3,2,'U1',5,'welcome','/ˈwelkəm/','欢迎','Welcome to our class.'),
  // Unit 2 - My Week
  w(3,2,'U2',1,'usually','/ˈjuːʒuəli/','通常；一般','I usually go to bed at 9.'),
  w(3,2,'U2',2,'sometimes','/ˈsʌmtaɪmz/','有时候','I sometimes play games.'),
  w(3,2,'U2',3,'often','/ˈɔːfən/','经常','She often reads books.'),
  w(3,2,'U2',4,'always','/ˈɔːlweɪz/','总是','He always helps others.'),
  w(3,2,'U2',5,'never','/ˈnevər/','从不','I never eat junk food.'),
  w(3,2,'U2',6,'homework','/ˈhoʊmwɜːrk/','家庭作业','I do homework after school.'),
  w(3,2,'U2',7,'go shopping','/ɡoʊ ˈʃɑːpɪŋ/','去购物','Mum goes shopping on Saturday.'),
  w(3,2,'U2',8,'watch TV','/wɑːtʃ ˌtiːˈviː/','看电视','We watch TV together.'),
  // Unit 3 - Weather
  w(3,2,'U3',1,'weather','/ˈweðər/','天气','What\'s the weather like?'),
  w(3,2,'U3',2,'sunny','/ˈsʌni/','晴天的','It is sunny today.'),
  w(3,2,'U3',3,'cloudy','/ˈklaʊdi/','多云的','It is cloudy outside.'),
  w(3,2,'U3',4,'rainy','/ˈreɪni/','下雨的','It is rainy today.'),
  w(3,2,'U3',5,'snowy','/ˈsnoʊi/','下雪的','It is snowy in winter.'),
  w(3,2,'U3',6,'windy','/ˈwɪndi/','刮风的','It is windy and cold.'),
  w(3,2,'U3',7,'warm','/wɔːrm/','暖和的','Spring is warm.'),
  w(3,2,'U3',8,'cool','/kuːl/','凉爽的','Autumn is cool.'),
  w(3,2,'U3',9,'cold','/koʊld/','寒冷的','Winter is cold.'),
  w(3,2,'U3',10,'hot','/hɑːt/','炎热的','Summer is hot.'),
  // Unit 4 - Rooms
  w(3,2,'U4',1,'living room','/ˈlɪvɪŋ ruːm/','客厅','We watch TV in the living room.'),
  w(3,2,'U4',2,'bedroom','/ˈbedruːm/','卧室；寝室','I sleep in my bedroom.'),
  w(3,2,'U4',3,'kitchen','/ˈkɪtʃɪn/','厨房','Mum cooks in the kitchen.'),
  w(3,2,'U4',4,'bathroom','/ˈbæθruːm/','浴室；卫生间','Wash hands in the bathroom.'),
  w(3,2,'U4',5,'study','/ˈstʌdi/','书房','Dad reads in the study.'),
  w(3,2,'U4',6,'sofa','/ˈsoʊfə/','沙发','Sit on the sofa.'),
  w(3,2,'U4',7,'table','/ˈteɪbl/','桌子','Put it on the table.'),
  // Unit 5 - Fruits
  w(3,2,'U5',1,'pear','/per/','梨','The pear is sweet.'),
  w(3,2,'U5',2,'orange','/ˈɔːrɪndʒ/','橙子','I drink orange juice.'),
  w(3,2,'U5',3,'grape','/ɡreɪp/','葡萄','Grapes are purple.'),
  w(3,2,'U5',4,'strawberry','/ˈstrɔːberi/','草莓','Strawberries are red.'),
  w(3,2,'U5',5,'watermelon','/ˈwɔːtərmelən/','西瓜','Watermelon is cool and sweet.'),
  w(3,2,'U5',6,'peach','/piːtʃ/','桃子','The peach is soft.'),
  w(3,2,'U5',7,'mango','/ˈmæŋɡoʊ/','芒果','Mangoes are yellow.'),
  // Unit 6 - Nature
  w(3,2,'U6',1,'butterfly','/ˈbʌtərflaɪ/','蝴蝶','The butterfly is beautiful.'),
  w(3,2,'U6',2,'bee','/biː/','蜜蜂','Bees make honey.'),
  w(3,2,'U6',3,'frog','/frɔːɡ/','青蛙','Frogs jump high.'),
  w(3,2,'U6',4,'ant','/ænt/','蚂蚁','Ants are very small.'),
  w(3,2,'U6',5,'dragonfly','/ˈdræɡənflaɪ/','蜻蜓','Dragonflies fly fast.'),
  w(3,2,'U6',6,'grasshopper','/ˈɡræshɑːpər/','蚱蜢','Grasshoppers jump far.'),
];

// ════════════════════════════════════════════════════════════════
//  四年级上册 PEP Grade 4 Semester 1
// ════════════════════════════════════════════════════════════════
const G4S1: Word[] = [
  // Unit 1 - My classroom
  w(4,1,'U1',1,'floor','/flɔːr/','地板；楼层','The floor is clean.'),
  w(4,1,'U1',2,'computer','/kəmˈpjuːtər/','电脑','I use a computer.'),
  w(4,1,'U1',3,'board','/bɔːrd/','黑板；板','Write on the board.'),
  w(4,1,'U1',4,'teacher\'s desk','/ˈtiːtʃərz desk/','讲台','The book is on the teacher\'s desk.'),
  w(4,1,'U1',5,'clean','/kliːn/','干净的；打扫','The room is clean.'),
  w(4,1,'U1',6,'near','/nɪr/','在…附近；近的','The school is near.'),
  w(4,1,'U1',7,'behind','/bɪˈhaɪnd/','在…后面','I sit behind Tom.'),
  w(4,1,'U1',8,'in front of','/ɪn frʌnt ɒv/','在…前面','Stand in front of the door.'),
  // Unit 2 - My schoolbag
  w(4,1,'U2',1,'Chinese book','/ˈtʃaɪniːz bʊk/','语文书','I have a Chinese book.'),
  w(4,1,'U2',2,'English book','/ˈɪŋɡlɪʃ bʊk/','英语书','My English book is new.'),
  w(4,1,'U2',3,'maths book','/mæθs bʊk/','数学书','The maths book is thick.'),
  w(4,1,'U2',4,'story book','/ˈstɔːri bʊk/','故事书','I love story books.'),
  w(4,1,'U2',5,'dictionary','/ˈdɪkʃəneri/','字典；词典','Use a dictionary.'),
  w(4,1,'U2',6,'heavy','/ˈhevi/','重的','My bag is heavy.'),
  w(4,1,'U2',7,'light','/laɪt/','轻的；灯','This bag is light.'),
  w(4,1,'U2',8,'how many','/haʊ ˈmeni/','多少（可数）','How many books are there?'),
  // Unit 3 - My friends (adjectives)
  w(4,1,'U3',1,'young','/jʌŋ/','年轻的','My teacher is young.'),
  w(4,1,'U3',2,'kind','/kaɪnd/','和蔼的；善良的','She is very kind.'),
  w(4,1,'U3',3,'funny','/ˈfʌni/','有趣的','The story is funny.'),
  w(4,1,'U3',4,'strict','/strɪkt/','严格的','Our teacher is strict.'),
  w(4,1,'U3',5,'smart','/smɑːrt/','聪明的','He is a smart boy.'),
  w(4,1,'U3',6,'active','/ˈæktɪv/','积极的；活跃的','She is very active.'),
  w(4,1,'U3',7,'quiet','/ˈkwaɪət/','安静的','The library is quiet.'),
  w(4,1,'U3',8,'hard-working','/ˌhɑːrd ˈwɜːrkɪŋ/','勤劳的；努力的','She is hard-working.'),
  w(4,1,'U3',9,'polite','/pəˈlaɪt/','有礼貌的','Be polite to others.'),
  w(4,1,'U3',10,'clever','/ˈklevər/','聪明的；机灵的','The fox is clever.'),
  // Unit 4 - My home
  w(4,1,'U4',1,'home','/hoʊm/','家；住所','I am at home.'),
  w(4,1,'U4',2,'garden','/ˈɡɑːrdn/','花园；庭院','Flowers grow in the garden.'),
  w(4,1,'U4',3,'bed','/bed/','床','Go to bed early.'),
  w(4,1,'U4',4,'shelf','/ʃelf/','书架；架子','Books are on the shelf.'),
  w(4,1,'U4',5,'telephone','/ˈteləfoʊn/','电话；座机','The telephone is ringing.'),
  w(4,1,'U4',6,'curtain','/ˈkɜːrtn/','窗帘','Close the curtains.'),
  w(4,1,'U4',7,'mirror','/ˈmɪrər/','镜子','Look in the mirror.'),
  // Unit 5 - Dinner's ready
  w(4,1,'U5',1,'tofu','/ˈtoʊfuː/','豆腐','I eat tofu every day.'),
  w(4,1,'U5',2,'eggplant','/ˈeɡplænt/','茄子','I like eggplant.'),
  w(4,1,'U5',3,'green beans','/ɡriːn biːnz/','青豆；四季豆','Green beans are healthy.'),
  w(4,1,'U5',4,'potato','/pəˈteɪtoʊ/','土豆；马铃薯','French fries are made of potato.'),
  w(4,1,'U5',5,'tomato','/təˈmeɪtoʊ/','西红柿','Tomatoes are red.'),
  w(4,1,'U5',6,'mutton','/ˈmʌtən/','羊肉','Do you like mutton?'),
  w(4,1,'U5',7,'tasty','/ˈteɪsti/','好吃的；美味的','The food is tasty!'),
  w(4,1,'U5',8,'healthy','/ˈhelθi/','健康的','Eat healthy food.'),
  w(4,1,'U5',9,'sour','/saʊər/','酸的','Lemons are sour.'),
  w(4,1,'U5',10,'sweet','/swiːt/','甜的','Honey is sweet.'),
  // Unit 6 - Meet my family / Jobs
  w(4,1,'U6',1,'uncle','/ˈʌŋkl/','叔叔；舅舅；伯伯','My uncle is a doctor.'),
  w(4,1,'U6',2,'aunt','/ænt/','阿姨；姑姑','My aunt works at a hospital.'),
  w(4,1,'U6',3,'cousin','/ˈkʌzn/','表（堂）兄弟姐妹','My cousin is funny.'),
  w(4,1,'U6',4,'doctor','/ˈdɑːktər/','医生','She is a doctor.'),
  w(4,1,'U6',5,'nurse','/nɜːrs/','护士','My mum is a nurse.'),
  w(4,1,'U6',6,'farmer','/ˈfɑːrmər/','农民','The farmer grows vegetables.'),
  w(4,1,'U6',7,'driver','/ˈdraɪvər/','司机','The driver drives carefully.'),
  w(4,1,'U6',8,'cook','/kʊk/','厨师；烹饪','He is a cook.'),
];

// ════════════════════════════════════════════════════════════════
//  四年级下册 PEP Grade 4 Semester 2  ← 默认
// ════════════════════════════════════════════════════════════════
const G4S2: Word[] = [
  // Unit 1 - Places at school
  w(4,2,'U1',1,'library','/ˈlaɪbreri/','图书馆','I go to the library.'),
  w(4,2,'U1',2,'computer room','/kəmˈpjuːtər ruːm/','计算机室','We have class in the computer room.'),
  w(4,2,'U1',3,'art room','/ɑːrt ruːm/','美术教室','I paint in the art room.'),
  w(4,2,'U1',4,'music room','/ˈmjuːzɪk ruːm/','音乐教室','We sing in the music room.'),
  w(4,2,'U1',5,'gym','/dʒɪm/','体育馆','We exercise in the gym.'),
  w(4,2,'U1',6,'playground','/ˈpleɪɡraʊnd/','操场；游乐场','We play on the playground.'),
  w(4,2,'U1',7,'canteen','/kænˈtiːn/','食堂','I eat lunch in the canteen.'),
  w(4,2,'U1',8,'first','/fɜːrst/','第一','She is the first student.'),
  w(4,2,'U1',9,'second','/ˈsekənd/','第二','He is on the second floor.'),
  w(4,2,'U1',10,'third','/θɜːrd/','第三','The classroom is on the third floor.'),
  // Unit 2 - What time is it?
  w(4,2,'U2',1,'time','/taɪm/','时间','What time is it?'),
  w(4,2,'U2',2,'o\'clock','/əˈklɑːk/','…点钟','It is three o\'clock.'),
  w(4,2,'U2',3,'half','/hæf/','一半；半','Half past seven.'),
  w(4,2,'U2',4,'get up','/ɡet ʌp/','起床','I get up at seven.'),
  w(4,2,'U2',5,'go to school','/ɡoʊ tə skuːl/','上学','I go to school at eight.'),
  w(4,2,'U2',6,'breakfast','/ˈbrekfəst/','早餐','I eat breakfast at 7:30.'),
  w(4,2,'U2',7,'lunch','/lʌntʃ/','午餐','Let\'s have lunch.'),
  w(4,2,'U2',8,'dinner','/ˈdɪnər/','晚餐','Dinner is at six.'),
  w(4,2,'U2',9,'go to bed','/ɡoʊ tə bed/','上床睡觉','Go to bed at nine.'),
  w(4,2,'U2',10,'do homework','/duː ˈhoʊmwɜːrk/','做作业','I do homework after dinner.'),
  // Unit 3 - Seasons & weather
  w(4,2,'U3',1,'spring','/sprɪŋ/','春天；春季','Spring is warm and wet.'),
  w(4,2,'U3',2,'summer','/ˈsʌmər/','夏天；夏季','Summer is hot.'),
  w(4,2,'U3',3,'autumn','/ˈɔːtəm/','秋天；秋季','Autumn is cool.'),
  w(4,2,'U3',4,'winter','/ˈwɪntər/','冬天；冬季','Winter is cold.'),
  w(4,2,'U3',5,'season','/ˈsiːzən/','季节','What is your favourite season?'),
  w(4,2,'U3',6,'rain','/reɪn/','雨；下雨','I love the rain.'),
  w(4,2,'U3',7,'snow','/snoʊ/','雪；下雪','It snows in winter.'),
  w(4,2,'U3',8,'wind','/wɪnd/','风','The wind is strong.'),
  w(4,2,'U3',9,'fog','/fɔːɡ/','雾','There is fog in the morning.'),
  // Unit 4 - Outdoor activities
  w(4,2,'U4',1,'fly a kite','/flaɪ ə kaɪt/','放风筝','We fly kites in spring.'),
  w(4,2,'U4',2,'plant trees','/plænt triːz/','种树','We plant trees in spring.'),
  w(4,2,'U4',3,'go swimming','/ɡoʊ ˈswɪmɪŋ/','去游泳','I go swimming in summer.'),
  w(4,2,'U4',4,'go skiing','/ɡoʊ ˈskiːɪŋ/','去滑雪','I go skiing in winter.'),
  w(4,2,'U4',5,'make a snowman','/meɪk ə ˈsnoʊmæn/','堆雪人','Let\'s make a snowman.'),
  w(4,2,'U4',6,'pick apples','/pɪk ˈæplz/','摘苹果','We pick apples in autumn.'),
  w(4,2,'U4',7,'harvest','/ˈhɑːrvɪst/','收获；丰收','Autumn is harvest time.'),
  // Unit 5 - Clothes
  w(4,2,'U5',1,'sweater','/ˈswetər/','毛衣；运动衫','My sweater is warm.'),
  w(4,2,'U5',2,'T-shirt','/ˈtiːʃɜːrt/','T恤','I wear a T-shirt in summer.'),
  w(4,2,'U5',3,'jeans','/dʒiːnz/','牛仔裤','She wears blue jeans.'),
  w(4,2,'U5',4,'boots','/buːts/','靴子','She wears boots in winter.'),
  w(4,2,'U5',5,'scarf','/skɑːrf/','围巾','Wear a scarf in winter.'),
  w(4,2,'U5',6,'gloves','/ɡlʌvz/','手套','My gloves are red.'),
  w(4,2,'U5',7,'umbrella','/ʌmˈbrelə/','雨伞','Take an umbrella.'),
  w(4,2,'U5',8,'raincoat','/ˈreɪnkoʊt/','雨衣','She wears a raincoat.'),
  // Unit 6 - Shopping & prices
  w(4,2,'U6',1,'supermarket','/ˈsuːpərmɑːrkɪt/','超市','We shop at the supermarket.'),
  w(4,2,'U6',2,'market','/ˈmɑːrkɪt/','市场；菜市场','Mum buys food at the market.'),
  w(4,2,'U6',3,'shop','/ʃɑːp/','商店；购物','Let\'s go to the shop.'),
  w(4,2,'U6',4,'price','/praɪs/','价格','What is the price?'),
  w(4,2,'U6',5,'cheap','/tʃiːp/','便宜的','This bag is cheap.'),
  w(4,2,'U6',6,'expensive','/ɪkˈspensɪv/','昂贵的','That coat is expensive.'),
  w(4,2,'U6',7,'buy','/baɪ/','买','I want to buy a book.'),
  w(4,2,'U6',8,'how much','/haʊ mʌtʃ/','多少钱','How much is this?'),
  w(4,2,'U6',9,'yuan','/juːˈɑːn/','元（人民币）','It costs ten yuan.'),
];

// ════════════════════════════════════════════════════════════════
//  Export
// ════════════════════════════════════════════════════════════════

export const WORD_BOOKS: WordBook[] = [
  { grade: 1, semester: 1, label: '一年级上册', words: G1S1 },
  { grade: 1, semester: 2, label: '一年级下册', words: G1S2 },
  { grade: 2, semester: 1, label: '二年级上册', words: G2S1 },
  { grade: 2, semester: 2, label: '二年级下册', words: G2S2 },
  { grade: 3, semester: 1, label: '三年级上册', words: G3S1 },
  { grade: 3, semester: 2, label: '三年级下册', words: G3S2 },
  { grade: 4, semester: 1, label: '四年级上册', words: G4S1 },
  { grade: 4, semester: 2, label: '四年级下册', words: G4S2 },
];

export const DEFAULT_GRADE = 4;
export const DEFAULT_SEMESTER: 1 | 2 = 2;

export function getWordBook(grade: number, semester: 1 | 2): WordBook | undefined {
  return WORD_BOOKS.find(b => b.grade === grade && b.semester === semester);
}

/** All words across all books (for cross-reference in wrong-notes / stats) */
export const ALL_WORDS: Word[] = WORD_BOOKS.flatMap(b => b.words);
