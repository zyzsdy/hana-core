import Hana from './hana'
import Tokenizer from './Tokenizer';

let lyric = `day by day 日に日に募るの乙女心
おんなじクラス斜め前のおとなしい人
カッコ良くはない だけど優しい
いつも頼れる彼

after school 恋愛相談の帰り道
なんだって話せる親友の女の子
スポーツ万能 勉強もできて
女子力MAXです

どこにでもある
よくあること
急に彼女が
「あのね、実は私好きな人がいるの…！」って
ちょ、マジで！？

三角形 三角形の恋はきまぐれ
一瞬で 一瞬でくずれるバランス
ベタなマンガみたいなフラグ
まさかね自分が立てちゃうなんて残念すぎます！

三角形 三角形の恋は不安定
なんちゃって なんちゃってじゃ済まないカテゴリー
恋と友情ゆらゆらめいて
なんか青春しちゃいます
わたし困っちゃいます

完敗です！お似合いすぎるわ勝てっこない
くやしいけどとかそんなんじゃなくて本心
てゆーかすでに応援モード
むしろ清々しい

だけど彼女は
不思議な顔
真剣な目で
「そうじゃなくて、私あなたが好き…ゴメン」って
ちょ、マジで！？

三角形 三角形の恋はきまぐれ
一瞬で 一瞬でくずれるバランス
わたしアナタ彼女とわたし
超絶！複雑！百合展開は想定外です！

三角形 三角形の恋は不安定
なんちゃって なんちゃってじゃ済まないカテゴリー
解けないパズル与えたもうた
神よ恨んじゃいます
わたし悩んじゃいます

「あーっ！もう！スゴいヤバい！」
「好きだよ？好きだけど…って、そういう意味じゃなくって！」
「だって…女の子同士だし…」
「ねえ神様、どうしたらいいの？」
「わたし、どうしたいの？」
「ヘルプミ???！！！」

なんか変だー 愛に国境も歳も性別もカンケーない！
けど、けど、けど！

三角形 三角形の恋はきまぐれ
一瞬で 一瞬でくずれるバランス
普通の恋 夢みてたのに
ノーマル設定のわたしじゃちょっと無理ゲーすぎます！

三角形 三角形の恋は不安定
なんちゃって なんちゃってじゃ済まないカテゴリー
彼女のこと好きになれたら
なんて妄想しちゃいます
…わたしどうかしてます`;


new Hana().init((err, Tokenizer, self) => {
    lyric.split('\n').forEach(line => {
        //console.log(line);
        //var tokens = Tokenizer.tokenize(line);
        console.log(self.convert(line));
    });
})