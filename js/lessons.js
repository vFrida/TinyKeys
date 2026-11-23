(function () {
  const S = (keys, mean, read) => {
    const step = { keys: keys, mean: mean };
    if (read) step.read = read;
    return step;
  };

  const LESSONS = [
    {
      id: "en-fj",
      track: "en",
      title: "食指回家",
      blurb: "F 和 J，食指的家",
      spotlight: ["f", "j"],
      intro: "把两只食指放在 F 和 J 上。这两颗键有一条小凸起，不用低头也能摸到家。键盘上印的是大写字母，打出来是小写，不用按 Shift。",
      steps: [
        S("fff jjj", "左一下，右一下"),
        S("fj fj fj", "一对一对按"),
        S("f j f j", "中间记得空格"),
        S("jjj fff", "换边再来"),
        S("fjf jfj", "左右左右"),
        S("fj fj", "食指记住家")
      ]
    },
    {
      id: "en-dk",
      track: "en",
      title: "中指到位",
      blurb: "D 和 K，交给中指",
      spotlight: ["d", "k"],
      intro: "中指放在 D 和 K 上。食指仍然守着 F 和 J，不要整只手跟着搬家。",
      steps: [
        S("ddd kkk", "中指点一点"),
        S("dk dk dk", "左中指，右中指"),
        S("d k d k", "空格把它们分开"),
        S("kkk ddd", "先右再左"),
        S("dkd kdk", "中指交替"),
        S("fd jk", "食指和中指做邻居")
      ]
    },
    {
      id: "en-sl",
      track: "en",
      title: "无名指",
      blurb: "S 和 L，无名指出发",
      spotlight: ["s", "l"],
      intro: "无名指放在 S 和 L 上。只动这一根手指，其余手指留在原来的家。",
      steps: [
        S("sss lll", "无名指轻轻点"),
        S("sl sl sl", "左右无名指"),
        S("s l s l", "中间有空格"),
        S("lll sss", "换一只手"),
        S("sls lsl", "交替一下"),
        S("fs jl", "加上食指")
      ]
    },
    {
      id: "en-a",
      track: "en",
      title: "小指到边上",
      blurb: "A 和分号，小指负责",
      spotlight: ["a", ";"],
      intro: "小指负责最边上的键。左手小指按 A，右手小指按分号。手掌不要跟着滑出去。",
      steps: [
        S("aaa ;;;", "小指点边上"),
        S("a; a; a;", "左右小指"),
        S("a ; a ;", "空格也用拇指"),
        S(";;; aaa", "先右再左"),
        S("a;a ;a;", "小指交替"),
        S("as ;l", "小指和无名指")
      ]
    },
    {
      id: "en-home",
      track: "en",
      title: "基准键小词",
      blurb: "用家里的键拼单词",
      spotlight: [],
      intro: "现在只用基准键拼小单词。忘记位置时，看发亮的键，不要猜。",
      steps: [
        S("sad", "伤心"),
        S("dad", "爸爸"),
        S("all", "全部"),
        S("fall", "落下"),
        S("salad", "沙拉"),
        S("ask", "问一问")
      ]
    },
    {
      id: "en-reach",
      track: "en",
      title: "往上够一够",
      blurb: "E、I、G、H 四个新键",
      spotlight: ["e", "i", "g", "h"],
      intro: "G 紧挨着 F，H 紧挨着 J，还是用食指。E 和 I 在中指上方，中指往上够一够就回来。",
      steps: [
        S("ggg hhh", "食指往中间靠"),
        S("eee iii", "中指往上够"),
        S("egg", "鸡蛋"),
        S("she", "她"),
        S("fish", "鱼"),
        S("high", "高")
      ]
    },
    {
      id: "en-words",
      track: "en",
      title: "小小单词",
      blurb: "猫、狗、书和太阳",
      spotlight: ["b", "c", "m", "n", "o", "r", "t", "w"],
      intro: "这些单词里有新字母。发亮的键会告诉你用哪根手指，按完就回到基准键上。",
      steps: [
        S("cat", "猫"),
        S("dog", "狗"),
        S("sun", "太阳"),
        S("milk", "牛奶"),
        S("book", "书"),
        S("water", "水")
      ]
    },
    {
      id: "en-talk",
      track: "en",
      title: "短句出发",
      blurb: "把单词连成一句话",
      spotlight: ["p", "q", "v", "x", "y", "z"],
      intro: "单词和单词之间按空格，用大拇指。大圆里一次只看一个字母，按对了再看下一个。",
      steps: [
        S("yes we can", "我们可以"),
        S("we jump", "我们跳"),
        S("a big red fox", "一只大红狐狸"),
        S("mom loves me", "妈妈爱我"),
        S("quiet", "安静"),
        S("pizza", "披萨")
      ]
    },
    {
      id: "py-aoe",
      track: "py",
      title: "韵母 a o e",
      blurb: "先认识三个单韵母",
      spotlight: ["a", "o", "e"],
      intro: "拼音用英文字母来写。这一课只有 a、o、e。带声调的读音先读出来，打字时只打字母，不打声调。",
      steps: [
        S("a o e", "三个单韵母"),
        S("a a a", "韵母 a", "ā á ǎ"),
        S("o o o", "韵母 o", "ō ó ǒ"),
        S("e e e", "韵母 e", "ē é ě"),
        S("a o", "两个连着打"),
        S("o e", "再换一个")
      ]
    },
    {
      id: "py-iuv",
      track: "py",
      title: "i u 和 ü",
      blurb: "ü 在键盘上是 V",
      spotlight: ["i", "u", "v"],
      intro: "i 和 u 也是韵母。拼音里的 ü 键盘上没有，看到 ü 就用左手食指按 V。",
      steps: [
        S("i i i", "韵母 i", "ī í ǐ"),
        S("u u u", "韵母 u", "ū ú ǔ"),
        S("v v v", "看到 ü 就按 V", "ü ü ü"),
        S("iu", "连在一起"),
        S("ui", "换个顺序"),
        S("nv lv", "女，驴", "nǚ lǘ")
      ]
    },
    {
      id: "py-bpmf",
      track: "py",
      title: "声母 b p m f",
      blurb: "声母在前，韵母在后",
      spotlight: ["b", "p", "m", "f"],
      intro: "声母在前，韵母在后。ba 就是 b 加上 a。声调仍然只读不打。",
      steps: [
        S("ba", "八", "bā"),
        S("pa", "爬", "pá"),
        S("ma", "妈", "mā"),
        S("fa", "发", "fā"),
        S("ba ba", "爸爸", "bà ba"),
        S("ma ma", "妈妈", "mā ma")
      ]
    },
    {
      id: "py-dtnl",
      track: "py",
      title: "声母 d t n l",
      blurb: "大、他、你、牛",
      spotlight: ["d", "t", "n", "l"],
      intro: "再学四个声母。一个音节里的字母要连着打，中间不要加空格。",
      steps: [
        S("da", "大", "dà"),
        S("ta", "他", "tā"),
        S("ni", "你", "nǐ"),
        S("le", "了", "le"),
        S("di", "地", "dì"),
        S("niu", "牛", "niú")
      ]
    },
    {
      id: "py-gkh",
      track: "py",
      title: "声母 g k h",
      blurb: "哥、喝、哭、鼓",
      spotlight: ["g", "k", "h"],
      intro: "g、k、h 是一组声母。打完一个字母，手指回到原来的基准键上。",
      steps: [
        S("ge", "哥", "gē"),
        S("he", "喝", "hē"),
        S("ku", "哭", "kū"),
        S("gu", "鼓", "gǔ"),
        S("ke", "可", "kě"),
        S("ge ge", "哥哥", "gē ge")
      ]
    },
    {
      id: "py-jqx",
      track: "py",
      title: "声母 j q x",
      blurb: "鸡、七、西、学校",
      spotlight: ["j", "q", "x"],
      intro: "j、q、x 常常和 i、u、ü 做朋友。这一课先把音节打熟。",
      steps: [
        S("ji", "鸡", "jī"),
        S("qi", "七", "qī"),
        S("xi", "西", "xī"),
        S("qu", "去", "qù"),
        S("xiao", "小", "xiǎo"),
        S("xue xiao", "学校", "xué xiào")
      ]
    },
    {
      id: "py-zh",
      track: "py",
      title: "翘舌和平舌",
      blurb: "zh ch sh 要按两个字母",
      spotlight: ["z", "c", "s", "h"],
      intro: "zh、ch、sh 是两个字母连着按，先按前面的 z、c、s，马上再按 h。z、c、s 单独出现时只按一次。",
      steps: [
        S("zhi", "知", "zhī"),
        S("chi", "吃", "chī"),
        S("shi", "狮", "shī"),
        S("zi", "字", "zì"),
        S("cai", "菜", "cài"),
        S("shui", "水", "shuǐ")
      ]
    },
    {
      id: "py-daily",
      track: "py",
      title: "家里的话",
      blurb: "你好、谢谢、我爱你",
      spotlight: ["w", "y"],
      intro: "把学过的拼音连起来。音节中间的空格用大拇指。ü 不会出现在这一课，w 和 y 是新字母。",
      steps: [
        S("wo", "我", "wǒ"),
        S("ni hao", "你好", "nǐ hǎo"),
        S("ye ye", "爷爷", "yé ye"),
        S("xie xie", "谢谢", "xiè xie"),
        S("zai jian", "再见", "zài jiàn"),
        S("wo ai ni", "我爱你", "wǒ ài nǐ")
      ]
    }
  ];

  window.TYPING_LESSONS = LESSONS;
  if (typeof module !== "undefined" && module.exports) module.exports = LESSONS;
})();
